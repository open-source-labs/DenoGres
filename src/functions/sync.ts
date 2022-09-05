import { introspect } from "./introspect.ts";
import { ConnectDb, DisconnectDb } from "./Db.ts";
import { primaryKeyQuery, tableUniqueQuery } from "../queries/introspection.ts";
import { ModelColumn, ModelInfo, modelParser } from "./modelParser.ts";
import { enumSync } from "./enumSync.ts";
import { abortable } from "https://deno.land/std@0.141.0/async/abortable.ts";
import { CHAR_LINE_FEED } from "https://deno.land/std@0.141.0/path/_constants.ts";

// take the data from the model.ts file and reverse engineer it
// essentially make it look like the query results

interface IConQuery {
  conname: string;
  table_name: string;
}

interface IForeignKey {
  columns: string[];
  mappedColumns: string[];
  rel_type?: string;
  table: string;
}

const conQueryGuard = (record: object): record is IConQuery => {
  return "conname" in record && "table_name" in record;
};

const newColAttr = (column: ModelColumn): string => {
  let str = ``;

  // Make column type SERIAL if auto-increment is true
  if (column.autoIncrement) {
    str += ` SERIAL`;
  } else if (column.type === "enum") {
    str += ` ${column.enumName}`;
    if (column.notNull && !column.primaryKey) str += ` NOT NULL`;
  } else {
    // Otherwise use
    str += `${column.type}`;
    if (column.length) str += `(${column.length})`;
    // Not Null for non-serial columns
    if (column.notNull && !column.primaryKey) str += ` NOT NULL`;
  }
  if (column.primaryKey) str += ` PRIMARY KEY`;
  if (column.unique && !column.primaryKey && !column.autoIncrement) {
    str += ` UNIQUE`;
  }
  if (column.defaultVal) {
    let defaultValue;
    if (column.type === "timestamp" && typeof column.defaultVal === "string") {
      defaultValue = column.defaultVal.replaceAll(/\'|\"/g, "");
    } else {
      defaultValue = column.defaultVal;
    }
    str += ` DEFAULT ${defaultValue}`;
  }
  if (column.association) {
    str +=
      ` REFERENCES ${column.association.table}(${column.association.mappedCol})`;
  }

  if (column.checks) {
    column.checks.forEach((check) => {
      str += ` CHECK ${check}`;
    });
  }

  return str;
};

const createTable = (
  table_name: string,
  columns: Record<string, ModelColumn>,
  checks: string[] | undefined,
  unique: string[][] | undefined,
  primaryKey: string[] | undefined,
  foreignKey: IForeignKey[] | undefined,
): string => {
  let queryText = `CREATE TABLE ${table_name}(`;

  console.log("createTable checks", checks);
  console.log("createTable unique", unique);
  console.log("createTable primaryKey", primaryKey);
  console.log("createTable foreignKey", foreignKey);

  // Add columns to query
  for (const key in columns) {
    queryText += ` ${key} ${newColAttr(columns[key])},`;
  }

  // TABLE CHECKS
  if (checks) {
    checks.forEach((el) => {
      queryText += `CHECK ${el},`;
    });
  }

  // TABLE UNIQUE
  if (unique) {
    unique.forEach((el) => {
      queryText += `UNIQUE(${el}),`;
    });
  }

  // TABLE PRIMARY KEY
  if (primaryKey) {
    queryText += `PRIMARY KEY(${primaryKey}),`;
  }

  // COMPOSITE FOREIGN KEYS
  if (foreignKey) {
    foreignKey.forEach((el) => {
      queryText +=
        `FOREIGN KEY (${el.columns}) REFERENCES ${el.table} (${el.mappedColumns}),`;
    });
  }

  return queryText.slice(0, -1) + "); "; // remove the last comma
};

const alterTableError = (err: Error) => {
  console.error();
};

export const sync = async (overwrite = false) => {
  const [dbTables] = await introspect();

  const models = modelParser();

  let createTableQueries = ``;
  let alterTableQueries = ``;

  // ! Need to Come back to this later
  // await enumSync();

  // console.log("models\n", models);
  // // console.log("modelObject\n", dbTables);
  // console.log("dbTables\n", dbTables);

  // console.log("list of model checks\n", models.map((model) => model.checks));
  // console.log("list of model unique\n", models.map((model) => model.unique));
  // console.log(
  //   "list of model primaryKey\n",
  //   models.map((model) => model.primaryKey),
  // );
  // console.log(
  //   "list of model foreignKey\n",
  //   models.map((model) => model.foreignKey),
  // );

  // console.log(
  //   "dog species_id association\n",
  //   models[2].columns.species_id.association,
  // );

  /*
    OPTION 1: refactor model parser
      easier down the line
        compare modelObject.species vs. dbTables.species

    OPTION 2:
      harder time from interpretation...?

  */

  const db = await ConnectDb(); // db connection to send off alter and create queries

  // * Alter Table Columns
  for (const model of models) {
    // console.log("model\n", model);

    // SQL statements for dbTables not currently in the database
    // * Create Table
    if (!dbTables[String(model.table)]) {
      // New Table Added in Model by User
      createTableQueries += createTable(
        String(model.table),
        model.columns,
        model.checks,
        model.unique,
        model.primaryKey,
        model.foreignKey,
      );
    } else { // ! Commented Out Portion Start
      // * Table Columns
      const columnNames = Object.keys(model.columns);

      // * Column Values
      const table = dbTables[String(model.table)];

      // console.log("table\n", table);

      /*
        possible constraints

        type: keyof typeof sqlDataTypes
        primaryKey?: boolean,
        notNull?: boolean,
        unique?: boolean,
        checks?: string[],
        defaultVal?: unknown,
        autoIncrement?: boolean,
        length?: number,
        association?: { rel_type?: string, table: string, mappedCol: string}
      */

      let index = 0;

      for (const columnName of columnNames) {
        // * START OF ADD COLUMN QUERY
        if (!(columnName in table.columns)) {
          // ? changed the last variable below to ${model.columns[columnName].type}
          let addColumnQuery = `
            ALTER TABLE ${model.table} ADD COLUMN ${columnName} ${
            model.columns[columnName].type
          }
          `;

          // let addColumnQuery = "";

          const associations = [];

          for (const constraint in model.columns[columnName]) {
            switch (constraint) {
              case "association": {
                /*
                  `
                  ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_${columnName}_fkey FOREIGN KEY (${columnName}) REFERENCES ${columnValues.association?.table}(${columnValues.association?.mappedCol}); `;
                */
                associations.push({
                  columnName: columnName,
                  // table: model.columns[columnName].table,
                  // mappedCol: model.columns[columnName].mappedCol,
                  table: model.columns[columnName].association?.table,
                  mappedCol: model.columns[columnName].association?.mappedCol,
                });
                break;
              }
              case "primaryKey": {
                addColumnQuery += `PRIMARY KEY `;
                break;
              }
              case "notNull": {
                addColumnQuery += `NOT NULL `;
                break;
              }
              case "unique": {
                addColumnQuery += `UNIQUE `;
                break;
              }
              // ? isn't type already serial ???
              case "autoIncrement": {
                addColumnQuery += `SERIAL `;
                break;
              }
              case "defaultVal": {
                addColumnQuery +=
                  `DEFAULT ${model.columns.columnName.defaultVal} `;
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

          addColumnQuery += `;`;
          // ? query looks bit cleaner with code below but isn't necessary
          // addColumnQuery = addColumnQuery.slice(0, addColumnQuery.length - 1) + `;`;

          let associationIndex = 0;
          for (const association of associations) {
            const { columnName, table, mappedCol } = association;

            // console.log('association')

            // let addAssociationQuery = `
            //   ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_fk FOREIGN KEY ("${columnName}") REFERENCES '${table}(${mappedCol}); '
            // `;
            // console.log(
            //   "This is the foreign key query \n",
            //   addAssociationQuery,
            // );
            /*
              ALTER TABLE dog ADD CONSTRAINT dog_fk FOREIGN KEY ("dog_id") REFERENCES ('species(id)')
            */

            // ? removed single quotes surroundign ${table}(${mappedCol})
            addColumnQuery += `
              ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_fk${associationIndex++} FOREIGN KEY ("${columnName}") REFERENCES ${table}(${mappedCol});
            `;
            // ? associationIndex++;
          }

          console.log(addColumnQuery);

          // ? had to invoke addColumnQuery immediately in cases where alterTablesQueries wasn't invoked (when you only add a column to a table but leave the rest of the model schema untouched)
          await db.queryObject(addColumnQuery);
        }
        // models column object
        const columnValues = model.columns[columnName];
        // New Column added in Model by User
        // * New columnValue entry
        if (!dbTables[model.table].columns[columnName]) {
          alterTableQueries += `ALTER TABLE ${model.table} ADD ${columnName} `;

          alterTableQueries += newColAttr(columnValues) + ";";
        } else {
          // * Check column constraints for updates
          const dbColumnValues = dbTables[model.table].columns[columnName];
          // NOT NULL updated

          // * Check notNull
          if (Boolean(columnValues.notNull) !== dbColumnValues.notNull) { //TESTED
            alterTableQueries +=
              `ALTER TABLE ${model.table} ALTER COLUMN ${columnName} `;
            alterTableQueries += columnValues.notNull ? `SET ` : `DROP `;
            alterTableQueries += `NOT NULL; `;
          }
          // UNIQUE updated
          // * Check unique
          if (Boolean(columnValues.unique) !== Boolean(dbColumnValues.unique)) { //TESTED
            alterTableQueries += `ALTER TABLE ${model.table} `;
            alterTableQueries += columnValues.unique
              ? `ADD UNIQUE (${columnName});`
              : !overwrite
              ? `DROP CONSTRAINT ${model.table}_${columnName}_key;`
              : `DROP CONSTRAINT ${model.table}_${columnName}_key CASCADE;`;
          }
          // DEFAULT updated
          // * Check defaultVal
          if (
            (columnValues.defaultVal === undefined
                ? null
                : columnValues.defaultVal) !==
              dbColumnValues.defaultVal &&
            (columnValues.defaultVal !== undefined &&
              dbColumnValues !== undefined)
          ) { // TESTED
            let defaultValue;
            if (
              columnValues.type === "timestamp" &&
              typeof columnValues.defaultVal === "string"
            ) {
              defaultValue = columnValues.defaultVal.replaceAll(/\'|\"/g, "");
            } else {
              defaultValue = columnValues.defaultVal;
            }
            alterTableQueries +=
              `ALTER TABLE ${model.table} ALTER COLUMN ${columnName} `;
            alterTableQueries += columnValues.defaultVal === null ||
                columnValues.defaultVal === ""
              ? `DROP DEFAULT; `
              : `SET DEFAULT ${defaultValue}; `;
          }
          // PRIMARY KEY updated
          // * Check primary key
          if (columnValues.primaryKey !== dbColumnValues.primaryKey) {
            // QUERY TO UPDATE PRIMARY KEY - CHECK ON ISSUES WITH PRIMARY KEY ALREADY EXISISTING AND NEEDING
            // TO OVERWRITE

            // Check if table has existing primary key
            const pKeys = await db.queryObject(
              primaryKeyQuery + `'${model.table}';`,
            );
            const existingPK = pKeys.rows;

            if (!columnValues.primaryKey) {
              // remove exisisting primaryKey
              if (overwrite) {
                // overwrite is true so can be deleted
                if (
                  typeof existingPK[0] === "object" && existingPK[0] !== null &&
                  conQueryGuard(existingPK[0])
                ) {
                  alterTableQueries +=
                    `ALTER TABLE ${model.table} DROP CONSTRAINT ${
                      existingPK[0].conname
                    }; `;
                }
              } else {
                console.log(
                  `Cannot remove column primary key from ${model.table} table without -x passed to --db-sync.`,
                );
              }
            } else {
              if (
                existingPK.length > 0 && !overwrite && columnValues.primaryKey
              ) { // TESTED
                // add primary key but there is exisisting primary key and overwrite is false
                console.log(
                  `Cannot overwrite existing primary key information to the ${model.table} table. If you wish to proceed with these` +
                    ` updates, please re-run --db-sync with the argument -x`,
                );
              } else if (existingPK.length > 0 && overwrite) { // TESTED
                // add primary key with exisisting primary key and overwrite is set to true
                if (
                  typeof existingPK[0] === "object" && existingPK[0] !== null &&
                  conQueryGuard(existingPK[0])
                ) {
                  alterTableQueries +=
                    `ALTER TABLE ${model.table} DROP CONSTRAINT ${
                      existingPK[0].conname
                    }; ` +
                    // ? `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_pkey PRIMARY KEY (${columnName});`;
                    `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_pk PRIMARY KEY (${columnName});`;
                }
              } else {
                // No prior primary key just add the update
                alterTableQueries +=
                  // ? `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_pkey PRIMARY KEY (${columnName});`;
                  `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_pk PRIMARY KEY (${columnName});`;
              }
            }
          }
          // FOREIGN KEY updated
          // * check foreign key
          // TODO
          if (
            JSON.stringify(columnValues.association) !==
              JSON.stringify(dbColumnValues.association)
          ) {
            // QUERY TO UPDATE FOREIGN KEY - CHECK ON ISSUES WITH FOREIGN KEY ALREADY EXISTS AND NEEDING
            // TO OVERWRITE

            // console.log('entered JSON STRINGIFY');

            // console.log('model.table', model.table);

            console.log("columnValues Association", columnValues.association);

            // console.log(`dbColumnValuesAssociation ${dbColumnValues.association}`);
            console.log(
              "dbColumnValuesAssociation",
              dbColumnValues.association,
            );
            // console.log(dbColumnValues.association);

            if (!overwrite && columnValues.association === undefined) {
              // remove exisisting foreign key, overwrite false - inform user update cannot be made
              console.log(
                `Cannot delete foreign key from column ${columnName} on ${model.table}. Please re-run command with -x flag.`,
              );
            } else if (overwrite && columnValues.association === undefined) {
              // remove exisisting foreign key, overwrite true
              // ? alterTableQueries +=
              // ?  `ALTER TABLE ${model.table} DROP CONSTRAINT ${model.table}_${columnName}_fkey; `;

              // TODO
              alterTableQueries +=
                `ALTER TABLE ${model.table} DROP CONSTRAINT ${model.table}_fk${index}; `;

              // ${model.table}_fk${index++}
            } else if (dbColumnValues.association === undefined) {
              // add new foreign key to column

              // TODO
              alterTableQueries +=
                `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_${columnName}_fkey FOREIGN KEY (${columnName}) REFERENCES ${columnValues.association?.table}(${columnValues.association?.mappedCol}); `;
            } else if (!overwrite) {
              // update exisisting foreign key overwrite false - inform user update cannot be made
              console.log(
                `Cannot update foreign key on column ${columnName} on ${model.table} table. Please re-run command with -x flag.`,
              );
            } else {
              // alterTableQueries +=
              //   `ALTER TABLE ${model.table} DROP CONSTRAINT ${model.table}_${columnName}_fkey; ` +
              //   `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_${columnName}_fkey FOREIGN KEY (${columnName}) REFERENCES ${columnValues.association?.table}(${columnValues.association?.mappedCol}); `;
              // ?
              alterTableQueries +=
                `ALTER TABLE ${model.table} DROP CONSTRAINT ${model.table}_${columnName}_fkey; ` +
                `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_${columnName}_fkey FOREIGN KEY (${columnName}) REFERENCES ${columnValues.association?.table}(${columnValues.association?.mappedCol}); `;
            }
          }

          if (alterTableQueries !== ``) {
            // ? need addColumnQuery to run separately with alterTableQueries because users can add a new column without making any changes to any other column in all the tables (in which case, alterTableQueries won't fire)
            console.log("alterTableQueries:", alterTableQueries);

            await db.queryObject(alterTableQueries);
            alterTableQueries = ``;
          }
        }
      }
      // UNIQUE
      // TODO (NOT FUNCTIONAL ATM) check the list of uniqueValues inside the model/table
      if (String(table.unique) !== String(model.unique)) { //TESTED
        const toAdd: string[] = [];
        const toRemove: string[] = [];

        if (!table.unique) {
          // add unique table constraints to db where there previously weren't any
          alterTableQueries +=
            `ALTER TABLE ${model.table} ADD UNIQUE (${model.unique});`;
        } else if (!model.unique && !overwrite) {
          // remove all exisisting db unique table constraints - notify user -x needs to be set
          console.log(
            `Cannot delete exisisting UNIQUE table constraints for ${model.table}. Please re-run --db-sync with -x flag.`,
          );
        } else if (!model.unique && overwrite) {
          // remove all exisisting db unique table constraints
          const results = await db.queryObject(tableUniqueQuery);

          // console.log(results);
          const dbUniqueConst = results.rows;

          dbUniqueConst.forEach((uniqueTables) => {
            if (
              typeof uniqueTables === "object" && uniqueTables !== null &&
              conQueryGuard(uniqueTables)
            ) {
              alterTableQueries +=
                `ALTER TABLE ${uniqueTables.table_name} DROP CONSTRAINT ${uniqueTables.conname} CASCADE`;
            }
          });
        } else if (model.unique) {
          const dbUniqueValues = table.unique.map((uniqueValue) =>
            String(uniqueValue)
          );
          const modelUniqueValues = model.unique.map((uniqueValue) =>
            String(uniqueValue)
          );

          modelUniqueValues.forEach((uniqueValue) => {
            if (!dbUniqueValues.includes(uniqueValue)) toAdd.push(uniqueValue);
          });

          if (toAdd.length) {
            toAdd.forEach((uniqueValue) => {
              alterTableQueries += `ALTER TABLE ${model.table} ADD UNIQUE (${
                uniqueValue.replace("[", "(").replace("]", ")")
              }); `;
            });
          }

          if (!overwrite) {
            console.log(
              "Cannot delete existing UNIQUE table constraints. Please re-run --db-sync with -x flag.",
            );
          } else {
            // REMOVE UNIQUES FROM DB
            // dbUniqueValues.forEach(element => {
            //     if(!modelUniqueValues.includes(element)) toRemove.push(element);
            // })

            // if(toRemove.length){
            //     toRemove.forEach(async element => {
            //         const results = await db.queryObject(tableUniqueQuery + ` AND pg_get_constraintdef(pg_constraint.oid) LIKE %(${element})%`);
            //         console.log(results.rows)
            //         //alterTableQueries += `ALTER TABLE ${model.table} DROP CONSTRAINT ${} CASCADE; `;
            //     })
            // }
          }
        }
      }

      // TODO PRIMARY KEY LIST: NOT FUNCTIONAL ATM
      if (String(table.primaryKey) !== String(model.primaryKey)) {
        // Check if table has existing primary key (required b/c columnName level primary key)
        const pKeys = await db.queryObject(
          primaryKeyQuery + `'${model.table}';`,
        );
        const existingPK = pKeys.rows;

        if (existingPK[0] && !overwrite) {
          // primary key exisits but user hasn't provided overwrite permissions
          console.log(
            `Table ${model.table} currently has primary key constraint. To overwrite existing value please re-run --db-sync with the -x flag.`,
          );
        } else if (existingPK[0] && overwrite) {
          if (
            typeof existingPK[0] === "object" && existingPK[0] !== null &&
            conQueryGuard(existingPK[0])
          ) {
            alterTableQueries +=
              `ALTER TABLE ${model.table} DROP CONSTRAINT ${
                existingPK[0].conname
              }; ` +
              `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_pkey PRIMARY KEY (${model.primaryKey});`;
          }
        } else {
          // No prior primary key just add the update
          alterTableQueries +=
            `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_pkey PRIMARY KEY (${model.primaryKey});`;
        }
      }
    }
    // ! Commented Out Section End

    // ! end of giant for loop
  }

  await db.queryObject(createTableQueries);
  DisconnectDb(db);
};
