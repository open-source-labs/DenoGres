import { modelParser } from "../src/functions/modelParser.ts";

import { getDbData, introspect } from "../src/functions/introspect.ts";

import { sync } from "../src/functions/sync.ts";

import { ConnectDb, DisconnectDb } from "../src/functions/Db.ts";

// import { parse } from "https://deno.land/std@0.152.0/path/posix.ts";

import { QueryObjectResult } from "https://deno.land/x/postgres@v0.16.1/query/query.ts";

import { enumParser } from "../src/functions/enumParser.ts";

// const cleanedText = modelText
//   .replaceAll(
//     /export interface \w+ *\{[\n* *.*: \w+,*]+\}/g,
//     "",
//   )
//   .replaceAll(
//     "import { Model } from 'https://deno.land/x/denogresdev/mod.ts'\n",
//     "",
//   )
//   // initial wording
//   .replaceAll(/\/\/ user model definition comes here\n+/g, "")
//   .replaceAll(/\n */g, "")
//   .replaceAll(/export enum \w+ {[\n *\w+\,*]+}/g, ""); // remove enums for now, will need different logic to parse these

// const tableArray: string[] = cleanedText.split(
//   /export class \w+ extends Model */g,
// );

// console.log(modelText);

// console.log(cleanedText);

// console.log(tableArray);

// let test: any = modelText.match(
//   /export class \w+ extends Model {\n(\w+)\n\n\n/g,
// );

// test = modelText.replace(/export class \w+ extends Model(.*)\n\n$/g, "$1");

// console.log(test);

// let test2: any = "hello World".replace(/(hello)/, "$1$1");

// console.log(test2);

// sync();

// await sync(true);

// const models = modelParser();

// console.log("models\n", models);
// const associations = [];

// for (const model of models) {
//   for (const columnName in model.columns) {
//     // console.log(columnName);

//     if (model.columns[columnName].association) {
//       // console.log(model.)
//       // console.log(model.columns[columnName]);

//       associations.push({
//         columnName: columnName,
//         table: model.columns[columnName].association?.table,
//         mappedCol: model.columns[columnName].association?.mappedCol,
//       });
//     }
//   }
// }

// TODO Deno.run({ cmd: ["deno", "fmt", resolve("./Test/henryPlayground.ts")] });

// ? Below is testing out the foreign key functionality
const foreignKeysQuery = `
  SELECT conrelid::regclass AS table_name, 
  conname AS foreign_key, 
  pg_get_constraintdef(oid) 
  FROM   pg_constraint 
  WHERE  contype = 'f' 
  AND    connamespace = 'public'::regnamespace   
  ORDER  BY conrelid::regclass::text, contype DESC;
`;

const tableForeignKeysQuery = `
  SELECT conrelid::regclass AS table_name, 
        conname AS foreign_key, 
        pg_get_constraintdef(oid) 
  FROM   pg_constraint 
  WHERE  contype = 'f' and conrelid::regclass::text = 'people' 
  AND    connamespace = 'public'::regnamespace   
  ORDER  BY conrelid::regclass::text, contype DESC;  
`;

// interface ForeignKey {
//   table_name: string;
//   foreign_key: string;
//   pg_get_constraintdef: string;
// }

// interface ForeignKeys extends Array<ForeignKey>{};

// const db = await ConnectDb();

// console.log(await db.queryObject(foreignKeyQuery));
// const foreignKeys = await db.queryObject(tableForeignKeysQuery);

// console.log(foreignKeys);

// const tableForeignKeys: ForeignKey[] | unknown[] = foreignKeys.rows;
// let tableForeignKey;

// console.log(tableForeignKeys);

// console.log(tableForeignKeys);

// type foreignKey = Object;

/*
  table_name: string;
  foreign_key: string;
  pg_get_constraintdef: string;
*/

// let mappedCol = "_id";
// let table = "species";
// let columnName = "_id";

// const isForeignKeys = (records: ForeignKey[] | unknown[]): records is ForeignKey[] => {
//   return records.every((record: any) => {
//     return (
//       "table_name" in record &&
//       "foreign_key" in record &&
//       "pg_get_constraintdef" in record
//     );
//   })
// }

// if (isForeignKeys(tableForeignKeys)) {
//   let foreignKeyDefinition;
//   for (const foreignKey of tableForeignKeys) {
//     // console.log(foreignKey.pg_get_constraintdef);
//     foreignKeyDefinition = foreignKey.pg_get_constraintdef;

//     if (foreignKeyDefinition.includes(`(${columnName})`) && foreignKeyDefinition.includes(`${table}(${mappedCol})`)) {
//       tableForeignKey = foreignKey;
//       break;
//     }
//   }
// }

// console.log('TABLE FOREIGN KEY FOUND!',tableForeignKey);

// DisconnectDb(db);

// await sync(true);

// const models = modelParser();

// console.log(models);

// let modelNameList = models.map((model) => model.table);

// const modelNameList: {[key: string]: string} = {};

// for (const model of models) {
//   modelNameList[model.table] = model.table;
// }

// console.log(modelNameList);

// // console.log(modelNameList);

// const db = await ConnectDb();

// const [dbTables] = await introspect();

// for (const table in dbTables) {
//   if (!(modelNameList.table)) {
//     console.log("Deleting", table);
//   }
// }

// DisconnectDb(db);

// const test = modelParser();

// console.log(test);

// const [testTable] = await introspect();

// console.log(testTable);

const test = enumParser();

// console.log(test);

const modelText = Deno.readTextFileSync("./models/model.ts");

// console.log(JSON.stringify(modelText));

// const JSONmodelText = JSON.stringify(modelText);

const enumText = modelText.replaceAll(
  /export interface \w+ {[\n +\w+: \w+]+}/g,
  "",
)
  .replaceAll(
    "import { Model } from 'https://deno.land/x/denogres/mod.ts'\n",
    "",
  )
  // initial wording
  .replaceAll(/\/\/ user model definition comes here\n+/g, "")
  .replaceAll(/\n */g, "");
// matchAll(/export enum \w+ {[\n *\w+\,*]+}/g) // remove enums for now, will need different logic to parse these

console.log(enumText);

// console.log(JSONmodelText);

// const testMatch = modelText.match(/export enum [\s\S]*\n}\n\n$/);
const testMatch = modelText.match(/export enum \w+ {[\n *\w+\,*]+}/g);

//matchAll(/export enum \w+ {[\n *\w+\,*]+}/g)
// const testMatch = JSONmodelText.match(/export enum \s*/gm);

console.log(testMatch);
