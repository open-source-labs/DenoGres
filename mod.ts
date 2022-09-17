import { config, parse } from "./deps.ts";

import "https://deno.land/x/dotenv/load.ts";

import { init } from "./src/functions/init.ts";
import { sync } from "./src/functions/sync.ts";
import { dbPull } from "./src/functions/dbPull.ts";
import seed from "./src/functions/seed.ts";

switch (Deno.args[0]) {
  case "--init":
    init();
    break;

  case "--db-pull": { // introspection begins
    const envVar = parse(await Deno.readTextFile("./.env")); // Get DB_URI

    if (envVar.DATABASE_URI === "") {
      console.log("Please enter a valid DATABASE_URI value in .env");
    } else {
      dbPull();
    }
    break;
  }
  case "--db-sync": {
    Deno.args[1] === "-x" ? sync(true) : sync(true);
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
        "-A",
        "https://deno.land/x/denogresdev/webview_script.ts",
      ],
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
