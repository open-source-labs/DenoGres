// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

import { type Deferred, deferred } from "../async/deferred.ts";
import { _normalizeArgs, ListenOptions, Socket } from "./net.ts";
import { Buffer } from "./buffer.ts";
import { ERR_SERVER_NOT_RUNNING } from "./internal/errors.ts";
import { EventEmitter } from "./events.ts";
import { nextTick } from "./_next_tick.ts";
import { Status as STATUS_CODES } from "../http/http_status.ts";
import { validatePort } from "./internal/validators.mjs";
import {
  Readable as NodeReadable,
  Writable as NodeWritable,
} from "./stream.ts";
import { OutgoingMessage } from "./_http_outgoing.ts";
import { Agent } from "./_http_agent.mjs";
import { chunkExpression as RE_TE_CHUNKED } from "./_http_common.ts";
import { urlToHttpOptions } from "./internal/url.ts";
import { constants, TCP } from "./internal_binding/tcp_wrap.ts";

const METHODS = [
  "ACL",
  "BIND",
  "CHECKOUT",
  "CONNECT",
  "COPY",
  "DELETE",
  "GET",
  "HEAD",
  "LINK",
  "LOCK",
  "M-SEARCH",
  "MERGE",
  "MKACTIVITY",
  "MKCALENDAR",
  "MKCOL",
  "MOVE",
  "NOTIFY",
  "OPTIONS",
  "PATCH",
  "POST",
  "PROPFIND",
  "PROPPATCH",
  "PURGE",
  "PUT",
  "REBIND",
  "REPORT",
  "SEARCH",
  "SOURCE",
  "SUBSCRIBE",
  "TRACE",
  "UNBIND",
  "UNLINK",
  "UNLOCK",
  "UNSUBSCRIBE",
];

type Chunk = string | Buffer | Uint8Array;

// @ts-ignore Deno[Deno.internal] is used on purpose here
const DenoServe = Deno[Deno.internal]?.nodeUnstable?.serve || Deno.serve;
// @ts-ignore Deno[Deno.internal] is used on purpose here
const DenoUpgradeHttpRaw = Deno[Deno.internal]?.nodeUnstable?.upgradeHttpRaw ||
  Deno.upgradeHttpRaw;

const ENCODER = new TextEncoder();

export interface RequestOptions {
  agent?: Agent;
  auth?: string;
  createConnection?: () => unknown;
  defaultPort?: number;
  family?: number;
  headers?: Record<string, string>;
  hints?: number;
  host?: string;
  hostname?: string;
  insecureHTTPParser?: boolean;
  localAddress?: string;
  localPort?: number;
  lookup?: () => void;
  maxHeaderSize?: number;
  method?: string;
  path?: string;
  port?: number;
  protocol?: string;
  setHost?: boolean;
  socketPath?: string;
  timeout?: number;
  signal?: AbortSignal;
  href?: string;
}

// TODO: Implement ClientRequest methods (e.g. setHeader())
/** ClientRequest represents the http(s) request from the client */
class ClientRequest extends NodeWritable {
  defaultProtocol = "http:";
  body: null | ReadableStream = null;
  controller: ReadableStreamDefaultController | null = null;
  constructor(
    public opts: RequestOptions,
    public cb?: (res: IncomingMessageForClient) => void,
  ) {
    super();
  }

  // deno-lint-ignore no-explicit-any
  override _write(chunk: any, _enc: string, cb: () => void) {
    if (this.controller) {
      this.controller.enqueue(chunk);
      cb();
      return;
    }

    this.body = new ReadableStream({
      start: (controller) => {
        this.controller = controller;
        controller.enqueue(chunk);
        cb();
      },
    });
  }

  override async _final() {
    if (this.controller) {
      this.controller.close();
    }

    const body = await this._createBody(this.body, this.opts);
    const client = await this._createCustomClient();
    const opts = {
      body,
      method: this.opts.method,
      client,
      headers: this.opts.headers,
    };
    const mayResponse = fetch(this._createUrlStrFromOptions(this.opts), opts)
      .catch((e) => {
        if (e.message.includes("connection closed before message completed")) {
          // Node.js seems ignoring this error
        } else {
          this.emit("error", e);
        }
        return undefined;
      });
    const res = new IncomingMessageForClient(
      await mayResponse,
      this._createSocket(),
    );
    this.emit("response", res);
    if (client) {
      res.on("end", () => {
        client.close();
      });
    }
    this.cb?.(res);
  }

  abort() {
    this.destroy();
  }

  async _createBody(
    body: ReadableStream | null,
    opts: RequestOptions,
  ): Promise<Buffer | ReadableStream | null> {
    if (!body) return null;
    if (!opts.headers) return body;

    const headers = Object.fromEntries(
      Object.entries(opts.headers).map(([k, v]) => [k.toLowerCase(), v]),
    );

    if (
      !RE_TE_CHUNKED.test(headers["transfer-encoding"]) &&
      !Number.isNaN(Number.parseInt(headers["content-length"], 10))
    ) {
      const bufferList: Buffer[] = [];
      for await (const chunk of body) {
        bufferList.push(chunk);
      }
      return Buffer.concat(bufferList);
    }

    return body;
  }

  _createCustomClient(): Promise<Deno.HttpClient | undefined> {
    return Promise.resolve(undefined);
  }

  _createSocket(): Socket {
    // Note: Creates a dummy socket for the compatibility
    // Sometimes the libraries check some properties of socket
    // e.g. if (!response.socket.authorized) { ... }
    return new Socket({});
  }

  _createUrlStrFromOptions(opts: RequestOptions): string {
    if (opts.href) {
      return opts.href;
    }
    const protocol = opts.protocol ?? this.defaultProtocol;
    const auth = opts.auth;
    const host = opts.host ?? opts.hostname ?? "localhost";
    const defaultPort = opts.agent?.defaultPort;
    const port = opts.port ?? defaultPort ?? 80;
    let path = opts.path ?? "/";
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    return `${protocol}//${auth ? `${auth}@` : ""}${host}${
      port === 80 ? "" : `:${port}`
    }${path}`;
  }

  setTimeout() {
    console.log("not implemented: ClientRequest.setTimeout");
  }
}

/** IncomingMessage for http(s) client */
export class IncomingMessageForClient extends NodeReadable {
  reader: ReadableStreamDefaultReader | undefined;
  #statusMessage = "";
  constructor(public response: Response | undefined, public socket: Socket) {
    super();
    this.reader = response?.body?.getReader();
  }

  override async _read(_size: number) {
    if (this.reader === undefined) {
      this.push(null);
      return;
    }
    try {
      const res = await this.reader.read();
      if (res.done) {
        this.push(null);
        return;
      }
      this.push(res.value);
    } catch (e) {
      // deno-lint-ignore no-explicit-any
      this.destroy(e as any);
    }
  }

  get headers() {
    if (this.response) {
      return Object.fromEntries(this.response.headers.entries());
    }
    return {};
  }

  get trailers() {
    return {};
  }

  get statusCode() {
    return this.response?.status || 0;
  }

  get statusMessage() {
    return this.#statusMessage || this.response?.statusText || "";
  }

  set statusMessage(v: string) {
    this.#statusMessage = v;
  }
}

export class ServerResponse extends NodeWritable {
  statusCode?: number = undefined;
  statusMessage?: string = undefined;
  #headers = new Headers({});
  #readable: ReadableStream;
  override writable = true;
  // used by `npm:on-finished`
  finished = false;
  headersSent = false;
  #firstChunk: Chunk | null = null;
  // Used if --unstable flag IS NOT present
  #reqEvent?: Deno.RequestEvent;
  // Used if --unstable flag IS present
  #resolve?: (value: Response | PromiseLike<Response>) => void;
  #isFlashRequest: boolean;

  static #enqueue(controller: ReadableStreamDefaultController, chunk: Chunk) {
    // TODO(kt3k): This is a workaround for denoland/deno#17194
    // This if-block should be removed when the above issue is resolved.
    if (chunk.length === 0) {
      return;
    }
    if (typeof chunk === "string") {
      controller.enqueue(ENCODER.encode(chunk));
    } else {
      controller.enqueue(chunk);
    }
  }

  /** Returns true if the response body should be null with the given
   * http status code */
  static #bodyShouldBeNull(status: number) {
    return status === 101 || status === 204 || status === 205 || status === 304;
  }

  constructor(
    reqEvent: undefined | Deno.RequestEvent,
    resolve: undefined | ((value: Response | PromiseLike<Response>) => void),
  ) {
    let controller: ReadableByteStreamController;
    const readable = new ReadableStream({
      start(c) {
        controller = c as ReadableByteStreamController;
      },
    });
    super({
      autoDestroy: true,
      defaultEncoding: "utf-8",
      emitClose: true,
      write: (chunk, _encoding, cb) => {
        if (!this.headersSent) {
          if (this.#firstChunk === null) {
            this.#firstChunk = chunk;
            return cb();
          } else {
            ServerResponse.#enqueue(controller, this.#firstChunk);
            this.#firstChunk = null;
            this.respond(false);
          }
        }
        ServerResponse.#enqueue(controller, chunk);
        return cb();
      },
      final: (cb) => {
        if (this.#firstChunk) {
          this.respond(true, this.#firstChunk);
        } else if (!this.headersSent) {
          this.respond(true);
        }
        controller.close();
        return cb();
      },
      destroy: (err, cb) => {
        if (err) {
          controller.error(err);
        }
        return cb(null);
      },
    });
    this.#readable = readable;
    this.#resolve = resolve;
    this.#reqEvent = reqEvent;
    this.#isFlashRequest = typeof resolve !== "undefined";
  }

  setHeader(name: string, value: string) {
    this.#headers.set(name, value);
    return this;
  }

  getHeader(name: string) {
    return this.#headers.get(name);
  }
  removeHeader(name: string) {
    return this.#headers.delete(name);
  }
  getHeaderNames() {
    return Array.from(this.#headers.keys());
  }
  hasHeader(name: string) {
    return this.#headers.has(name);
  }

  writeHead(status: number, headers: Record<string, string>) {
    this.statusCode = status;
    for (const k in headers) {
      this.#headers.set(k, headers[k]);
    }
    return this;
  }

  #ensureHeaders(singleChunk?: Chunk) {
    if (this.statusCode === undefined) {
      this.statusCode = 200;
      this.statusMessage = "OK";
    }
    // Only taken if --unstable IS NOT present
    if (
      !this.#isFlashRequest && typeof singleChunk === "string" &&
      !this.hasHeader("content-type")
    ) {
      this.setHeader("content-type", "text/plain;charset=UTF-8");
    }
  }

  respond(final: boolean, singleChunk?: Chunk) {
    this.headersSent = true;
    this.#ensureHeaders(singleChunk);
    let body = singleChunk ?? (final ? null : this.#readable);
    if (ServerResponse.#bodyShouldBeNull(this.statusCode!)) {
      body = null;
    }
    if (this.#isFlashRequest) {
      this.#resolve!(
        new Response(body, {
          headers: this.#headers,
          status: this.statusCode,
          statusText: this.statusMessage,
        }),
      );
    } else {
      this.#reqEvent!.respondWith(
        new Response(body, {
          headers: this.#headers,
          status: this.statusCode,
          statusText: this.statusMessage,
        }),
      ).catch(() => {
        // ignore this error
      });
    }
  }

  // deno-lint-ignore no-explicit-any
  override end(chunk?: any, encoding?: any, cb?: any): this {
    this.finished = true;
    if (this.#isFlashRequest) {
      // Flash sets both of these headers.
      this.#headers.delete("transfer-encoding");
      this.#headers.delete("content-length");
    } else if (!chunk && this.#headers.has("transfer-encoding")) {
      // FIXME(bnoordhuis) Node sends a zero length chunked body instead, i.e.,
      // the trailing "0\r\n", but respondWith() just hangs when I try that.
      this.#headers.set("content-length", "0");
      this.#headers.delete("transfer-encoding");
    }

    // @ts-expect-error The signature for cb is stricter than the one implemented here
    return super.end(chunk, encoding, cb);
  }
}

// TODO(@AaronO): optimize
export class IncomingMessageForServer extends NodeReadable {
  #req: Request;
  url: string;
  method: string;

  constructor(req: Request) {
    // Check if no body (GET/HEAD/OPTIONS/...)
    const reader = req.body?.getReader();
    super({
      autoDestroy: true,
      emitClose: true,
      objectMode: false,
      read: async function (_size) {
        if (!reader) {
          return this.push(null);
        }

        try {
          const { value } = await reader!.read();
          this.push(value !== undefined ? Buffer.from(value) : null);
        } catch (err) {
          this.destroy(err as Error);
        }
      },
      destroy: (err, cb) => {
        reader?.cancel().finally(() => cb(err));
      },
    });
    // TODO: consider more robust path extraction, e.g:
    // url: (new URL(request.url).pathname),
    this.url = req.url?.slice(req.url.indexOf("/", 8));
    this.method = req.method;
    this.#req = req;
  }

  get aborted() {
    return false;
  }

  get httpVersion() {
    return "1.1";
  }

  get headers() {
    return Object.fromEntries(this.#req.headers.entries());
  }

  get upgrade(): boolean {
    return Boolean(
      this.#req.headers.get("connection")?.toLowerCase().includes("upgrade") &&
        this.#req.headers.get("upgrade"),
    );
  }
}

type ServerHandler = (
  req: IncomingMessageForServer,
  res: ServerResponse,
) => void;

export function Server(handler?: ServerHandler): ServerImpl {
  return new ServerImpl(handler);
}

class ServerImpl extends EventEmitter {
  #isFlashServer: boolean;

  #httpConnections: Set<Deno.HttpConn> = new Set();
  #listener?: Deno.Listener;

  #addr?: Deno.NetAddr;
  #hasClosed = false;
  #ac?: AbortController;
  #servePromise?: Deferred<void>;
  listening = false;

  constructor(handler?: ServerHandler) {
    super();
    // @ts-ignore Might be undefined without `--unstable` flag
    this.#isFlashServer = typeof DenoServe == "function";
    if (this.#isFlashServer) {
      this.#servePromise = deferred();
      this.#servePromise.then(() => this.emit("close"));
    }
    if (handler !== undefined) {
      this.on("request", handler);
    }
  }

  listen(...args: unknown[]): this {
    // TODO(bnoordhuis) Delegate to net.Server#listen().
    const normalized = _normalizeArgs(args);
    const options = normalized[0] as Partial<ListenOptions>;
    const cb = normalized[1];

    if (cb !== null) {
      // @ts-ignore change EventEmitter's sig to use CallableFunction
      this.once("listening", cb);
    }

    let port = 0;
    if (typeof options.port === "number" || typeof options.port === "string") {
      validatePort(options.port, "options.port");
      port = options.port | 0;
    }

    // TODO(bnoordhuis) Node prefers [::] when host is omitted,
    // we on the other hand default to 0.0.0.0.
    if (this.#isFlashServer) {
      const hostname = options.host ?? "0.0.0.0";
      this.#addr = {
        hostname,
        port,
      } as Deno.NetAddr;
      this.listening = true;
      nextTick(() => this.#serve());
    } else {
      this.listening = true;
      const hostname = options.host ?? "";
      this.#listener = Deno.listen({ port, hostname });
      nextTick(() => this.#listenLoop());
    }

    return this;
  }

  async #listenLoop() {
    const go = async (httpConn: Deno.HttpConn) => {
      try {
        for (;;) {
          let reqEvent = null;
          try {
            // Note: httpConn.nextRequest() calls httpConn.close() on error.
            reqEvent = await httpConn.nextRequest();
          } catch {
            // Connection closed.
            // TODO(bnoordhuis) Emit "clientError" event on the http.Server
            // instance? Node emits it when request parsing fails and expects
            // the listener to send a raw 4xx HTTP response on the underlying
            // net.Socket but we don't have one to pass to the listener.
          }
          if (reqEvent === null) {
            break;
          }
          const req = new IncomingMessageForServer(reqEvent.request);
          const res = new ServerResponse(reqEvent, undefined);
          this.emit("request", req, res);
        }
      } finally {
        this.#httpConnections.delete(httpConn);
      }
    };

    const listener = this.#listener;

    if (listener !== undefined) {
      this.emit("listening");

      for await (const conn of listener) {
        let httpConn: Deno.HttpConn;
        try {
          httpConn = Deno.serveHttp(conn);
        } catch {
          continue; /// Connection closed.
        }

        this.#httpConnections.add(httpConn);
        go(httpConn);
      }
    }
  }

  #serve() {
    const ac = new AbortController();
    const handler = (request: Request) => {
      const req = new IncomingMessageForServer(request);
      if (req.upgrade && this.listenerCount("upgrade") > 0) {
        const [conn, head] = DenoUpgradeHttpRaw(request) as [
          Deno.Conn,
          Uint8Array,
        ];
        const socket = new Socket({
          handle: new TCP(constants.SERVER, conn),
        });
        this.emit("upgrade", req, socket, Buffer.from(head));
      } else {
        return new Promise<Response>((resolve): void => {
          const res = new ServerResponse(undefined, resolve);
          this.emit("request", req, res);
        });
      }
    };

    if (this.#hasClosed) {
      return;
    }
    this.#ac = ac;
    DenoServe(
      {
        handler: handler as Deno.ServeHandler,
        ...this.#addr,
        signal: ac.signal,
        // @ts-ignore Might be any without `--unstable` flag
        onListen: ({ port }) => {
          this.#addr!.port = port;
          this.emit("listening");
        },
      },
    ).then(() => this.#servePromise!.resolve());
  }

  setTimeout() {
    console.error("Not implemented: Server.setTimeout()");
  }

  close(cb?: (err?: Error) => void): this {
    const listening = this.listening;
    this.listening = false;

    this.#hasClosed = true;
    if (typeof cb === "function") {
      if (listening) {
        this.once("close", cb);
      } else {
        this.once("close", function close() {
          cb(new ERR_SERVER_NOT_RUNNING());
        });
      }
    }

    if (this.#isFlashServer) {
      if (listening && this.#ac) {
        this.#ac.abort();
        this.#ac = undefined;
      } else {
        this.#servePromise!.resolve();
      }
    } else {
      nextTick(() => this.emit("close"));

      if (listening) {
        this.#listener!.close();
        this.#listener = undefined;

        for (const httpConn of this.#httpConnections) {
          try {
            httpConn.close();
          } catch {
            // Already closed.
          }
        }

        this.#httpConnections.clear();
      }
    }

    return this;
  }

  address() {
    let addr;
    if (this.#isFlashServer) {
      addr = this.#addr!;
    } else {
      addr = this.#listener!.addr as Deno.NetAddr;
    }
    return {
      port: addr.port,
      address: addr.hostname,
    };
  }
}

Server.prototype = ServerImpl.prototype;

export function createServer(handler?: ServerHandler) {
  return Server(handler);
}

/** Makes an HTTP request. */
export function request(
  url: string | URL,
  cb?: (res: IncomingMessageForClient) => void,
): ClientRequest;
export function request(
  opts: RequestOptions,
  cb?: (res: IncomingMessageForClient) => void,
): ClientRequest;
export function request(
  url: string | URL,
  opts: RequestOptions,
  cb?: (res: IncomingMessageForClient) => void,
): ClientRequest;
// deno-lint-ignore no-explicit-any
export function request(...args: any[]) {
  let options = {};
  if (typeof args[0] === "string") {
    options = urlToHttpOptions(new URL(args.shift()));
  } else if (args[0] instanceof URL) {
    options = urlToHttpOptions(args.shift());
  }
  if (args[0] && typeof args[0] !== "function") {
    Object.assign(options, args.shift());
  }
  args.unshift(options);
  return new ClientRequest(args[0], args[1]);
}

/** Makes a `GET` HTTP request. */
export function get(
  url: string | URL,
  cb?: (res: IncomingMessageForClient) => void,
): ClientRequest;
export function get(
  opts: RequestOptions,
  cb?: (res: IncomingMessageForClient) => void,
): ClientRequest;
export function get(
  url: string | URL,
  opts: RequestOptions,
  cb?: (res: IncomingMessageForClient) => void,
): ClientRequest;
// deno-lint-ignore no-explicit-any
export function get(...args: any[]) {
  const req = request(args[0], args[1], args[2]);
  req.end();
  return req;
}

export {
  Agent,
  ClientRequest,
  IncomingMessageForServer as IncomingMessage,
  METHODS,
  OutgoingMessage,
  STATUS_CODES,
};
export default {
  Agent,
  ClientRequest,
  STATUS_CODES,
  METHODS,
  createServer,
  Server,
  IncomingMessage: IncomingMessageForServer,
  IncomingMessageForClient,
  IncomingMessageForServer,
  OutgoingMessage,
  ServerResponse,
  request,
  get,
};
