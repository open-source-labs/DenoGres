import { introspect } from "./introspect.ts";
import { ConnectDb, DisconnectDb } from "./Db.ts";
import { enumSync } from "./enumSync.ts";
import modelParser2 from "./modelParser2.ts";
import { join } from "https://deno.land/std@0.141.0/path/win32.ts";
import { getCreateTableQuery } from "./seed.ts";

const getDeleteTablesQuery = (
  deleteTablesList: string[],
  overwrite: Boolean,
) => {
  let deleteTablesQuery = ``;

  if (overwrite) {
    for (const table of deleteTablesList) {
      deleteTablesQuery += `DROP TABLE ${table} CASCADE; `;
    }
    return deleteTablesQuery;
  }

  for (const table of deleteTablesList) {
    let input;
    let properInput = false;

    while (!properInput) {
      input = prompt(
        `Are you sure you want to delete the ${table} table? [y/n]`,
      );
      const formattedInput = input?.toLowerCase().replace(/\s/g, "");

      switch (formattedInput) {
        case "y": {
          deleteTablesQuery += `DROP TABLE ${table} CASCADE; `;
          properInput = true;
          break;
        }
        case "n": {
          properInput = true;
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  return deleteTablesQuery;
};

const getCreateTablesQuery = (createTablesList: string[], models: any) => {
  let getCreateTablesQuery = ``;

  for (const tableName of createTablesList) {
    const columns = models?.tableName;
    getCreateTablesQuery += getCreateTableQuery(tableName, columns);
  }

  return getCreateTablesQuery;
};

const getDeleteColumnsQuery = (
  tableName: string,
  deleteColumnsList: string[],
  overwrite: Boolean,
) => {
  let deleteColumnsQuery = `ALTER TABLE ${tableName} `;

  if (overwrite) {
    for (const columnName of deleteColumnsList) {
      deleteColumnsQuery += `DROP COLUMN ${columnName} CASCADE, `;
    }

    deleteColumnsQuery =
      deleteColumnsQuery.slice(0, deleteColumnsQuery.length - 2) + ";";

    return deleteColumnsQuery;
  }

  for (const columnName of deleteColumnsList) {
    let input;
    let properInput = false;

    while (!properInput) {
      input = prompt(
        `Are you sure you want to delete the ${columnName} column? [y/n]`,
      );
      const formattedInput = input?.toLowerCase().replace(/\s/g, "");

      switch (formattedInput) {
        case "y": {
          deleteColumnsQuery += `DROP COLUMN ${columnName} CASCADE, `;
          properInput = true;
          break;
        }
        case "n": {
          properInput = true;
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  deleteColumnsQuery =
    deleteColumnsQuery.slice(0, deleteColumnsQuery.length - 2) + ";";

  return deleteColumnsQuery;
};

const getCreateColumnsQuery = (
  tableName: string,
  createColumnList: string[],
  models: any,
) => {
  let createColumnsQuery = ``;

  for (const columnName of createColumnList) {
    if (models[columnName].autoIncrement) {
      models[columnName].type = "SERIAL";
    }

    let createColumnQuery =
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${
        models[columnName].type
      } `;

    const associations = [];

    for (const constraint in models[columnName]) {
      switch (constraint) {
        case "association": {
          associations.push({
            tableName: tableName,
            columnName: columnName,
            mappedTable: models[columnName].association?.table,
            mappedColumn: models[columnName].association?.mappedCol,
          });
          break;
        }
        case "primaryKey": {
          createColumnQuery += `PRIMARY KEY `;
          break;
        }
        case "notNull": {
          createColumnQuery += `NOT NULL `;
          break;
        }
        case "unique": {
          createColumnQuery += `UNIQUE `;
          break;
        }
        case "defaultVal": {
          createColumnQuery += `DEFAULT ${models[columnName].defaultVal} `;
          break;
        }
        // ! Work on these later
        case "checks": {
          break;
        }
        case "length": {
          break;
        }
        default: {
          break;
        }
      }
    }

    createColumnQuery =
      createColumnQuery.slice(0, createColumnQuery.length - 1) + "; ";

    let associationIndex = 0;
    for (const association of associations) {
      const { tableName, columnName, mappedTable, mappedColumn } = association;

      createColumnQuery +=
        `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_fkey${associationIndex++} FOREIGN KEY ("${columnName}") REFERENCES ${mappedTable}(${mappedColumn}); `;
    }
    createColumnsQuery += createColumnQuery;
  }

  return createColumnsQuery;
};

const getUpdateTablesQuery = (
  updateTablesList: string[],
  models: any,
  dbTables: any,
  overwrite: Boolean,
) => {
  let updateTablesQuery = ``;

  for (const tableName of updateTablesList) {
    const modelColumns = models[tableName];
    const dbColumns = dbTables[tableName].columns;

    const createColumnList = [];
    const updateColumnList = [];

    const modelColumnNames = new Set(Object.keys(modelColumns));
    const dbColumnNames = new Set(Object.keys(dbColumns));

    for (const columnName of modelColumnNames) {
      if (dbColumnNames.has(columnName)) {
        if (
          String(modelColumns[columnName]) !== String(dbColumns[columnName])
        ) {
          updateColumnList.push(columnName);
        }
        modelColumnNames.delete(tableName);
        dbColumnNames.delete(tableName);
      } else if (!(dbColumnNames.has(tableName))) {
        createColumnList.push(tableName);
        modelColumnNames.delete(tableName);
      }
    }

    const deleteColumnsList = Array.from(dbColumnNames);

    const deleteColumnsQuery = getDeleteColumnsQuery(
      tableName,
      deleteColumnsList,
      overwrite,
    );
    deleteColumnsQuery.length ? updateTablesQuery += deleteColumnsQuery : null;

    const createColumnsQuery = getCreateColumnsQuery(
      tableName,
      createColumnList,
      models,
    );
    createColumnsQuery.length ? updateTablesQuery += createColumnsQuery : null;

    // const updateColumnsQuery = getUpdateColumnsQuery(tableName, updateColumnList, models);
  }

  return updateTablesQuery;
};

export default async function sync2(overwrite = false) {
  if (!overwrite) {
    console.log(
      "To avoid all potential prompts, please consider running your command with the -x flag.",
    );
  }

  let masterQuery = ``;

  const [dbTables] = await introspect();
  const db = await ConnectDb();

  const models = await modelParser2();

  // ! Need to Come back to this later
  // await enumSync();

  const modelTableNames: Set<string> = new Set(Object.keys(models));
  const dbTableNames: Set<string> = new Set(Object.keys(dbTables));

  const createTablesList = [];
  const updateTablesList = [];

  for (const tableName of modelTableNames) {
    if (dbTableNames.has(tableName)) {
      if (String(models[tableName]) !== String(dbTables[tableName].columns)) {
        updateTablesList.push(tableName);
      }
      modelTableNames.delete(tableName);
      dbTableNames.delete(tableName);
    } else if (!(dbTableNames.has(tableName))) {
      createTablesList.push(tableName);
      modelTableNames.delete(tableName);
    }
  }

  const deleteTablesList = Array.from(dbTableNames);

  const deleteTablesQuery = getDeleteTablesQuery(deleteTablesList, overwrite);
  deleteTablesQuery.length ? masterQuery += deleteTablesQuery : null;

  const createTablesQuery = getCreateTablesQuery(createTablesList, models);
  createTablesQuery.length ? masterQuery += createTablesQuery : null;

  const updateTablesQuery = getUpdateTablesQuery(
    updateTablesList,
    models,
    dbTables,
    overwrite,
  );
  updateTablesQuery.length ? masterQuery += updateTablesQuery : null;

  await db.queryObject(masterQuery);

  DisconnectDb(db);
}

await sync2();
