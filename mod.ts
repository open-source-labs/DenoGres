import { parse, config } from "https://deno.land/std@0.148.0/dotenv/mod.ts";

import "https://deno.land/x/dotenv/load.ts";

import * as postgres from "https://deno.land/x/postgres/mod.ts";

import { tableListQuery, tableConstQuery, columnInfoQuery } from './src/queries/introspection.ts'
import { sqlDataTypes } from './src/constants/sqlDataTypes.ts';

import { createClassName } from './src/functions/StringFormat.ts'

import { init } from './src/functions/init.ts'
import { sync } from './src/functions/sync.ts'

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
--db-pull: Introspect database and create and populate Table.ts file`;
}
// flags:
// -h, --help: display help message

async function introspect() {
  // QUERY DATABASE
  const db = await ConnectDb();

  interface TableListObj {
    table: string;
  }

  const tableList = await db.queryObject(tableListQuery);
  const columnList = await db.queryObject(columnInfoQuery);
  const tableConstraints = await db.queryObject(tableConstQuery);

  console.log('Table List', tableList.rows, 'Column Info', columnList.rows, 
  'Constraint', tableConstraints.rows);

  let autoCreatedModels = `import { Model } from '../src/model/Model.ts'\n// user model definition comes here `

  // Add Each Table as a property to an Object
  const interfaceObj: Record<string, unknown> = {};
  const columnsObj: Record<string, unknown> = {};

  // Add property to each object for each table in the database
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
    if(el.not_null) columnsObj[el.table_name] += `    notNull: true,\n`;
    // column constraints go here (default value and primary key)
    // Create defaultVal and/or auto increment property
    if (el.col_default && el.col_default.includes('nextval(')) {
      columnsObj[el.table_name] += `    defaultVal: ${el.col_default.replaceAll("nextval(", "")
      .replaceAll("::regclass)", "")},\n`;
      columnsObj[el.table_name] += `    autoIncrement: true,\n`;
    }
    else if (el.col_default) columnsObj[el.table_name] += `    defaultVal: ${el.col_default}\n`;
    columnsObj[el.table_name] += `  },\n` // closing out the column object
  })

  tableConstraints.rows.forEach(el => {

  })
  


    // Add the information for each table to the final output string
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
    // Add any table constraint information below here
    `}\n`
  }
  // Create the model.ts file
  Deno.writeTextFileSync('./models/model.ts', autoCreatedModels)
}

/* 
1. How to display relationships b/t tables
2. Build the initial parsing and mapping logic (that can be added onto from results of other steps)
3. The different types of table contraints? Or can the table constraint query be improved upon - BEN
*/