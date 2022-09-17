import { resolve } from "https://deno.land/std@0.141.0/path/mod.ts";
import { ConnectDb, DisconnectDb } from "./Db.ts";
// TODO import { modelParser } from "./modelParser.ts";
import { introspect } from "./introspect.ts";
import modelParser2 from "./modelParser2.ts";

const parseSeed = (path: string = "./seed.ts") => {
  path = resolve(path);

  const output: any = {};

  let data: any = Deno.readTextFileSync(path);

  const whitespaces = /\s/g;

  data = data.replace(whitespaces, "");
  data = data.replace(/(const|let|var)/g, "\n");

  const tables: any = data.match(/\n.*/g)?.map((table: any) =>
    table.slice(1, -1)
  );

  for (const table of tables) {
    const tableName = table.replace(/(\w+).*/, "$1");
    // const tableName = table.match(/\w+/)
    let tableData = table.replace(/.*\=(\[.*\]\.*)/, "$1");

    tableData = tableData.replace(/\,\}/g, "}");
    tableData = tableData.replace(/\,\]/g, "]");
    tableData = tableData.replace(
      /([\w\_]+)\:/g,
      '"$1":',
    );

    tableData = JSON.parse(tableData);
    output[tableName] = tableData;
  }

  return output;
};

// console.log(parseSeed());
// console.log(parseSeed("Test/seed2.ts"));

const getCreateTableQuery = (tableName: string, columns: any) => {
  let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

  let constraints = "";

  const associations = [];

  for (const column in columns) {
    if (columns[column].autoIncrement) columns[column].type = "SERIAL";

    // console.log("columnName", column);

    createTableQuery += `${column} ${columns[column].type}`;
    for (const constraint in columns[column]) {
      switch (constraint) {
        case "association": {
          associations.push({
            columnName: column,
            table: columns[column].association?.table,
            mappedCol: columns[column].association?.mappedCol,
          });
          break;
        }
        case "primaryKey": {
          constraints += " PRIMARY KEY";
          break;
        }
        case "notNull": {
          constraints += " NOT NULL";
          break;
        }
        case "unique": {
          constraints += " UNIQUE";
          break;
        }
        case "defaultVal": {
          constraints += ` DEFAULT ${columns[column].defaultVal}`;
          break;
        }
        default: {
          break;
        }
      }
    }
    createTableQuery += `${constraints}, `;
    constraints = "";
  }

  // console.log('createTableQuery: ', createTableQuery);

  createTableQuery = createTableQuery.slice(0, createTableQuery.length - 2) +
    ");";

  let associationsQuery = ``;
  let associationIndex = 0;

  for (const association of associations) {
    const { columnName, table, mappedCol } = association;

    associationsQuery += `
      ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_fkey${associationIndex++} FOREIGN KEY ("${columnName}") REFERENCES ${table}(${mappedCol});
    `;
  }

  createTableQuery += associationsQuery;

  return createTableQuery;
};

const getInsertQuery = (data: any, tableName: string) => {
  let columns = "";

  for (const column in data[0]) {
    columns += `${column}, `;
  }

  columns = columns.slice(0, columns.length - 2);

  let insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES `;

  let value;
  let values = "";

  for (const datum of data) {
    value = "(";
    for (const key in datum) {
      value += `'${datum[key]}', `;
    }
    value = value.slice(0, value.length - 2) + "), ";
    values += value;
  }

  values = values.slice(0, values.length - 2) + ";";

  insertQuery += values;

  return insertQuery;
};

export default async function seed(path: string = "./seed.ts") {
  path = resolve(path);

  await Deno.run({
    cmd: ["deno", "fmt", path],
  }).status();

  const db = await ConnectDb();
  const [dbTables] = await introspect();
  const models: any = await modelParser2();

  const modelNameSet: Set<string> = new Set(Object.keys(models));
  const dbTableNameSet: Set<string> = new Set(Object.keys(dbTables));

  // for (const model of models) {
  //   modelNameSet.add(model.table);
  // }

  // for (const tableName in dbTables) {
  //   dbTableNameSet.add(tableName);
  // }

  const seedTables = parseSeed(path);

  const getOperation = (
    seedTableName: string,
    modelNameSet: Set<string>,
    dbTableNameSet: Set<string>,
  ) => {
    if (
      modelNameSet.has(seedTableName) && !(dbTableNameSet.has(seedTableName))
    ) {
      return "Create + Insert";
    } else if (
      modelNameSet.has(seedTableName) && dbTableNameSet.has(seedTableName)
    ) {
      return "Insert";
    }
  };

  for (const seedTableName in seedTables) {
    const operation = getOperation(seedTableName, modelNameSet, dbTableNameSet);

    // console.log(operation);

    switch (operation) {
      case "Create + Insert": {
        let modelColumns = models[seedTableName];

        const createTableQuery = getCreateTableQuery(
          seedTableName,
          modelColumns,
        );

        await db.queryObject(createTableQuery);

        const insertQuery = getInsertQuery(
          seedTables[seedTableName],
          seedTableName,
        );

        await db.queryObject(insertQuery);
        break;
      }
      case "Insert": {
        const insertQuery = getInsertQuery(
          seedTables[seedTableName],
          seedTableName,
        );

        await db.queryObject(insertQuery);
        break;
      }
      default: {
        console.log(`Invalid Operation On The ${seedTableName} Table`);
        break;
      }
    }
  }

  DisconnectDb(db);
}

// * Previous parseSeed Function
// const parseSeed2 = (path: string = "./seed.ts") => {
//   const data: any = Deno.readTextFileSync(resolve(path));
//   const output: any = {};

//   const tableNames: any = data.match(/(const|let|var)\s\w+:/g);

//   for (let i = 0; i < tableNames.length; i++) {
//     tableNames[i] = tableNames[i].replace(/(const|let|var)\s(\w+)\:/g, "$2");
//   }

//   // console.log(tableNames);

//   let tablesData = data.replace(/\s*/g, "");

//   tablesData = tablesData.replace(/(const|let|var)/g, " ").slice(1);

//   tablesData = tablesData.split(" ");

//   for (let i = 0; i < tablesData.length; i++) {
//     tablesData[i] = tablesData[i].match(/\{.*\,\}/)[0];

//     let tableData = tablesData[i];

//     // console.log(tablesData[i]);

//     const regex = /[\{\,\}]/g;

//     tableData = tableData.replace(regex, " ").replace(/\s*(.*)\s*/, "$1");

//     tableData = tableData.slice(0, tableData.length - 2).split(/\s{2,}/);

//     for (let i = 0; i < tableData.length; i++) {
//       tableData[i] = tableData[i].split(" ");
//       for (let j = 0; j < tableData[i].length; j++) {
//         tableData[i][j] = tableData[i][j].split(":");
//       }
//     }

//     const tableEntries = [];
//     let columnData: any;

//     for (const entry of tableData) {
//       columnData = {};
//       for (const column of entry) {
//         const [columnName, columnValue] = column;
//         if (columnValue.includes("BigInt")) {
//           columnData[columnName] = BigInt(
//             columnValue.replace(/BigInt\((\d+)\).*/, "$1"),
//           );
//         } else columnData[columnName] = JSON.parse(columnValue);
//       }
//       tableEntries.push(columnData);
//     }

//     for (const tableName of tableNames) {
//       output[tableName] = tableEntries;
//     }
//   }

//   return output;
// };

await seed();
