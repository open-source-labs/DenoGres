// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { validateFunction } from "./validators.mjs";
import { normalizeEncoding, slowCases } from "./normalize_encoding.mjs";
export { normalizeEncoding, slowCases };
import { ObjectCreate, StringPrototypeToUpperCase } from "./primordials.mjs";
import { ERR_UNKNOWN_SIGNAL } from "./errors.ts";
import { os } from "../internal_binding/constants.ts";

const { signals } = os;

export const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
export const kEnumerableProperty = Object.create(null);
kEnumerableProperty.enumerable = true;

export const kEmptyObject = Object.freeze(Object.create(null));

export function once(callback) {
  let called = false;
  return function (...args) {
    if (called) return;
    called = true;
    Reflect.apply(callback, this, args);
  };
}

export function createDeferredPromise() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

// In addition to being accessible through util.promisify.custom,
// this symbol is registered globally and can be accessed in any environment as
// Symbol.for('nodejs.util.promisify.custom').
const kCustomPromisifiedSymbol = Symbol.for("nodejs.util.promisify.custom");
// This is an internal Node symbol used by functions returning multiple
// arguments, e.g. ['bytesRead', 'buffer'] for fs.read().
const kCustomPromisifyArgsSymbol = Symbol.for(
  "nodejs.util.promisify.customArgs",
);

export const customPromisifyArgs = kCustomPromisifyArgsSymbol;

export function promisify(
  original,
) {
  validateFunction(original, "original");
  if (original[kCustomPromisifiedSymbol]) {
    const fn = original[kCustomPromisifiedSymbol];

    validateFunction(fn, "util.promisify.custom");

    return Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }

  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['bytesRead', 'buffer'] for fs.read.
  const argumentNames = original[kCustomPromisifyArgsSymbol];
  function fn(...args) {
    return new Promise((resolve, reject) => {
      args.push((err, ...values) => {
        if (err) {
          return reject(err);
        }
        if (argumentNames !== undefined && values.length > 1) {
          const obj = {};
          for (let i = 0; i < argumentNames.length; i++) {
            obj[argumentNames[i]] = values[i];
          }
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
      Reflect.apply(original, this, args);
    });
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true,
  });
  return Object.defineProperties(
    fn,
    Object.getOwnPropertyDescriptors(original),
  );
}

let signalsToNamesMapping;
function getSignalsToNamesMapping() {
  if (signalsToNamesMapping !== undefined) {
    return signalsToNamesMapping;
  }

  signalsToNamesMapping = ObjectCreate(null);
  for (const key in signals) {
    signalsToNamesMapping[signals[key]] = key;
  }

  return signalsToNamesMapping;
}

export function convertToValidSignal(signal) {
  if (typeof signal === "number" && getSignalsToNamesMapping()[signal]) {
    return signal;
  }

  if (typeof signal === "string") {
    const signalName = signals[StringPrototypeToUpperCase(signal)];
    if (signalName) return signalName;
  }

  throw new ERR_UNKNOWN_SIGNAL(signal);
}

promisify.custom = kCustomPromisifiedSymbol;

export default {
  convertToValidSignal,
  createDeferredPromise,
  customInspectSymbol,
  customPromisifyArgs,
  kEmptyObject,
  kEnumerableProperty,
  normalizeEncoding,
  once,
  promisify,
  slowCases,
};
