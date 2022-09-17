import { introspect } from "./introspect.ts";
import { ConnectDb, DisconnectDb } from "./Db.ts";
// import { enumSync } from "./enumSync.ts";
import modelParser2 from "./modelParser2.ts";
import { getCreateTableQuery } from "./seed.ts";

// interface TableForeignKey {
//   table_name: string;
//   foreign_key: string;
//   pg_get_constraintdef: string;
// }

// const isTableForeignKeys = (
//   records: TableForeignKey[] | unknown[],
// ): records is TableForeignKey[] => {
//   return records.every((record: any) => {
//     return (
//       "table_name" in record &&
//       "foreign_key" in record &&
//       "pg_get_constraintdef" in record
//     );
//   });
// };

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
    const columns = models[tableName];
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
  const originalLength = deleteColumnsQuery.length;

  if (overwrite) {
    for (const columnName of deleteColumnsList) {
      deleteColumnsQuery += `DROP COLUMN ${columnName} CASCADE, `;
    }

    deleteColumnsQuery =
      deleteColumnsQuery.slice(0, deleteColumnsQuery.length - 2) + ";";

    return deleteColumnsQuery.length > originalLength ? deleteColumnsQuery : "";
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

  return deleteColumnsQuery !== `ALTER TABLE ${tableName} `
    ? deleteColumnsQuery
    : "";
};

const getCreateColumnsQuery = (
  tableName: string,
  createColumnList: string[],
  model: any,
) => {
  let createColumnsQuery = ``;

  for (const columnName of createColumnList) {
    if (model[columnName].autoIncrement !== undefined) {
      model[columnName].type = "SERIAL";
    }

    let createColumnQuery =
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${
        model[columnName].type
      } `;

    const associations = [];

    for (const constraint in model[columnName]) {
      switch (constraint) {
        case "association": {
          associations.push({
            tableName: tableName,
            columnName: columnName,
            mappedTable: model[columnName].association?.table,
            mappedColumn: model[columnName].association?.mappedCol,
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
          createColumnQuery += `DEFAULT ${model[columnName].defaultVal} `;
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

const getUpdateColumnsQuery = async (
  tableName: string,
  updateColumnList: string[],
  models: any,
) => {
  const db = await ConnectDb();

  const constraintsListQuery =
    `SELECT tables.schemaname, class.relname AS table_name, 
  pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
  FROM pg_class class
  INNER JOIN pg_tables tables on class.relname = tables.tablename
  INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid
  AND class.relname = '${tableName}';`;

  const constraintsListQueryObject = await db.queryObject(constraintsListQuery);

  const constraintsList: any = constraintsListQueryObject.rows;

  const tableConstraints: any = {};

  for (const constraint of constraintsList) {
    const { contype, conname, condef } = constraint;

    const start = constraint.condef.indexOf("(");
    const end = constraint.condef.indexOf(")");
    const columnName = constraint.condef.slice(start + 1, end);

    if (!tableConstraints[columnName]) tableConstraints[columnName] = {};
    if (!tableConstraints[columnName][contype]) {
      tableConstraints[columnName][contype] = [];
    }

    switch (contype) {
      case "f": {
        tableConstraints[columnName][contype].push({ conname, condef });
        break;
      }
      case "p": {
        tableConstraints[columnName][contype] = conname;
        break;
      }
      default: {
        tableConstraints[columnName][contype].push(conname);
        break;
      }
    }
  }

  let updateColumnsQuery = ``;

  for (const columnName of updateColumnList) {
    const modelColumn = models[tableName][columnName];
    // const dbColumn = dbTables[tableName][columnName].columns[columnName];
    const columnConstraints = tableConstraints[columnName];

    if (!(modelColumn.notNull)) {
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP NOT NULL; `;
    }

    if (!(modelColumn.unique) && columnConstraints && columnConstraints.u) {
      for (const unique of columnConstraints.u) {
        updateColumnsQuery +=
          `ALTER TABLE ${tableName} DROP CONSTRAINT ${unique}; `;
      }
    }
    if (!(modelColumn.defaultVal)) {
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP DEFAULT; `;
    }

    if (
      !(modelColumn.primaryKey) && columnConstraints && columnConstraints.p
    ) {
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${columnConstraints.p}; `;
    }

    // const association = {
    //   mappedTable: modelColumn.association.table || null,
    //   mappedColumn: modelColumn.association.mappedCol || null,
    // };

    // ! Delete all associations?
    if (
      !(modelColumn.association) && columnConstraints && columnConstraints.f
    ) {
      for (const foreignKey of columnConstraints.f) {
        if (foreignKey.condef.includes(`(${columnName})`)) {
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${foreignKey.conname} CASCADE; `;
        }
      }
    }

    for (const constraint in modelColumn) {
      switch (constraint) {
        case "association": {
          const association = {
            mappedTable: modelColumn.association.table || null,
            mappedColumn: modelColumn.association.mappedCol || null,
          };

          let foreignKeyIndex: number = 0;
          let existingForeignKey = false;
          let existingForeignKeyIndex: number = 0;

          if (columnConstraints) {
            for (const foreignKey of columnConstraints.f) {
              const currentIndex = Number(
                foreignKey.conname.replace(/.*fkey(\d+)/g, "$1"),
              );

              if (!isNaN(currentIndex)) {
                foreignKeyIndex = Math.max(
                  currentIndex + 1,
                  foreignKeyIndex,
                );
              }

              if (
                foreignKey.condef.includes(`(${columnName})`) &&
                foreignKey.condef.includes(
                  `${association.mappedTable}(${association.mappedColumn})`,
                )
              ) {
                if (!existingForeignKey) {
                  existingForeignKey = true;
                  existingForeignKeyIndex = Number(
                    foreignKey.conname.replace(/.*fkey(\d+)/g, "$1"),
                  );
                }
                updateColumnsQuery +=
                  `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${foreignKey.conname} CASCADE; `;
              }
            }
          }

          if (existingForeignKey) {
            foreignKeyIndex = existingForeignKeyIndex;
          }
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_fkey${foreignKeyIndex} FOREIGN KEY (${columnName}) REFERENCES ${association.mappedTable}(${association.mappedColumn}); `;
          break;
        }
        case "primaryKey": {
          if (columnConstraints.p) {
            updateColumnsQuery +=
              `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${columnConstraints.p} CASCADE; `;
          }
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_pkey PRIMARY KEY (${modelColumn.primaryKey}); `;
          break;
        }
        case "notNull": {
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET NOT NULL; `;
          break;
        }
        case "unique": {
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${tableName}_${columnName}_unique; ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_unique UNIQUE(${columnName}); `;
          break;
        }
        case "defaultVal": {
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET DEFAULT '${modelColumn.defaultVal}'; `;
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
  }
  await DisconnectDb(db);

  return updateColumnsQuery;
};

const getUpdateTablesQuery = async (
  updateTablesList: string[],
  models: any,
  dbTables: any,
  overwrite: Boolean,
) => {
  let updateTablesQuery = ``;

  for (const tableName of updateTablesList) {
    const modelColumns = models[tableName];
    const dbColumns = dbTables[tableName].columns;

    const createColumnsList = [];
    const updateColumnsList = [];

    const modelColumnNames = new Set(Object.keys(modelColumns));
    const dbColumnNames = new Set(Object.keys(dbColumns));

    const constraintsChecker = (modelConstraints: any, dbConstraints: any) => {
      if (modelConstraints.type !== dbConstraints.type) return true;
      if (
        Boolean(modelConstraints.notNull) !== Boolean(dbConstraints.notNull)
      ) {
        return true;
      }
      if (Boolean(modelConstraints.unique) !== Boolean(dbConstraints.unique)) {
        return true;
      }
      if (
        Boolean(modelConstraints.primaryKey) !==
          Boolean(dbConstraints.primaryKey)
      ) {
        return true;
      }
      if (
        JSON.stringify(modelConstraints.defaultVal) !==
          JSON.stringify(dbConstraints.defaultVal)
      ) {
        return true;
      }
      if (
        JSON.stringify(modelConstraints.association) !==
          JSON.stringify(dbConstraints.association)
      ) {
        return true;
      }

      return false;
    };

    for (const columnName of modelColumnNames) {
      if (dbColumnNames.has(columnName)) {
        if (
          constraintsChecker(
            models[tableName][columnName],
            dbColumns[columnName],
          )
        ) {
          updateColumnsList.push(columnName);
        }
        modelColumnNames.delete(columnName);
        dbColumnNames.delete(columnName);
      } else if (!(dbColumnNames.has(columnName))) {
        createColumnsList.push(columnName);
        modelColumnNames.delete(columnName);
      }
    }

    const deleteColumnsList = Array.from(dbColumnNames);

    const createColumnsQuery = getCreateColumnsQuery(
      tableName,
      createColumnsList,
      models[tableName],
    );
    createColumnsQuery.length ? updateTablesQuery += createColumnsQuery : null;

    const deleteColumnsQuery = getDeleteColumnsQuery(
      tableName,
      deleteColumnsList,
      overwrite,
    );
    deleteColumnsQuery.length ? updateTablesQuery += deleteColumnsQuery : null;

    const updateColumnsQuery: any = await getUpdateColumnsQuery(
      tableName,
      updateColumnsList,
      models,
    );

    updateColumnsQuery.length ? updateTablesQuery += updateColumnsQuery : null;
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

  const checkUpdateColumns = (modelColumns: any, dbColumns: any) => {
    for (const columnName in dbColumns) {
      if (!(modelColumns[columnName])) return true;
    }

    for (const columnName in modelColumns) {
      const column = modelColumns[columnName];
      const dbColumn = dbColumns[columnName];

      if (!dbColumn) return true;

      // dbColumn.type = dbColumn.type || null;
      // dbColumn.notNull = dbColumn.no

      if (column.type !== dbColumn.type) return true;
      if (Boolean(column.notNull) !== Boolean(dbColumn.notNull)) return true;
      if (Boolean(column.unique) !== Boolean(dbColumn.unique)) return true;
      if (Boolean(column.primaryKey) !== Boolean(dbColumn.primaryKey)) {
        return true;
      }
      if (
        JSON.stringify(column.defaultVal) !==
          JSON.stringify(dbColumn.defaultVal)
      ) {
        return true;
      }
      if (
        JSON.stringify(column.association) !==
          JSON.stringify(dbColumn.association)
      ) {
        return true;
      }
    }

    return false;
  };

  for (const tableName of modelTableNames) {
    if (!(dbTableNames.has(tableName))) {
      createTablesList.push(tableName);
      modelTableNames.delete(tableName);
    } else {
      if (checkUpdateColumns(models[tableName], dbTables[tableName].columns)) {
        updateTablesList.push(tableName);
      }
      modelTableNames.delete(tableName);
      dbTableNames.delete(tableName);
    }
  }

  const deleteTablesList = Array.from(dbTableNames);

  const deleteTablesQuery = getDeleteTablesQuery(deleteTablesList, overwrite);
  deleteTablesQuery.length ? masterQuery += await deleteTablesQuery : null;

  const createTablesQuery = getCreateTablesQuery(createTablesList, models);
  createTablesQuery.length ? masterQuery += await createTablesQuery : null;

  const updateTablesQuery: any = await getUpdateTablesQuery(
    updateTablesList,
    models,
    dbTables,
    overwrite,
  );
  updateTablesQuery.length ? masterQuery += await updateTablesQuery : null;

  // console.log("masterQuery:", await masterQuery);

  await db.queryObject(masterQuery);

  DisconnectDb(db);
}

await sync2(true);
