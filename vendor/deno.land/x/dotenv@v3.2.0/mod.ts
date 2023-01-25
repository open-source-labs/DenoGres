import { difference, removeEmptyValues } from "./util.ts";

export interface DotenvConfig {
  [key: string]: string;
}

export interface ConfigOptions {
  path?: string;
  export?: boolean;
  safe?: boolean;
  example?: string;
  allowEmptyValues?: boolean;
  defaults?: string;
}

interface ParseResult {
  env: DotenvConfig;
  exports: Set<string>;
}

const emptyParseResult = (): ParseResult => ({ env: {}, exports: new Set() });
const EXPORT_REGEX = /^\s*export\s+/;

export function parse(rawDotenv: string): ParseResult {
  const env: DotenvConfig = {};
  const exports = new Set<string>();

  for (const line of rawDotenv.split("\n")) {
    if (!isAssignmentLine(line)) continue;
    const lhs = line.slice(0, line.indexOf("=")).trim();
    const { key, exported } = parseKey(lhs);
    if (exported) {
      exports.add(key);
    }
    let value = line.slice(line.indexOf("=") + 1).trim();
    if (hasSingleQuotes(value)) {
      value = value.slice(1, -1);
    } else if (hasDoubleQuotes(value)) {
      value = value.slice(1, -1);
      value = expandNewlines(value);
    } else value = value.trim();
    env[key] = value;
  }

  return { env, exports };
}

const defaultConfigOptions = {
  path: `.env`,
  export: false,
  safe: false,
  example: `.env.example`,
  allowEmptyValues: false,
  defaults: `.env.defaults`,
};

export function config(options: ConfigOptions = {}): DotenvConfig {
  const o = mergeDefaults(options);
  const conf = parseFile(o.path);
  const confDefaults = o.defaults ? parseFile(o.defaults) : emptyParseResult();
  const confExample = o.safe ? parseFile(o.example) : emptyParseResult();

  return processConfig(o, conf, confDefaults, confExample);
}

export async function configAsync(
  options: ConfigOptions = {},
): Promise<DotenvConfig> {
  const o = mergeDefaults(options);
  const conf = await parseFileAsync(o.path);
  const confDefaults = o.defaults
    ? await parseFileAsync(o.defaults)
    : emptyParseResult();
  const confExample = o.safe
    ? await parseFileAsync(o.example)
    : emptyParseResult();

  return processConfig(o, conf, confDefaults, confExample);
}

// accepts the left-hand side of an assignment
function parseKey(lhs: string): {
  key: string;
  exported: boolean;
} {
  if (EXPORT_REGEX.test(lhs)) {
    const key = lhs.replace(EXPORT_REGEX, "");
    return { key, exported: true };
  }
  return { key: lhs, exported: false };
}

const mergeDefaults = (options: ConfigOptions): Required<ConfigOptions> => ({
  ...defaultConfigOptions,
  ...options,
});

function processConfig(
  options: Required<ConfigOptions>,
  conf: ParseResult,
  confDefaults: ParseResult,
  confExample: ParseResult,
): DotenvConfig {
  if (options.defaults) {
    for (const key in confDefaults.env) {
      if (!(key in conf.env)) {
        conf.env[key] = confDefaults.env[key];
      }
    }
    conf.exports = new Set([...conf.exports, ...confDefaults.exports]);
  }

  if (options.safe) {
    assertSafe(conf, confExample, options.allowEmptyValues);
  }

  if (options.export) {
    for (const key in conf.env) {
      denoSetEnv(key, conf.env[key]);
    }
  } else {
    for (const key of conf.exports) {
      denoSetEnv(key, conf.env[key]);
    }
  }

  return conf.env;
}

const denoSetEnv = (key: string, value: string) =>
  (Deno.env.get(key) === undefined) ? Deno.env.set(key, value) : undefined;

function parseFile(filepath: string): ParseResult {
  try {
    return parse(new TextDecoder("utf-8").decode(Deno.readFileSync(filepath)));
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) return emptyParseResult();
    throw e;
  }
}

async function parseFileAsync(filepath: string): Promise<ParseResult> {
  try {
    return parse(
      new TextDecoder("utf-8").decode(await Deno.readFile(filepath)),
    );
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) return emptyParseResult();
    throw e;
  }
}

function isAssignmentLine(str: string): boolean {
  return /^\s*(?:export\s+)?[a-zA-Z_][a-zA-Z_0-9 ]*\s*=/.test(str);
}

function hasSingleQuotes(str: string): boolean {
  return /^'([\s\S]*)'$/.test(str);
}

function hasDoubleQuotes(str: string): boolean {
  return /^"([\s\S]*)"$/.test(str);
}

function expandNewlines(str: string): string {
  return str.replaceAll("\\n", "\n");
}

function assertSafe(
  conf: ParseResult,
  confExample: ParseResult,
  allowEmptyValues: boolean,
) {
  const currentEnv = Deno.env.toObject();
  const currentExportsList = Object.keys(currentEnv);

  // Not all the variables have to be defined in .env, they can be supplied externally
  const confWithEnv = Object.assign({}, currentEnv, conf.env);

  const missingVars = difference(
    Object.keys(confExample.env),
    // If allowEmptyValues is false, filter out empty values from configuration
    Object.keys(
      allowEmptyValues ? confWithEnv : removeEmptyValues(confWithEnv),
    ),
  );

  if (missingVars.length > 0) {
    const errorMessages = [
      `The following variables were defined in the example file but are not present in the environment:\n  ${
        missingVars.join(
          ", ",
        )
      }`,
      `Make sure to add them to your env file.`,
      !allowEmptyValues &&
      `If you expect any of these variables to be empty, you can set the allowEmptyValues option to true.`,
    ];

    throw new MissingEnvVarsError(errorMessages.filter(Boolean).join("\n\n"));
  }

  const exportsWithEnv = new Set([...currentExportsList, ...conf.exports]);
  const missingExports = difference([
    ...confExample.exports,
  ], [
    ...exportsWithEnv,
  ]);

  if (missingExports.length > 0) {
    throw new MissingEnvVarExportsError(
      `The following variables were exported in the example file but are not exported in the environment:
${missingExports.join(", ")},
make sure to export them in your env file or in the environment of the parent process (e.g. shell).`,
    );
  }
}

export class MissingEnvVarsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "MissingEnvVarsError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MissingEnvVarExportsError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, MissingEnvVarExportsError.prototype);
  }
}
