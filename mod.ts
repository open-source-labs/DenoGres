/* This module contains the denoGres commands that are compiled when typed in a command line */
import { config, parse } from "./deps.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { init } from "./src/functions/init.ts";
import seed from "./src/functions/seed.ts";
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts";
import sync from "./src/functions/sync.ts";
import { dbPull } from "./src/functions/dbPull.ts";
import restoreModel from "./src/functions/restore.ts";

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
        "https://deno.land/x/denogres/webview/webview.ts",
        // "https://deno.land/x/denogresdev/webview/webview.ts",
      ],
    });
    await app.status();
    break;
  }
  case "--db-seed": {
    Deno.args[1] === undefined ? seed() : seed(Deno.args[1]);
    break;
  }
  case "--restore": {
    restoreModel();
    break;
  }
  default:
}

function displayHelpMsg() {
  return `flags:
  --db-pull: Introspect database, create and populate model.ts file
  --db-seed: Upload locally stored data file to the PostgreSQL database
  --db-sync: Update the PostgreSQL database schema to match the DenoGres Model schema
  --gui: Launch the DenoGres graphical user interface
  -h, --help: Display the list of all commands
  --init: Set-up files required by DenoGres
  --log: Display a historical log of DenoGres Model schemas
  --restore: Restore locally stored DenoGres Model schemas and sync with the PostgreSQL database`;
}


export { Model } from "./src/class/Model.ts";
export { manyToMany } from "./src/class/Model.ts";
