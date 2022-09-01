import { introspect } from "./introspect.ts";
import { ConnectDb, DisconnectDb } from "./Db.ts";
import { primaryKeyQuery, tableUniqueQuery } from "../queries/introspection.ts";
import { ModelColumn, ModelInfo, modelParser } from "./modelParser.ts";
import { enumSync } from "./enumSync.ts";

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

const newColAttr = (columnName: ModelColumn): string => {
  let str = ``;

  // Make columnName type SERIAL if auto-increment is true
  if (columnName.autoIncrement) {
    str += ` SERIAL`;
  } else if (columnName.type === "enum") {
    str += ` ${columnName.enumName}`;
    if (columnName.notNull && !columnName.primaryKey) str += ` NOT NULL`;
  } else {
    // Otherwise use
    str += `${columnName.type}`;
    if (columnName.length) str += `(${columnName.length})`;
    // Not Null for non-serial columns
    if (columnName.notNull && !columnName.primaryKey) str += ` NOT NULL`;
  }
  if (columnName.primaryKey) str += ` PRIMARY KEY`;
  if (
    columnName.unique && !columnName.primaryKey && !columnName.autoIncrement
  ) {
    str += ` UNIQUE`;
  }
  if (columnName.defaultVal) {
    let defaultValue;
    if (
      columnName.type === "timestamp" &&
      typeof columnName.defaultVal === "string"
    ) {
      defaultValue = columnName.defaultVal.replaceAll(/\'|\"/g, "");
    } else {
      defaultValue = columnName.defaultVal;
    }
    str += ` DEFAULT ${defaultValue}`;
  }
  if (columnName.association) {
    str +=
      ` REFERENCES ${columnName.association.table}(${columnName.association.mappedCol})`;
  }

  if (columnName.checks) {
    columnName.checks.forEach((check) => {
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
  const [tables] = await introspect();

  const models = modelParser();

  let createTableQueries = ``;
  let alterTableQueries = ``;

  // ! Need to Come back to this later
  // await enumSync();

  console.log("models\n", models);
  // console.log("modelObject\n", tables);
  console.log("tables\n", tables);

  /*
    OPTION 1: refactor model parser
      easier down the line
        compare modelObject.species vs. tables.species

    OPTION 2:
      harder time from interpretation...?

  */

  const db = await ConnectDb(); // db connection to send off alter and create queries

  for (const model of models) {
    /* e.g. model
      {
        table: "species",
        columns: {
          language: { type: "varchar" },
          eye_colors: { type: "varchar" },
          skin_colors: { type: "varchar" },
          hair_colors: { type: "varchar" },
          average_lifespan: { type: "varchar" },
          average_height: { type: "varchar" },
          classification: { type: "varchar" },
          name: { type: "varchar", notNull: true },
          _id: { type: "int4", notNull: true, primaryKey: true, autoIncrement: true },
          homeworld_id: { type: "int8" }
        }
      }
    */

    // SQL statements for tables not currently in the database
    if (!tables[String(model.table)]) {
      // New Table Added in Model by User
      createTableQueries += createTable(
        String(model.table),
        model.columns,
        model.checks,
        model.unique,
        model.primaryKey,
        model.foreignKey,
      );
    } else { // ! Commented Out Section Start
      const table = tables[String(model.table)];
      /* e.g. table
        {
          columns: {
            language: { type: "varchar", notNull: false },
            eye_colors: { type: "varchar", notNull: false },
            skin_colors: { type: "varchar", notNull: false },
            hair_colors: { type: "varchar", notNull: false },
            average_lifespan: { type: "varchar", notNull: false },
            average_height: { type: "varchar", notNull: false },
            classification: { type: "varchar", notNull: false },
            name: { type: "varchar", notNull: true },
            _id: { type: "int4", notNull: true, autoIncrement: true, primaryKey: true },
            homeworld_id: { type: "int8", notNull: false }
          },
          checks: []
        }
      */

      for (const columnName of Object.keys(model.columns)) {
        /* e.g. model.columns
          {
            language: { type: "varchar" },
            eye_colors: { type: "varchar" },
            skin_colors: { type: "varchar" },
            hair_colors: { type: "varchar" },
            average_lifespan: { type: "varchar" },
            average_height: { type: "varchar" },
            classification: { type: "varchar" },
            name: { type: "varchar", notNull: true },
            _id: { type: "int4", notNull: true, primaryKey: true, autoIncrement: true },
            homeworld_id: { type: "int8" }
          }
        */

        /*
          e.g. columnName
          'language'
        */

        // models columnName object
        const columnValues = model.columns[columnName];

        /*
          e.g. columnValues (from columnName: 'language')
          { type: "varchar" }
        */

        // New Column added in Model by User
        // ? Refactor ??? if !tables[model]
        // ? Refactor ??? if (! model[key] in tables)
        if (!tables[model.table].columns[columnName]) {
          alterTableQueries += `ALTER TABLE ${model.table} ADD ${columnName} `;

          alterTableQueries += newColAttr(columnValues) + ";";
        } else {
          // Check columnName constraints for updates
          const dbColumns = tables[model.table].columns[columnName];
          // NOT NULL updated

          if (Boolean(columnValues.notNull) !== dbColumns.notNull) { //TESTED
            alterTableQueries +=
              `ALTER TABLE ${model.table} ALTER COLUMN ${columnName} `;
            alterTableQueries += columnValues.notNull ? `SET ` : `DROP `;
            alterTableQueries += `NOT NULL; `;
          }
          // UNIQUE updated
          if (Boolean(columnValues.unique) !== Boolean(dbColumns.unique)) { //TESTED
            alterTableQueries += `ALTER TABLE ${model.table} `;
            alterTableQueries += columnValues.unique
              ? `ADD UNIQUE (${columnName});`
              : !overwrite
              ? `DROP CONSTRAINT ${model.table}_${columnName}_key;`
              : `DROP CONSTRAINT ${model.table}_${columnName}_key CASCADE;`;
          }
          // DEFAULT updated
          if (
            (columnValues.defaultVal === undefined
                ? null
                : columnValues.defaultVal) !==
              dbColumns.defaultVal &&
            (columnValues.defaultVal !== undefined && dbColumns !== undefined)
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
          if (columnValues.primaryKey !== dbColumns.primaryKey) {
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
                  `Cannot remove columnName primary key from ${model.table} table without -x passed to --db-sync.`,
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
                    `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_pkey PRIMARY KEY (${columnName});`;
                }
              } else {
                // No prior primary key just add the update
                alterTableQueries +=
                  `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_pkey PRIMARY KEY (${columnName});`;
              }
            }
          }
          // FOREIGN KEY updated
          if (
            JSON.stringify(columnValues.association) !==
              JSON.stringify(dbColumns.association)
          ) {
            // QUERY TO UPDATE FOREIGN KEY - CHECK ON ISSUES WITH FOREIGN KEY ALREADY EXISTS AND NEEDING
            // TO OVERWRITE

            if (!overwrite && columnValues.association === undefined) {
              // remove exisisting foreign key, overwrite false - inform user update cannot be made
              console.log(
                `Cannot delete foreign key from columnName ${columnName} on ${model.table}. Please re-run command with -x flag.`,
              );
            } else if (overwrite && columnValues.association === undefined) {
              // remove exisisting foreign key, overwrite true
              alterTableQueries +=
                `ALTER TABLE ${model.table} DROP CONSTRAINT ${model.table}_${columnName}_fkey; `;
            } else if (dbColumns.association === undefined) {
              // add new foreign key to columnName
              alterTableQueries +=
                `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_${columnName}_fkey FOREIGN KEY (${columnName}) REFERENCES ${columnValues.association?.table}(${columnValues.association?.mappedCol}); `;
            } else if (!overwrite) {
              // update exisisting foreign key overwrite false - inform user update cannot be made
              console.log(
                `Cannot update foreign key on columnName ${columnName} on ${model.table} table. Please re-run command with -x flag.`,
              );
            } else {
              alterTableQueries +=
                `ALTER TABLE ${model.table} DROP CONSTRAINT ${model.table}_${columnName}_fkey; ` +
                `ALTER TABLE ${model.table} ADD CONSTRAINT ${model.table}_${columnName}_fkey FOREIGN KEY (${columnName}) REFERENCES ${columnValues.association?.table}(${columnValues.association?.mappedCol}); `;
            }
          }

          if (alterTableQueries !== ``) {
            //await db.queryObject(alterTableQueries);
            alterTableQueries = ``;
          }
        }
      }
      // UNIQUE
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
          const dbUniqueConst = results.rows;

          dbUniqueConst.forEach((uTables) => {
            if (
              typeof uTables === "object" && uTables !== null &&
              conQueryGuard(uTables)
            ) {
              alterTableQueries +=
                `ALTER TABLE ${uTables.table_name} DROP CONSTRAINT ${uTables.conname} CASCADE`;
            }
          });
        } else if (model.unique) {
          const dbUniques = table.unique.map((unique) => String(unique));
          const modelUniques = model.unique.map((unique) => String(unique));

          modelUniques.forEach((unique) => {
            if (!dbUniques.includes(unique)) toAdd.push(unique);
          });

          if (toAdd.length) {
            toAdd.forEach((element) => {
              alterTableQueries += `ALTER TABLE ${model.table} ADD UNIQUE (${
                element.replace("[", "(").replace("]", ")")
              }); `;
            });
          }

          if (!overwrite) {
            console.log(
              "Cannot delete existing UNIQUE table constraints. Please re-run --db-sync with -x flag.",
            );
          } else {
            // REMOVE UNIQUES FROM DB
            // dbUniques.forEach(element => {
            //     if(!modelUniques.includes(element)) toRemove.push(element);
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

      // PRIMARY KEY
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
