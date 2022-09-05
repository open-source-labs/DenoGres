/* This module contains the denoGres commands that are compiled when typed in a command line */
import { parse, config } from './deps.ts'

import "https://deno.land/x/dotenv/load.ts";

import { init } from './src/functions/init.ts'
import { sync } from './src/functions/sync.ts'
import { dbPull } from './src/functions/dbPull.ts'

switch(Deno.args[0]) {
    case '--init':
        init(); // This function is imported on line 5, It creates a models folder, and a env file.
        break;

    case '--db-pull': {// introspection begins
        const envVar = parse(await Deno.readTextFile('./.env')); // Gets the DB_URI

        if(envVar.DATABASE_URI === "") {
            console.log('Please enter a valid DATABASE_URI value in .env')
        } else {
          dbPull();
        }
        break;
    }
    case '--db-sync': {
      Deno.args[1] === '-x' ? sync(true) : sync();
      break;
    } case '-h': {
      console.log(displayHelpMsg());
      break;
    } case '--help': {
      console.log(displayHelpMsg());
      break;
    }
    default:
}

// This is the message that details what the commands do
function displayHelpMsg() {
  return `flags:
--init: set-up DenoGres required files
--db-pull: Introspect database and create and populate model.ts file`;
}

export { Model } from './src/class/Model.ts'
export { manyToMany } from './src/class/Model.ts'
