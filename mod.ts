/* This module contains the denoGres commands that are compiled when typed in a command line */
import { config, parse } from "./deps.ts";
import "https://deno.land/x/dotenv/load.ts";
import { init } from "./src/functions/init.ts";
import seed from "./src/functions/seed.ts";
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts";
import sync from "./src/functions/sync.ts";
import { dbPull } from "./src/functions/dbPull.ts";

switch (Deno.args[0]) {
  case "--init":
    init();
    break;
  case "--log": {
    const myLog = Deno.readTextFileSync(
      "./Migrations/log/migration_log.txt",
    );
    console.log(myLog);
    break;
  }

  case "--db-pull": {
    const envVar = parse(await Deno.readTextFile("./.env"));
    if (envVar.DATABASE_URI === "") {
      console.log("Please enter a valid DATABASE_URI value in .env");
    } else {
      dbPull();
    }
    break;
  }
  case "--db-sync": {
    Deno.args[1] === "-x" ? sync(true) : sync();
    break;
  }
  case "-h":
  case "--help": {
    console.log(displayHelpMsg());
    break;
  }
  case "--gui": {
    const app = Deno.run({
      cmd: [
        "deno",
        "run",
        "-Ar",
        "--unstable",
        "https://deno.land/x/denogresdev/webview/webview.ts",
      ],
      // "app": "deno run -Ar --unstable ./webview/webview.ts",

      // FOR DEVELOPMENT
      // "webview_script.ts",
      // FOR PRODUCTION
    });
    await app.status();
    break;
  }
  case "--seed": {
    await Deno.args[1] === undefined ? seed() : seed(Deno.args[1]);
    break;
  }
  default:
}

function displayHelpMsg() {
  return `flags:
--init: set-up DenoGres required files
--db-pull: Introspect database and create and populate model.ts file`;
}

export { Model } from "./src/class/Model.ts";
export { manyToMany } from "./src/class/Model.ts";
