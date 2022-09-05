import { config, parse } from "./deps.ts";

import "https://deno.land/x/dotenv/load.ts";

import { init } from "./src/functions/init.ts";
import { sync } from "./src/functions/sync.ts";
import { dbPull } from "./src/functions/dbPull.ts";

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
    Deno.args[1] === "-x" ? sync(true) : sync();
    break;
  }
  case "-h": {
    console.log(displayHelpMsg());
    break;
  }
  case "--help": {
    console.log(displayHelpMsg());
    break;
  }
  case "--gui": {
    Deno.run({ cmd: ["deno", "run", "-A", "webview_script.ts"] });
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
