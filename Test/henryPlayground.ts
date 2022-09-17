import { modelParser } from "../src/functions/modelParser.ts";

import { getDbData, introspect } from "../src/functions/introspect.ts";

import { sync } from "../src/functions/sync.ts";

import { ConnectDb, DisconnectDb } from "../src/functions/Db.ts";

// import { parse } from "https://deno.land/std@0.152.0/path/posix.ts";

import { enumParser } from "../src/functions/enumParser.ts";

import { dbPull } from "../src/functions/dbPull.ts";

import seed from "../src/functions/seed.ts";

import modelParser2 from "../src/functions/modelParser2.ts";

// import { introspect } from "../src/functions/introspect.ts";

// await dbPull();

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

// console.log(enumText);

// console.log(JSONmodelText);

// const testMatch = modelText.match(/export enum [\s\S]*\n}\n\n$/);
const testMatch = modelText.match(/export enum \w+ {[\n *\w+\,*]+}/g);

//matchAll(/export enum \w+ {[\n *\w+\,*]+}/g)
// const testMatch = JSONmodelText.match(/export enum \s*/gm);

// console.log(testMatch);

// const [tables] = await introspect();

// console.log(tables);

// const models = modelParser();

// // console.log(Object)

// console.log(models);

// sync2
const modelNameSet = new Set();
const tableNameSet = new Set();

modelNameSet.add("people");
modelNameSet.add("dog");
modelNameSet.add("species");

// console.log(modelNameSet);

tableNameSet.add("people");
tableNameSet.add("species");
tableNameSet.add("cat");

// console.log(tableNameSet);

const updateList = [];
const createList = [];

for (const modelName of modelNameSet) {
  if (tableNameSet.has(modelName)) {
    updateList.push(modelName);
    modelNameSet.delete(modelName);
    tableNameSet.delete(modelName);
  } else if (!(tableNameSet.has(modelName))) {
    createList.push(modelName);
    modelNameSet.delete(modelName);
  }
}

// console.log(tableNameSet);

const deleteList = Array.from(tableNameSet);

// console.log(updateList);
// console.log(deleteList);
// console.log(createList);

// Deno.run({
//   cmd: ["deno", "-h"],
// }).status();

// console.log(p.status());

// await seed();

// console.log(parseSeed());

// let userInput;
// let properUserInput = false;

// while (!properUserInput) {
//   userInput = prompt(`delete this table? [y/n]`);

//   const formattedInput = userInput?.toLowerCase().replace(/\s/g, "");

//   switch (formattedInput) {
//     case "y": {
//       console.log("great!");
//       properUserInput = true;
//       break;
//     }
//     case "n": {
//       console.log("oh whale");
//       properUserInput = true;
//       break;
//     }
//     default: {
//       break;
//     }
//   }
// }

// console.log("you passed!");

// if (userInput === "yes") {
//   console.log("hello world");
// }

// const input = prompt(
//   `Are you sure you want to delete this table? [yes/no]\nTo avoid all prompts, please re-run your command with the -x flag.`,
// );
// let test20 = "hello";

// true ? test20 += " world" : null;

// console.log(test20);

// const db = await ConnectDb();

const testQuery2 = `SELECT conrelid::regclass AS table_name,
conname AS primary_key, 
pg_get_constraintdef(oid) 
FROM   pg_constraint 
WHERE  contype = 'p' 
AND    connamespace = 'public'::regnamespace   
ORDER  BY conrelid::regclass::text, contype DESC; `;
const testQuery = `SELECT conrelid::regclass AS table_name, 
conname AS primary_key, 
pg_get_constraintdef(oid) 
FROM   pg_constraint 
WHERE  contype = 'p' 
AND    connamespace = 'public'::regnamespace  
AND    conrelid::regclass::text = 'cat'  
ORDER  BY conrelid::regclass::text, contype DESC; `;

const constraintsQuery = `SELECT con.*
FROM pg_catalog.pg_constraint con
    INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
    INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
    WHERE nsp.nspname = 'public'
         AND rel.relname = 'people';`;
const constraintsQuery2 = `SELECT con.*
FROM pg_catalog.pg_constraint con
    INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
    INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
    WHERE nsp.nspname = 'public'
         AND rel.relname = 'dog';`;

const cQuery3 = `SELECT conname
FROM pg_constraint
WHERE conrelid =
    (SELECT oid 
    FROM pg_class
    WHERE relname LIKE 'dog');`;

const cQuery7 = `SELECT tables.schemaname, class.relname AS table_name, 
pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
FROM pg_class class
INNER JOIN pg_tables tables on class.relname = tables.tablename
INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid
AND class.relname = 'people';`;

// const testQueryObject = await db.queryObject(cQuery7);

// console.log(testQueryObject.rows);

// const constraints: any = testQueryObject.rows;

// console.log(constraints);

// const output: any = {};

// for (const constraint of constraints) {
//   const { contype, conname, condef } = constraint;

//   const start = constraint.condef.indexOf("(");
//   const end = constraint.condef.indexOf(")");
//   const columnName = constraint.condef.slice(start + 1, end);

//   if (!output[columnName]) output[columnName] = {};
//   if (!output[columnName][contype]) output[columnName][contype] = [];

//   switch (contype) {
//     case "f": {
//       output[columnName][contype].push({ name: conname, definition: condef });
//       break;
//     }
//     case "p": {
//       output[columnName][contype] = conname;
//       break;
//     }
//     default: {
//       output[columnName][contype].push(conname);
//       break;
//     }
//   }

//   // if (!output[columnName][contype]) {
//   //   // console.log(output);
//   //   constraintInfo = [{constraintName: conname, constraintDefinition: condef}];
//   // } else {
//   //   constraintInfo.push({constraintName: conname, constraintDefinition: condef});
//   // }
// }

// console.log(output);

// for (const constraint of constraints) {
// }

// DisconnectDb(db);

// console.log(await enumParser());

// console.log(await introspect());

// const introspected = await introspect();

// console.log(introspected);
// console.log(introspected[0].people.columns.species_id);

console.log(await modelParser2());

// console.log(enumParser());
