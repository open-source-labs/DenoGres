import { parse, config } from './deps.ts'

import "https://deno.land/x/dotenv/load.ts";

import { init } from './src/functions/init.ts'
import { sync } from './src/functions/sync.ts'
import { introspect } from './src/functions/introspect.ts'

switch(Deno.args[0]) {
    case '--init':
        init();
        break;

    case '--db-pull': {// introspection begins
        // Check for database URI
        // Deno.env.set(URI, value)
        // Deno.env.get(URI)
        const envVar = parse(await Deno.readTextFile('./.env')); // Get DB_URI

        if(envVar.DATABASE_URI === "") {
            console.log('Please enter a valid DATABASE_URI value in .env')
        } else {
          introspect();
        }
        console.log(Deno.env.get('DATABASE_URI'))
        break;
    }
    case '--db-sync': {
      sync();
      break;
    }
    default:
        console.log(displayHelpMsg());
}

function displayHelpMsg() {
  return `flags:
-h, --help: display help message
--init: set-up DenoGres required files
--db-pull: Introspect database and create and populate model.ts file`;
}

export { Model } from './src/class/Model.ts'