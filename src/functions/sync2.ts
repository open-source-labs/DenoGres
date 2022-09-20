import { introspect2 } from "./introspect2.ts";
import { ConnectDb, DisconnectDb } from "./Db.ts";
import modelParser2 from "./modelParser2.ts";
import { enumSync } from "./enumSync.ts";
import { checkDbSync } from "./checkDbSync.ts";

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

const removeWhitespaces = (string: string) => string.replace(/\s/g, "");

const objectLooselyEquals = (modelObject: any, dbObject: any) => {
  // if (typeof modelObject !== "object" || typeof dbObject !== "object") {
  //   return false;
  // }

  return JSON.stringify(Object.keys(modelObject).sort()) ===
      JSON.stringify(Object.keys(dbObject).sort()) &&
    removeWhitespaces(JSON.stringify(Object.values(modelObject).sort())) ===
      removeWhitespaces(JSON.stringify(Object.values(dbObject).sort()));
};

export default async function sync2(overwrite = false) {
  if (!overwrite) {
    console.log(
      "To avoid all potential prompts, please consider running your command with the -x flag.",
    );
  }

  let masterQuery = ``;

  const [dbTables] = await introspect2();
  const db = await ConnectDb();

  const models = await modelParser2();

  await enumSync();

  const modelTableNames: Set<string> = new Set(Object.keys(models));
  const dbTableNames: Set<string> = new Set(Object.keys(dbTables));

  const createTablesList = [];
  const updateTablesList = [];

  const checkUpdateColumns = (modelColumns: any, dbColumns: any) => {
    // console.log('modelColumns', Object.keys(modelColumns));
    // console.log('dbColumns', dbColumns);

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

  for (const tableName of modelTableNames) {
    // console.log("\n", tableName);
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

  console.log("List of TABLES to CREATE", createTablesList);
  console.log("List of TABLES to DELETE", deleteTablesList);
  console.log("List of TABLES to UPDATE", updateTablesList);

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

  console.log("masterQuery:", await masterQuery);

  await db.queryObject(masterQuery);

  await checkDbSync();

  DisconnectDb(db);
}

const getCreateTableQuery = (tableName: string, columns: any) => {
  let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

  let constraints = "";

  const associations = [];

  const checks: any = [];

  for (const column in columns) {
    if (columns[column].autoIncrement) columns[column].type = "SERIAL";

    // console.log("columnName", column);

    createTableQuery += `${column} ${columns[column].type}`;
    for (const constraint in columns[column]) {
      switch (constraint) {
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

  // console.log('createTableQuery: ', createTableQuery);

  createTableQuery = createTableQuery.slice(0, createTableQuery.length - 2) +
    "); ";

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
    // console.log('CHECK in checks', check);
    for (const constraintName in check) {
      let checkQuery =
        `ALTER TABLE ${tableName} ADD CONSTRAINT "${constraintName}" CHECK (`;
      for (const definition of check[constraintName]) {
        // console.log('DEF', definition);

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

  // console.log('CHECKSQUERY', checksQuery);

  createTableQuery += associationsQuery + checksQuery;

  return createTableQuery;
};

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

  // const originalLength = deleteColumnsQuery.length;

  deleteColumnsQuery =
    deleteColumnsQuery.slice(0, deleteColumnsQuery.length - 2) + ";";

  return deleteColumnsQuery.length > originalLength ? deleteColumnsQuery : "";
};

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
        // ! Work on these later
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

const getUpdateColumnsQuery = async (
  tableName: string,
  updateColumnsList: string[],
  models: any,
  dbTables: any,
) => {
  const db = await ConnectDb();
  let updateColumnsQuery = ``;

  //!
  const constraintsListQuery =
    `SELECT tables.schemaname, class.relname AS table_name, 
  pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
  FROM pg_class class
  INNER JOIN pg_tables tables on class.relname = tables.tablename
  INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid
  AND class.relname = '${tableName}';`;

  const constraintsListQueryObject = await db.queryObject(constraintsListQuery);

  const constraintsList: any = constraintsListQueryObject.rows;

  // console.log("CONS LIST", constraintsList);

  const tableConstraints: any = {};

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
          if (arrayRegex.test(parsedCondef[i])) {
            const parsedCondef1 = parsedCondef[i].replace(/(.*\s\=\s).*/, "$1");
            const parsedCondef2 = parsedCondef[i].match(arrayRegex)[0];
            parsedCondef[i] = parsedCondef1 + parsedCondef2;
          }
        }

        // console.log(parsedCondef);

        const newCheck: any = {};
        newCheck[conname] = parsedCondef;
        tableConstraints[columnName][contype][conname] = parsedCondef;

        // tableConstraints[columnName][contype].push({
        //   name: conname,
        //   definition: parsedCondef
        // })
        // tableConstraints[columnName][contype].push(newCheck)
        break;
      }
      case "u": {
        tableConstraints[columnName][contype][conname] = condef;
      }
      default: {
        // tableConstraints[columnName][contype].push(conname);
        break;
      }
    }
  }

  // console.log("TABLE CONSTRAINTS", tableConstraints);
  // console.log("TABLE CONSTRAINTS", tableConstraints);
  //!

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

    // console.log("MODEL COL", modelColumn);
    // console.log("DB COL", dbColumn);

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
      // updateColumnsQuery +=
      //   `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${tableName}_${columnName}_unique; ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_unique UNIQUE(${columnName}); `;
      updateColumnsQuery +=
        `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_unique UNIQUE(${columnName}); `;
    }

    if (modelColumn.primaryKey === true) {
      for (const column in tableConstraints) {
        if (tableConstraints[column].p) {
          // console.log(column);
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

    // else if (
    //   !objectLooselyEquals(modelColumn.association, dbColumn.association)
    // ) {
    //   const { name, mappedTable, mappedColumn } = modelColumn.association;

    //   const dbAssociation = dbColumn.association;

    //   updateColumnsQuery +=
    //     `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${dbAssociation.name} CASCADE; ALTER TABLE ${tableName} ADD CONSTRAINT ${name} FOREIGN KEY (${columnName}) REFERENCES ${mappedTable}(${mappedColumn}); `;
    // }

    // if (!objectLooselyEquals(modelColumn.checks, dbColumn.checks)) {

    //   console.log(modelColumn.checks);
    // }

    // console.log("MODEL CHECKS", modelColumn.checks);
    // console.log("DB CHECKS", dbColumn.checks);

    const modelChecks = modelColumn.checks;
    const dbChecks = dbColumn.checks;

    if (modelChecks) {
      // console.log("MODEL CHECK");
      for (const checkName in modelChecks) {
        if (!dbChecks) {
          let checkQuery =
            `ALTER TABLE ${tableName} ADD CONSTRAINT "${checkName}" CHECK (`;
          for (const definition of modelChecks[checkName]) {
            // console.log('DEF', definition);

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
            // console.log('DEF', definition);

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
      // console.log("DB CHECKS");
      for (const checkName in dbChecks) {
        if (modelChecks && !modelChecks[checkName]) {
          updateColumnsQuery +=
            `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${checkName}; `;
        }
      }
    }

    if (modelChecks && dbChecks) {
      // console.log("double");
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
            // console.log('DEF', definition);

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

    console.log(
      ` UPDATE TABLE (${tableName}): List of COLUMNS to CREATE`,
      createColumnsList,
    );
    console.log(
      ` UPDATE TABLE (${tableName}): List of COLUMNS to DELETE`,
      deleteColumnsList,
    );
    console.log(
      ` UPDATE TABLE (${tableName}): List of COLUMNS to UPDATE`,
      updateColumnsList,
    );

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

// const getUpdateColumnsQuery2 = async (
//   tableName: string,
//   updateColumnsList: string[],
//   models: any,
//   dbTables: any,
// ) => {
//   const db = await ConnectDb();

//   const constraintsListQuery =
//     `SELECT tables.schemaname, class.relname AS table_name,
//   pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
//   FROM pg_class class
//   INNER JOIN pg_tables tables on class.relname = tables.tablename
//   INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid
//   AND class.relname = '${tableName}';`;

//   const constraintsListQueryObject = await db.queryObject(constraintsListQuery);

//   const constraintsList: any = constraintsListQueryObject.rows;

//   // console.log("CONS LIST", constraintsList);

//   const tableConstraints: any = {};

//   for (const constraint of constraintsList) {
//     const { contype, conname, condef } = constraint;
//     let columnName;

//     if (contype === "c") {
//       columnName = condef.match(/\w+/g)[1];
//     } else {
//       const start = constraint.condef.indexOf("(");
//       const end = constraint.condef.indexOf(")");
//       columnName = constraint.condef.slice(start + 1, end);
//     }

//     if (!tableConstraints[columnName]) tableConstraints[columnName] = {};
//     if (!tableConstraints[columnName][contype]) {
//       tableConstraints[columnName][contype] = [];
//     }

//     switch (contype) {
//       case "f": {
//         tableConstraints[columnName][contype].push({ conname, condef });
//         break;
//       }
//       case "p": {
//         tableConstraints[columnName][contype] = conname;
//         break;
//       }
//       case "c": {
//         tableConstraints[columnName][contype].push({ conname, condef });
//         break;
//       }
//       default: {
//         tableConstraints[columnName][contype].push(conname);
//         break;
//       }
//     }
//   }

//   let updateColumnsQuery = ``;

//   // console.log("TABLE CONSTRAINTS", tableConstraints);

//   for (const columnName of updateColumnsList) {
//     const modelColumn = models[tableName][columnName];
//     const dbColumn = dbTables[tableName][columnName];

//     const columnConstraints = tableConstraints[columnName];

//     // console.log(modelColumn);
//     // console.log(dbColumn);

//     // console.log(modelColumn.notNull);
//     // console.log(dbColumn.notNull);

//     if (
//       (modelColumn.notNull === undefined || modelColumn.notNull === true) &&
//       dbColumn.notNull === false
//     ) {
//       updateColumnsQuery +=
//         `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP NOT NULL; `;
//     }

//     if (
//       (modelColumn.defaultVal === undefined) &&
//       dbColumn.defaultVal !== undefined
//     ) {
//       updateColumnsQuery +=
//         `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP DEFAULT; `;
//     }

//     // console.log(columnConstraints);

//     if (!columnConstraints) continue;

//     // console.log(columnConstraints);

//     if (
//       (modelColumn.unique === undefined || modelColumn.unique === false) &&
//       columnConstraints.u
//     ) {
//       for (const unique of columnConstraints.u) {
//         updateColumnsQuery +=
//           `ALTER TABLE ${tableName} DROP CONSTRAINT ${unique}; `;
//       }
//     }

//     // console.log(columnConstraints);

//     if (
//       !(modelColumn.primaryKey) && columnConstraints.p
//     ) {
//       updateColumnsQuery +=
//         `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${columnConstraints.p}; `;
//     }

//     // const association = {
//     //   mappedTable: modelColumn.association.table || null,
//     //   mappedColumn: modelColumn.association.mappedCol || null,
//     // };

//     // ! Delete all associations?
//     if (
//       !(modelColumn.association) && columnConstraints && columnConstraints.f
//     ) {
//       for (const foreignKey of columnConstraints.f) {
//         if (foreignKey.condef.includes(`(${columnName})`)) {
//           updateColumnsQuery +=
//             `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${foreignKey.conname} CASCADE; `;
//         }
//       }
//     }

//     for (const constraint in modelColumn) {
//       switch (constraint) {
//         case "association": {
//           const association = {
//             mappedTable: modelColumn.association.table || null,
//             mappedColumn: modelColumn.association.mappedColumn || null,
//           };

//           let foreignKeyIndex: number = 0;
//           let existingForeignKey = false;
//           let existingForeignKeyIndex: number = 0;

//           if (columnConstraints) {
//             for (const foreignKey of columnConstraints.f) {
//               const currentIndex = Number(
//                 foreignKey.conname.replace(/.*fkey(\d+)/g, "$1"),
//               );

//               if (!isNaN(currentIndex)) {
//                 foreignKeyIndex = Math.max(
//                   currentIndex + 1,
//                   foreignKeyIndex,
//                 );
//               }

//               if (
//                 foreignKey.condef.includes(`(${columnName})`) &&
//                 foreignKey.condef.includes(
//                   `${association.mappedTable}(${association.mappedColumn})`,
//                 )
//               ) {
//                 if (!existingForeignKey) {
//                   existingForeignKey = true;
//                   existingForeignKeyIndex = Number(
//                     foreignKey.conname.replace(/.*fkey(\d+)/g, "$1"),
//                   );
//                 }
//                 updateColumnsQuery +=
//                   `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${foreignKey.conname} CASCADE; `;
//               }
//             }
//           }

//           if (existingForeignKey) {
//             foreignKeyIndex = existingForeignKeyIndex;
//           }
//           updateColumnsQuery +=
//             `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_fkey${foreignKeyIndex} FOREIGN KEY (${columnName}) REFERENCES ${association.mappedTable}(${association.mappedColumn}); `;
//           break;
//         }
//         case "primaryKey": {
//           if (columnConstraints.p) {
//             updateColumnsQuery +=
//               `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${columnConstraints.p} CASCADE; `;
//           }
//           updateColumnsQuery +=
//             `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_pkey PRIMARY KEY (${columnName}); `; // !
//           break;
//         }
//         case "notNull": {
//           updateColumnsQuery +=
//             `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET NOT NULL; `;
//           break;
//         }
//         case "unique": {
//           updateColumnsQuery +=
//             `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${tableName}_${columnName}_unique; ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_unique UNIQUE(${columnName}); `;
//           break;
//         }
//         case "defaultVal": {
//           updateColumnsQuery +=
//             `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET DEFAULT '${modelColumn.defaultVal}'; `;
//           break;
//         }
//         // ! Work on these later
//         case "checks": {
//           break;
//         }
//         case "length": {
//           break;
//         }
//         default: {
//           break;
//         }
//       }
//     }
//   }
//   await DisconnectDb(db);

//   return updateColumnsQuery;
// };
