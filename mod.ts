import { ensureDir, ensureFile } from "https://deno.land/std/fs/ensure_dir.ts";
import { parse, config } from "https://deno.land/std@0.148.0/dotenv/mod.ts";

import "https://deno.land/x/dotenv/load.ts";

import { serve } from "https://deno.land/std/http/server.ts";
import * as postgres from "https://deno.land/x/postgres/mod.ts";

export const ConnectDb = async () => {
    const pool = new postgres.Pool(Deno.env.get('DATABASE_URI'), POOL_CONNECTIONS, true);
    return await pool.connect();
}

export const DisconnectDb = (connection: postgres.PoolClient) => {
   connection.release();
}

switch(Deno.args[0]) {
    case '--init':
        console.log('Initialized')
        init();
        break;

    case '--db-pull': {// introspection begins
        // Check for database URI
        // Deno.env.set(URI, value)
        // Deno.env.get(URI)
        const envVar = parse(await Deno.readTextFile('./.env')); // Get DB_URI

        if(envVar.DATABASE_URI === "") {
            console.log('Please enter a valid DATABSE_URI value in .env')
        } else {
            // QUERY DATABASE
            const db = ConnectDb();

        }
        console.log(Deno.env.get('DATABASE_URI'))
        break;
}
    default:
        console.log(displayHelpMsg());
}

function displayHelpMsg() {
  return `flags:
-h, --help: display help message
--init: set-up DenoGres required files
--db-pull: Introspect database and create and populate Table.ts file`;
}
// flags:
// -h, --help: display help message

function init() {
// create .env file in root directory 
  const envFilePath = "./";
  const envFileContent = `
# See the documentation for more detail: // detail here!
DATABASE_URI=" " // put your database connection URI here!!!
  `
  ensureDir(envFilePath).then(() => {
    Deno.writeTextFile(envFilePath + ".env", envFileContent);
    // + add .env in gitignor file (if no gitignore file, make one)
    console.log('.env file created')
  })

// create db folder in root directory
// inside the db folder, create db.ts file with db connection logic (with db uri from .env)
  const dbFilePath = "./db/";
  const dbFileContent = `
import { serve } from "https://deno.land/std/http/server.ts";
import * as postgres from "https://deno.land/x/postgres/mod.ts";
const dbURI=Deno.env.get('DATABASE_URI')// fetching from .env file's DATABASE_URI
const POOL_CONNECTIONS = 3; // number of connections (user can define this)
// e.g. Create a database pool with three connections that are lazily established
export const pool = new postgres.Pool(dbURI, POOL_CONNECTIONS, true);
  `
  ensureDir(dbFilePath).then(() => {
    Deno.writeTextFile(dbFilePath + "db.ts", dbFileContent);
    console.log('db.ts file created under db folder')
  })

// create moodel folder in root directory
// inside the model folder, create model.ts file with boilerplate code
  const modelFilePath = "./models/";
  const modelFileContent = `    
import { Model } from 'denogres'
// user model definition comes here    
  `
  ensureDir(modelFilePath).then(() => {
    Deno.writeTextFile(modelFilePath + "model.ts", modelFileContent);
    console.log('model.ts file created under model folder')
  })
}

//const dbURI = Deno.env.get('DATABASE_URI');
const POOL_CONNECTIONS = 3;
// export const pool = new postgres.Pool(dbURI, POOL_CONNECTIONS, true);

// export const createConnection = async (pool: postgres.Pool) => {
//     return await pool.connect();
// }

