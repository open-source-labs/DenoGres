import { introspect } from "./introspect.ts";
import { ConnectDb, DisconnectDb } from "./Db.ts";
import modelParser from "./modelParser.ts";
import { enumSync } from "./enumSync.ts";
import { checkDbSync } from "./checkDbSync.ts";

const removeWhitespaces = (string: string) => string.replace(/\s/g, "");

const objectLooselyEquals = (modelObject: any, dbObject: any) => {
  return JSON.stringify(Object.keys(modelObject).sort()) ===
      JSON.stringify(Object.keys(dbObject).sort()) &&
    removeWhitespaces(JSON.stringify(Object.values(modelObject).sort())) ===
      removeWhitespaces(JSON.stringify(Object.values(dbObject).sort()));
};

// * take schema information in the model.ts and upload into the PSQL database
// * overwrite: if the user passes an additional optional flag -x, overwrite will be come true, which will not prompt the user whenever deleting any table/column
export default async function sync(overwrite = false) {
  // * if the optional -x flag wasn't passed in, alert the user
  if (!overwrite) {
    console.log(
      "To avoid all potential prompts, please consider running your command with the -x flag.",
    );
  }

  // * compilation of all the queries that will be sent to PSQL DB (for ACID Compliance)
  let masterQuery = ``;

  // * schema information from the PSQL DB
  const [dbTables] = await introspect();
  const db = await ConnectDb();

  // * schema information from the local model.ts file
  const models = await modelParser();

  await enumSync(); // syncs changes made to enum types in model.ts with database

  const modelTableNames: Set<string> = new Set(Object.keys(models));
  const dbTableNames: Set<string> = new Set(Object.keys(dbTables));

  const createTablesList = [];
  const updateTablesList = [];

  // * function that verifies whether or not a given table needs to be updated
  const checkUpdateColumns = (modelColumns: any, dbColumns: any) => {
    for (const columnName in dbColumns) {
      if (modelColumns[columnName] === undefined) return true;
    }
    for (const columnName in modelColumns) {
      if (dbColumns[columnName] === undefined) return true;
    }

    for (const columnName in modelColumns) {
      const column = modelColumns[columnName];
      const dbColumn = dbColumns[columnName];

      if (!objectLooselyEquals(column, dbColumn)) {
        return true;
      }
    }

    return false;
  };

  // * loop through all of the tables to determine which tables to create, delete, update
  for (const tableName of modelTableNames) {
    if (!(dbTableNames.has(tableName))) {
      createTablesList.push(tableName);
      modelTableNames.delete(tableName);
    } else {
      if (checkUpdateColumns(models[tableName], dbTables[tableName])) {
        updateTablesList.push(tableName);
      }
      modelTableNames.delete(tableName);
      dbTableNames.delete(tableName);
    }
  }

  const deleteTablesList = Array.from(dbTableNames);

  // * List of tables to create/delete/update
  // console.log("List of TABLES to CREATE", createTablesList);
  // console.log("List of TABLES to DELETE", deleteTablesList);
  // console.log("List of TABLES to UPDATE", updateTablesList);

  // use helper functions to get query strings for updating database and
  // append query strings to master query string
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

  // * Single query that will be sent to PostgreSQL Database (sync will send only ONE query to the PSQL DB for ACID compliance)
  await db.queryObject(masterQuery);

  // * Used for migration feature (backing up/restoring data)
  await checkDbSync();

  DisconnectDb(db);
}

const getCreateTablesQuery = (createTablesList: string[], models: any) => {
  let getCreateTablesQuery = ``;

  for (const tableName of createTablesList) {
    const columns = models[tableName];
    // * NOTE: addition of the letter S on the left hand variable
    getCreateTablesQuery += getCreateTableQuery(tableName, columns);
  }

  return getCreateTablesQuery;
};

const getCreateTableQuery = (tableName: string, columns: any) => {
  let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

  let constraints = "";

  const associations = [];

  const checks: any = [];

  for (const column in columns) {
    if (columns[column].autoIncrement) columns[column].type = "SERIAL";

    createTableQuery += `${column} ${columns[column].type}`;
    for (const constraint in columns[column]) {
      switch (constraint) {
        // * association: foreign keys
        case "association": {
          associations.push({
            columnName: column,
            mappedTable: columns[column].association?.mappedTable,
            mappedColumn: columns[column].association?.mappedColumn,
          });
          break;
        }
        case "checks": {
          checks.push(columns[column].checks);
        }
        case "primaryKey": {
          if (columns[column].primaryKey === true) {
            constraints += " PRIMARY KEY";
          }
          break;
        }
        case "notNull": {
          if (columns[column].notNull === true) {
            constraints += " NOT NULL";
          }
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

  createTableQuery = createTableQuery.slice(0, createTableQuery.length - 2) +
    "); ";

  // * association: foreign keys
  let associationsQuery = ``;
  let associationIndex = 0;

  for (const association of associations) {
    const { columnName, mappedTable, mappedColumn } = association;

    associationsQuery += `
      ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_fkey${associationIndex++} FOREIGN KEY ("${columnName}") REFERENCES ${mappedTable}(${mappedColumn});
    `;
  }

  let checksQuery = ``;

  for (const check of checks) {
    for (const constraintName in check) {
      let checkQuery =
        `ALTER TABLE ${tableName} ADD CONSTRAINT "${constraintName}" CHECK (`;
      for (const definition of check[constraintName]) {
        const arrayRegex = /\[.*\]/;
        if (arrayRegex.test(definition)) {
          const newDefinition = definition.replace("=", " in ").replace(
            "[",
            "(",
          )
            .replace("]", ")");

          checkQuery += `${newDefinition} AND `;
        } else {
          checkQuery += `${definition} AND `;
        }
      }
      checkQuery = checkQuery.slice(0, -5) + "); ";

      checksQuery += checkQuery;
    }
  }

  createTableQuery += associationsQuery + checksQuery;

  return createTableQuery;
};

// helper function returns query string for deleting all necessary tables from db
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

    // * since overwrite is false, we need to prompt the user if they want to delete a table every time we're about to delete a table
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

// helper function returns query string for updating all necessary tables in db
const getUpdateTablesQuery = async (
  updateTablesList: string[],
  models: any,
  dbTables: any,
  overwrite: Boolean,
) => {
  let updateTablesQuery = ``;

  for (const tableName of updateTablesList) {
    const modelColumns = models[tableName];
    const dbColumns = dbTables[tableName];

    const createColumnsList = [];
    const updateColumnsList = [];

    const modelColumnNames = new Set(Object.keys(modelColumns));
    const dbColumnNames = new Set(Object.keys(dbColumns));

    // * check whether or not a given column that exists both in model.ts AND PSQL needs to be updated (values inside the column has changed)
    const constraintsChecker = (modelConstraints: any, dbConstraints: any) => {
      if (modelConstraints.type !== dbConstraints.type) return true;
      if (
        modelConstraints.notNull !== dbConstraints.notNull
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

      if (
        (modelConstraints.checks && !dbConstraints.checks) ||
        (!modelConstraints.checks && dbConstraints.checks)
      ) {
        return true;
      }

      if (modelConstraints.checks && dbConstraints.checks) {
        const modelChecks = modelConstraints.checks;
        const dbChecks = dbConstraints.checks;

        if (
          !objectLooselyEquals(modelChecks, dbChecks)
        ) {
          return true;
        }
      }

      return false;
    };

    // * figure out which columns within a table needs to be created, deleted, updated
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

    // * Shows list of columns to create/delete/update (Part of updating a table)
    // console.log(
    //   ` UPDATE TABLE (${tableName}): List of COLUMNS to CREATE`,
    //   createColumnsList,
    // );
    // console.log(
    //   ` UPDATE TABLE (${tableName}): List of COLUMNS to DELETE`,
    //   deleteColumnsList,
    // );
    // console.log(
    //   ` UPDATE TABLE (${tableName}): List of COLUMNS to UPDATE`,
    //   updateColumnsList,
    // );

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
      dbTables,
    );

    updateColumnsQuery.length ? updateTablesQuery += updateColumnsQuery : null;
  }

  return updateTablesQuery;
};

// helper function returns query string for deleting desired columns from db
const getDeleteColumnsQuery = (
  tableName: string,
  deleteColumnsList: string[],
  overwrite: Boolean,
) => {
  let deleteColumnsQuery = `ALTER TABLE ${tableName} `;
  // * will be used to verify whether or not any columns were deleted within a table
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

  return deleteColumnsQuery.length > originalLength ? deleteColumnsQuery : "";
};

// helper function returns query string for creating desired columns in db
const getCreateColumnsQuery = (
  tableName: string,
  createColumnList: string[],
  model: any,
) => {
  let createColumnsQuery = ``;

  for (const columnName of createColumnList) {
    if (model[columnName].autoIncrement) {
      model[columnName].type = "SERIAL";
    }

    if (model[columnName].type === "enum") {
      model[columnName].type = model[columnName].enumName;
    }

    let createColumnQuery =
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${
        model[columnName].type
      } `;

    // * lists of foreign keys/checks that needs to be updated on the PSQL
    const associations = [];
    const checks: any = [];

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
        case "checks": {
          checks.push(model[columnName].checks);
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
        // TODO upcoming feature
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

    for (const check of checks) {
      for (const constraintName in check) {
        let checkQuery =
          `ALTER TABLE ${tableName} ADD CONSTRAINT "${constraintName}" CHECK (`;
        for (const definition of check[constraintName]) {
          const arrayRegex = /\[.*\]/;
          // * if the check has list of categories (i.e. gender in ('F', 'M'))
          if (arrayRegex.test(definition)) {
            const newDefinition = definition.replace("=", " in ").replace(
              "[",
              "(",
            )
              .replace("]", ")");

            checkQuery += `${newDefinition} AND `;
          } else {
            checkQuery += `${definition} AND `;
          }
        }
        checkQuery = checkQuery.slice(0, -5) + "); ";

        createColumnQuery += checkQuery;
      }
    }

    createColumnsQuery += createColumnQuery;
  }

  return createColumnsQuery;
};

// helper function returns query string for updating columns in db
const getUpdateColumnsQuery = async (
  tableName: string,
  updateColumnsList: string[],
  models: any,
  dbTables: any,
) => {
  const db = await ConnectDb();
  let updateColumnsQuery = ``;

  // * query that gets all constraints in a given table
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

  // * organize all of the constraints in a table by the columns they are used in
  for (const constraint of constraintsList) {
    const { contype, conname, condef } = constraint;
    let columnName;

    if (contype === "c") {
      columnName = condef.match(/\w+/g)[1];
    } else {
      const start = constraint.condef.indexOf("(");
      const end = constraint.condef.indexOf(")");
      columnName = constraint.condef.slice(start + 1, end);
    }

    if (!tableConstraints[columnName]) tableConstraints[columnName] = {};
    if (!tableConstraints[columnName][contype]) {
      if (contype === "c" || contype === "u") {
        tableConstraints[columnName][contype] = {};
      } else tableConstraints[columnName][contype] = [];
    }

    switch (contype) {
      case "f": {
        tableConstraints[columnName][contype].push({
          name: conname,
          definition: condef,
        });
        break;
      }
      case "p": {
        tableConstraints[columnName][contype] = conname;
        break;
      }
      case "c": {
        let parsedCondef: any = condef.slice(6).replace(/[\(\)]/g, "");
        parsedCondef = parsedCondef.replace(/\:\:\w+\s?\w+(\[\])?/g, "");
        parsedCondef = parsedCondef.split(" AND ");

        for (let i = 0; i < parsedCondef.length; i++) {
          const arrayRegex = /\[(.*)\]/;
          // * if the check has categories
          if (arrayRegex.test(parsedCondef[i])) {
            const parsedCondef1 = parsedCondef[i].replace(/(.*\s\=\s).*/, "$1");
            const parsedCondef2 = parsedCondef[i].match(arrayRegex)[0];
            parsedCondef[i] = parsedCondef1 + parsedCondef2;
          }
        }

        const newCheck: any = {};
        newCheck[conname] = parsedCondef;
        tableConstraints[columnName][contype][conname] = parsedCondef;

        break;
      }
      case "u": {
        tableConstraints[columnName][contype][conname] = condef;
      }
      default: {
        break;
      }
    }
  }

  let primaryKeyAssignment = false;

  for (const columnName of updateColumnsList) {
    const modelColumn = models[tableName][columnName];
    const dbColumn = dbTables[tableName][columnName];

    const columnConstraints = tableConstraints[columnName];

    if (
      (modelColumn.notNull === undefined || modelColumn.notNull === false) &&
      dbColumn.notNull === true
    ) {
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP NOT NULL; `;
    } else if (modelColumn.notNull === true && dbColumn.notNull === false) {
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET NOT NULL; `;
    }

    if (
      modelColumn.defaultVal === undefined && dbColumn.defaultVal !== undefined
    ) {
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP DEFAULT; `;
    } else if (
      modelColumn.defaultVal !== undefined && dbColumn.defaultVal === undefined
    ) {
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET DEFAULT '${modelColumn.defaultVal}'; `;
    }

    if (modelColumn.unique === true && !dbColumn.unique) {
      for (const column in tableConstraints) {
        if (tableConstraints[column].u) {
          const uniqueConstraints = tableConstraints[column].u;
          for (const uniqueName in uniqueConstraints) {
            const start = uniqueConstraints[uniqueName].indexOf("(");
            const end = uniqueConstraints[uniqueName].indexOf(")") + 1;
            if (
              uniqueConstraints[uniqueName].slice(start, end) === columnName
            ) {
              updateColumnsQuery +=
                `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${uniqueName} CASCADE; `;
            }
          }
        }
      }
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_unique UNIQUE(${columnName}); `;
    }

    if (modelColumn.primaryKey === true) {
      for (const column in tableConstraints) {
        if (tableConstraints[column].p) {
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${
              tableConstraints[column].p
            } CASCADE; `;
        }
      }
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_pkey PRIMARY KEY (${columnName}); `;
      primaryKeyAssignment = true;
    } else if (
      // * avoiding adding more than one primary key inside a table
      !modelColumn.primaryKey && !primaryKeyAssignment && dbColumn.primaryKey
    ) {
      if (columnConstraints.p) {
        updateColumnsQuery +=
          `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${columnConstraints.p} CASCADE; `;
      }
    }

    if (modelColumn.association && !dbColumn.association) {
      const { name, mappedTable, mappedColumn } = modelColumn.association;

      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ADD CONSTRAINT ${name} FOREIGN KEY (${columnName}) REFERENCES ${mappedTable}(${mappedColumn}); `;
    } else if (!modelColumn.association && dbColumn.association) {
      const { name } = dbColumn.association;

      updateColumnsQuery +=
        `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${name} CASCADE; `;
    }

    const modelChecks = modelColumn.checks;
    const dbChecks = dbColumn.checks;

    if (modelChecks) {
      for (const checkName in modelChecks) {
        if (!dbChecks) {
          let checkQuery =
            `ALTER TABLE ${tableName} ADD CONSTRAINT "${checkName}" CHECK (`;
          for (const definition of modelChecks[checkName]) {
            const arrayRegex = /\[.*\]/;
            if (arrayRegex.test(definition)) {
              const newDefinition = definition.replace("=", " in ")
                .replace("[", "(")
                .replace("]", ")");

              checkQuery += `${newDefinition} AND `;
            } else {
              checkQuery += `${definition} AND `;
            }
          }
          checkQuery = checkQuery.slice(0, -5) + "); ";

          updateColumnsQuery += checkQuery;
        }

        if (dbChecks && !dbChecks[checkName]) {
          for (const column in tableConstraints) {
            const currentCheck = tableConstraints[column].c;

            if (currentCheck && currentCheck[checkName]) {
              updateColumnsQuery +=
                `ALTER TABLE ${tableName} DROP CONSTRAINT ${checkName} CASCADE; `;
            }
          }

          let checkQuery =
            `ALTER TABLE ${tableName} ADD CONSTRAINT "${checkName}" CHECK (`;
          for (const definition of modelChecks[checkName]) {
            const arrayRegex = /\[.*\]/;
            if (arrayRegex.test(definition)) {
              const newDefinition = definition.replace("=", " in ")
                .replace("[", "(")
                .replace("]", ")");

              checkQuery += `${newDefinition} AND `;
            } else {
              checkQuery += `${definition} AND `;
            }
          }
          checkQuery = checkQuery.slice(0, -5) + "); ";

          updateColumnsQuery += checkQuery;
        }
      }
    }

    if (dbChecks) {
      for (const checkName in dbChecks) {
        if (modelChecks && !modelChecks[checkName]) {
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${checkName}; `;
        }
      }
    }

    if (modelChecks && dbChecks) {
      for (const checkName in modelChecks) {
        if (
          (modelChecks[checkName] &&
            dbChecks[checkName]) &&
          !objectLooselyEquals(modelChecks[checkName], dbChecks[checkName])
        ) {
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${checkName}; `;

          let checkQuery =
            `ALTER TABLE ${tableName} ADD CONSTRAINT "${checkName}" CHECK (`;
          for (const definition of modelChecks[checkName]) {
            const arrayRegex = /\[.*\]/;
            if (arrayRegex.test(definition)) {
              const newDefinition = definition.replace("=", " in ").replace(
                "[",
                "(",
              )
                .replace("]", ")");

              checkQuery += `${newDefinition} AND `;
            } else {
              checkQuery += `${definition} AND `;
            }
          }
          checkQuery = checkQuery.slice(0, -5) + "); ";

          updateColumnsQuery += checkQuery;
        }
      }
    }

    // * when a given column in a table does NOT have any constraint attached to, continue with the loop
    if (!columnConstraints) continue;

    if (columnConstraints.f) {
      for (const foreignKey of columnConstraints.f) {
        if (
          modelColumn.mappedTable === foreignKey.mappedTable &&
          modelColumn.mappedColumn === foreignKey.mappedColumn
        ) {
          if (
            foreignKey.mappedTable !== dbColumn.mappedTable &&
            foreignKey.mappedColumn !== dbColumn.mappedColumn
          ) {
            updateColumnsQuery +=
              `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${foreignKey.name} CASCADE; `;
          }
        }
      }
    }

    if (
      (modelColumn.unique === undefined || modelColumn.unique === false) &&
      dbColumn.unique === true
    ) {
      for (const unique in columnConstraints.u) {
        updateColumnsQuery +=
          `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${unique}; `;
      }
    }
  }

  await DisconnectDb(db);

  return updateColumnsQuery;
};
