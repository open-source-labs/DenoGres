import { tableListQuery, tableConstQuery, columnInfoQuery } from '../queries/introspection.ts'
import { sqlDataTypes } from '../constants/sqlDataTypes.ts';

import { createClassName } from '../functions/StringFormat.ts'
import { ConnectDb, DisconnectDb } from '../functions/Db.ts'


export async function introspect() {
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
  
    let autoCreatedModels = `import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'\n// user model definition comes here `
  
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
      if (el.not_null) columnsObj[el.table_name] += `    notNull: true,\n`;
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
      // If constraint includes primary key, parse the primary key name and add to that column in table object
        if (el.conname.includes("PRIMARY KEY")){
          // let key = '';
          // for (let i = 12; i < el.conname.length - 1; i++){
          //   key += el.conname[i];
          // }
          columnsObj[el.table_name] += `    primaryKey: true,\n`;
        }
        // columnsObj[el.table_name] += `    primaryKey: true,\n`;
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
    Deno.writeTextFileSync('./models/model.ts', autoCreatedModels);
  }