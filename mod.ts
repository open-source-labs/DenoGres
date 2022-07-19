import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import { parse, config } from "https://deno.land/std@0.148.0/dotenv/mod.ts";

import "https://deno.land/x/dotenv/load.ts";

import { serve } from "https://deno.land/std/http/server.ts";
import * as postgres from "https://deno.land/x/postgres/mod.ts";

import { tableListQuery, tableConstQuery, columnInfoQuery } from './src/queries/introspection.ts'
import { sqlDataTypes } from './src/constants/sqlDataTypes.ts';

import { createClassName } from './src/functions/StringFormat.ts'

const POOL_CONNECTIONS = 3;

export const ConnectDb = async () => {
    const pool = new postgres.Pool(Deno.env.get('DATABASE_URI'), POOL_CONNECTIONS, true);
    const connection = await pool.connect();
    return connection;
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
          introspect();
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
/*
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
*/

// create moodel folder in root directory
// inside the model folder, create model.ts file with boilerplate code
  const modelFilePath = "./models/";
  const modelFileContent = `    
import { Model } from './src/mode/Model.ts'
// user model definition comes here    
  `
  ensureDir(modelFilePath).then(() => {
    Deno.writeTextFile(modelFilePath + "model.ts", modelFileContent);
    console.log('model.ts file created under model folder')
  })
}

//const dbURI = Deno.env.get('DATABASE_URI');

// export const pool = new postgres.Pool(dbURI, POOL_CONNECTIONS, true);

// export const createConnection = async (pool: postgres.Pool) => {
//     return await pool.connect();
// }

async function introspect() {
  // QUERY DATABASE
  const db = await ConnectDb();

  interface TableListObj {
    table_name: string;
  }

  const tableList = await db.queryObject(tableListQuery);
  const columnList = await db.queryObject(columnInfoQuery);
  const tableConstraints = await db.queryObject(tableConstQuery);

  console.log('Table List', tableList.rows, 'Column Info', columnList.rows, 
  'Constraint', tableConstraints.rows);

  let autoCreatedModels = ``

  // Add Each Table as a property to an Object
  const interfaceObj: Record<string, unknown> = {};
  const columnsObj: Record<string, unknown> = {};

  tableList.rows.forEach(el => {
    interfaceObj[el.table_name] = ``;
    columnsObj[el.table_name] = ``
  })

  // Add each table column to the corresponding object in intefaceObj and
  // column details in columnsObj for the columns property
  columnList.rows.forEach(el => {
    // Add column and type to interface
    interfaceObj[el.table_name] += `  ${el.column_name}: ${sqlDataTypes[el.column_type]}\n`;

    // Create the static columns property for the class
    columnsObj[el.table_name] += `  ${el.column_name}: {\n` +
    `    type: '${el.column_type}',\n`
    if(el.not_null) columnsObj[el.table_name] += `    notNull: true,\n`
    columnsObj[el.table_name] += `  },\n`
  })

  for(let i = 0; i < tableList.rows.length; i++){
    const tableName = tableList.rows[i].table_name;
    const className = createClassName(tableName);

    autoCreatedModels += `\nexport interface ${className} {\n` +
    `${interfaceObj[tableName]}}\n\n`

    autoCreatedModels += `export class ${className} extends Model {\n` + 
    `  static table_name = '${tableName}';\n` +
    `  static columns = {\n` +
    `${columnsObj[tableName]}` +
    `  }\n` +
    `}\n`
  }

  Deno.writeTextFileSync('./models/model.ts', autoCreatedModels, {append: true})
}


/* 
1. How to display relationships b/t tables
2. Build the initial parsing and mapping logic (that can be added onto from results of other steps)
3. The different types of table contraints? Or can the table constraint query be improved upon - BEN
*/