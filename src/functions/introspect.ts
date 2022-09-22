import { ConnectDb, DisconnectDb } from "./Db.ts";
import { columnInfoQuery, enumQuery } from "../queries/introspection.ts";
import { sqlDataTypes } from "../constants/sqlDataTypes.ts";
import { join } from "https://deno.land/std@0.141.0/path/win32.ts";

// INTERFACES
interface ITableQueryRecords {
  table_name: string;
}

interface IColumnQueryRecords {
  schemaname: string;
  table_name: string;
  column_name: string;
  column_type: keyof typeof sqlDataTypes;
  col_default: unknown;
  not_null: boolean;
  enum_value: string;
  character_maximum_length: number;
}

interface IConstraint {
  schemaname: string;
  table_name: string;
  condef: string;
  contype: string;
  conname: string;
}

// ! Previous Code
// const indexNames = Object.keys(sqlDataTypes)

// interface ITableListObj {
//   [key: string]: {
//     columns: {
//       [key: string]: {
//         type: keyof typeof sqlDataTypes;
//         primaryKey?: boolean;
//         notNull?: boolean;
//         unique?: boolean;
//         checks?: any; // used to be string[]
//         defaultVal?: unknown;
//         autoIncrement?: boolean;
//         length?: number;
//         association?: { rel_type?: string; table: string; mappedCol: string };
//       };
//     };
//     checks: string[];
//     unique?: Array<string[]>;
//     primaryKey?: string[];
//     foreignKey?: {
//       columns: string[];
//       mappedColumns: string[];
//       rel_type?: string;
//       table: string;
//     }[];
//   };
// }

type ITableListObj = any;

interface IEnumObj {
  [key: string]: string[];
}

interface IEnumEl {
  enum_schema: string;
  enum_name: string;
  enum_value: string;
}

// TYPE GUARD FUNCTIONS
const recordObjectType = (record: object): record is ITableQueryRecords => {
  return "table_name" in record;
};

const colRecordObjectType = (record: object): record is IColumnQueryRecords => {
  return "schemaname" in record && "table_name" in record &&
    "column_name" in record &&
    "column_type" in record && "col_default" in record && "not_null" in record;
};

const constraintObjectType = (record: object): record is IConstraint => {
  return "schemaname" in record && "table_name" in record && "condef" in record;
};

const enumElType = (record: object): record is IEnumEl => {
  return "enum_name" in record && "enum_name" in record &&
    "enum_value" in record;
};

const tableConstQuery = `SELECT tables.schemaname, class.relname AS table_name,
pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
FROM pg_class class
INNER JOIN pg_tables tables on class.relname = tables.tablename
INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid;`;

const tableListQuery = `SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
AND table_type='BASE TABLE';`;

// * Grabs all the data needed to perform the INTROSPECT function
export const getDbData = async (uri?: string) => {
  const db = await ConnectDb(uri);

  const tableList = await db.queryObject(tableListQuery);
  const columnList = await db.queryObject(columnInfoQuery);
  const constraintList = await db.queryObject(tableConstQuery);
  const enumList = await db.queryObject(enumQuery);

  DisconnectDb(db);

  return {
    tableList: tableList.rows,
    columnList: columnList.rows,
    constraintList: constraintList.rows,
    enumList: enumList.rows,
  };
};
// Add enums to tablelist obj, OR Create a new seperate object for all the enums that THAT database has in it.
// When you hit an enum that youre building out in dbpull, you can just query off of that object
export const introspect = async (
  uri?: string,
): Promise<[ITableListObj, IEnumObj]> => {
  const { tableList, columnList, constraintList, enumList } = await getDbData(
    uri,
  );
  // convert table list to an object
  const tableListObj: any = {};

  // Create object to store enums
  const enumObj: IEnumObj = {};

  // Add each table to the tableListObj for easier access
  tableList.forEach((el) => {
    if (typeof el === "object" && el !== null && "table_name" in el) {
      if (recordObjectType(el)) {
        tableListObj[String(el.table_name)] = {};
      }
    }
  });

  // * loop through the columns to make columns and their respective properties into tables
  columnList.forEach((el) => {
    if (typeof el === "object" && el !== null && colRecordObjectType(el)) {
      // * ENUM
      if (String(el.column_type).includes("enum")) {
        tableListObj[el.table_name][el.column_name] = {
          type: "enum",
          enumName: String(el.column_type).slice(6),
        };
      } else {
        tableListObj[el.table_name][el.column_name] = {
          type: el.column_type,
        };
      }
      const refObj = tableListObj[el.table_name][el.column_name];

      // * NOT NULL
      if (!String(el.column_type).includes("enum")) {
        refObj["notNull"] = el.not_null;
      }

      // ! didn't get to look over the length property
      if (el.character_maximum_length) {
        refObj["length"] = el.character_maximum_length;
      }

      // * AUTOINCREMENT
      if (/nextval\('\w+_seq'::regclass/.test(String(el.col_default))) {
        refObj["autoIncrement"] = true;
      } else {
        // * DEFAULT
        if (typeof el.col_default === "string") {
          // ! used to be typed unknown
          let defaultVal: any = el.col_default.replace(/\:\:[\w\W]*/, "");

          // ! not entirely sure what this is for
          if (String(defaultVal).slice(-2) === "()") {
            defaultVal = "'" + defaultVal + "'";
          }

          // * Might have to change this to...
          // refObj["defaultVal"] = JSON.parse(JSON.stringify(defaultVal));

          refObj["defaultVal"] = JSON.parse(JSON.stringify(defaultVal));
        }
      }
    }
  });

  // * loop through each enum type in the schema
  enumList.forEach((el) => {
    // * key: ENUM name value: list of all the enumerations (categories of the enum type)
    if (typeof el === "object" && el !== null && enumElType(el)) {
      const enumVals = el.enum_value.split(/ *, */);
      enumObj[el.enum_name] = enumVals;
    }
  });

  // PRIMARY & UNIQUE & CHECK CONSTRAINTS
  // * loop through all of the constraints
  constraintList.forEach((el) => {
    if (typeof el === "object" && el !== null && constraintObjectType(el)) {
      // * primary key
      if (el.contype === "p") {
        const key = el.condef.replaceAll("PRIMARY KEY (", "").replaceAll(
          ")",
          "",
        );
        if (key.includes(",")) {
          tableListObj[el.table_name].primaryKey = key.replaceAll(" ", "")
            .split(",");
        } else {
          tableListObj[el.table_name][key]["primaryKey"] = true;
        }
        // * unique
      } else if (el.contype === "u") {
        const key = el.condef.replaceAll("UNIQUE (", "").replaceAll(")", "");
        // Check if it's composite
        if (key.includes(",")) {
          if (!tableListObj[el.table_name].unique) {
            tableListObj[el.table_name].unique = [];
            tableListObj[el.table_name].unique?.push(
              key.replaceAll(" ", "").split(","),
            );
          } else {
            tableListObj[el.table_name].unique?.push(
              key.replaceAll(" ", "").split(","),
            );
          }
        } else {
          tableListObj[el.table_name][key]["unique"] = true;
        }
        // * checks
      } else if (el.contype === "c") {
        // * condef: Constraint Definition
        let parsedCondef: any = el.condef.slice(6).replace(/[\(\)]/g, "");
        parsedCondef = parsedCondef.replace(/\:\:\w+\s?\w+(\[\])?/g, "");
        parsedCondef = parsedCondef.split(" AND ");

        const val = [];

        for (let i = 0; i < parsedCondef.length; i++) {
          const arrayRegex = /\[(.*)\]/;
          // * if a check has list of categories listed (i.e. gender in ('F', 'M'))
          if (arrayRegex.test(parsedCondef[i])) {
            const parsedCondef1 = parsedCondef[i].replace(/(.*\s\=\s).*/, "$1");
            const parsedCondef2 = parsedCondef[i].match(arrayRegex)[0];
            parsedCondef[i] = parsedCondef1 + parsedCondef2;
          }
          val.push(parsedCondef[i]);
        }

        const columnName = val[0].match(/\w+/g)[0];

        if (
          tableListObj[el.table_name][columnName].checks === undefined
        ) {
          tableListObj[el.table_name][columnName].checks = {};
        }

        tableListObj[el.table_name][columnName].checks[el.conname] = val;
        // * foreign keys
      } else if (el.contype === "f") {
        let condef = el.condef;
        let conname = el.conname;

        if (condef.includes(",")) {
          const condefArray = condef.replace(/FOREIGN KEY */, "").split(
            "REFERENCES ",
          );
          const fkColumns = condefArray[0].replaceAll(/\(|\)/g, "")
            .replaceAll(/(?<=\"|\,|\') +/g, "").replaceAll(/ +/g, "")
            .replaceAll(/ $/g, "").split(",");

          const tableName = condefArray[1].split(/ *\(/)[0];

          const mappedCol = condefArray[1].replaceAll(/[\W\w]+\(|\)/g, "")
            .replaceAll(/(?<=\"|\,|\') +/g, "").replaceAll(/ +/g, "")
            .replaceAll(/ $/g, "").split(",");

          const fKObj = {
            columns: fkColumns,
            mappedColumns: mappedCol,
            table: tableName,
          };

          // ! Previous Code
          // if (!tableListObj[el.table_name].foreignKey) {
          //   tableListObj[el.table_name].foreignKey = [];
          //   tableListObj[el.table_name].foreignKey?.push(fKObj);
          // } else {
          //   tableListObj[el.table_name].foreignKey?.push(fKObj);
          // }
        } else {
          condef = condef.replace("FOREIGN KEY (", "").replace(
            ") REFERENCES",
            "",
          );
          const condefArray = condef.split(" "); // 0: table column // 1: foreign table and its id

          const columnObj: any = tableListObj[el.table_name][condefArray[0]];
          columnObj.association = {
            name: conname,
            mappedTable: condefArray[1].split("(")[0],
            mappedColumn: condefArray[1].replace(/\w+\(/, "").replace(")", ""),
          };
        }
      }
    }
  });

  return [tableListObj, enumObj];
};
