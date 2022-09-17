/* This module contains the denoGres commands that are compiled when typed in a command line */
import { config, parse } from "./deps.ts";
import "https://deno.land/x/dotenv/load.ts";
import { init } from "./src/functions/init.ts";
import { sync } from "./src/functions/sync.ts";
import { dbPull } from "./src/functions/dbPull.ts";
import seed from "./src/functions/seed.ts";
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts";
import sync2 from "./src/functions/sync2.ts";
import { dbPull2 } from "./src/functions/dbPull2.ts";

switch (Deno.args[0]) {
  case "--init":
    init(); // This function is imported on line 5, It creates a models folder, and a env file.
    break;
  case "--log": {
    // declare a constatnt
    const myLog = Deno.readTextFileSync(
      "./Migrations/log/migration_log.txt",
    );
    console.log(myLog);
    break;
  }

  case "--db-pull": { // introspection begins
    const envVar = parse(await Deno.readTextFile("./.env")); // Gets the DB_URI
    if (envVar.DATABASE_URI === "") {
      console.log("Please enter a valid DATABASE_URI value in .env");
    } else {
      dbPull2();
    }
    break;
  }
  case "--db-sync": {
    Deno.args[1] === "-x" ? sync2(true) : sync2();
    // Deno.args[1] === "-log" ? sync2(true) : sync2(); //* adding for dbSync log

    // -CASCADE ? DROP CASCADE
    // ! COME BACK LATER TO FIX OVERWRITE
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
  // case "--log": {
  //   //* Check if -c flag was passed in for comment
  //   Deno.args[1] === "-c" ? console.log(denoLog()) : 'Please enter a comment with the -c flag';
  //   break;
  // }
  default:
}

// This is the message that details what the commands do
function displayHelpMsg() {
  return `flags:
--init: set-up DenoGres required files
--db-pull: Introspect database and create and populate model.ts file`;
}

export { Model } from "./src/class/Model.ts";
export { manyToMany } from "./src/class/Model.ts";
