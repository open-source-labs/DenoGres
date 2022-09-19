import { ConnectDb, DisconnectDb } from "./Db.ts";
import {
  columnInfoQuery,
  enumQuery,
  tableConstQuery,
  tableListQuery,
} from "../queries/introspection.ts";
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

const tableConstQuery2 = `SELECT tables.schemaname, class.relname AS table_name,
pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
FROM pg_class class
INNER JOIN pg_tables tables on class.relname = tables.tablename
INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid;`;

const tableListQuery2 = `SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
AND table_type='BASE TABLE';`;

// Introspection Function
// ? const getDbData = async () => {
export const getDbData = async (uri?: string) => {
  const db = await ConnectDb(uri);

  const tableList = await db.queryObject(tableListQuery2);
  const columnList = await db.queryObject(columnInfoQuery);
  const constraintList = await db.queryObject(tableConstQuery2);
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
export const introspect2 = async (
  uri?: string,
): Promise<[ITableListObj, IEnumObj]> => {
  const { tableList, columnList, constraintList, enumList } = await getDbData(
    uri,
  );
  // convert table list to an object
  const tableListObj: any = {};

  // Create object to store enums
  const enumObj: IEnumObj = {};

  // console.log(constraintList);

  // Add each table to the tableListObj for easier access
  tableList.forEach((el) => {
    if (typeof el === "object" && el !== null && "table_name" in el) {
      if (recordObjectType(el)) {
        tableListObj[String(el.table_name)] = {};
      }
    }
  });

  columnList.forEach((el) => {
    if (typeof el === "object" && el !== null && colRecordObjectType(el)) {
      // tableListObj[el.table_name][el.column_name] = {
      //   type: el.column_type,
      // };

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
      // refObj["notNull"] = el.not_null;

      // console.log(!String(el.column_type).includes("enum"));

      if (!String(el.column_type).includes("enum")) {
        refObj["notNull"] = el.not_null;
        // console.log(refObj);
      }

      if (el.character_maximum_length) {
        refObj["length"] = el.character_maximum_length;
      }

      if (/nextval\('\w+_seq'::regclass/.test(String(el.col_default))) {
        refObj["autoIncrement"] = true;
      } else {
        if (typeof el.col_default === "string") {
          // let defaultVal: unknown = el.col_default.replace(/\:\:[\w\W]*/, "");

          // console.log('el.colDe', el.col_default);
          let defaultVal: any = el.col_default.replace(/\:\:[\w\W]*/, "");

          // console.log('checking DVAL', defaultVal);
          // console.log('checking DVAL type', typeof defaultVal);

          // console.log();

          // if (defaultVal === "'false'") defaultVal = false;
          // if (defaultVal === "'true'") defaultVal = true;
          if (String(defaultVal).slice(-2) === "()") {
            // console.log('triggered');
            defaultVal = "'" + defaultVal + "'";
          }
          refObj["defaultVal"] = JSON.parse(defaultVal);
        }
      }
    }
  });

  enumList.forEach((el) => {
    if (typeof el === "object" && el !== null && enumElType(el)) {
      const enumVals = el.enum_value.split(/ *, */);
      enumObj[el.enum_name] = enumVals;
    }
  });

  // PRIMARY & UNIQUE & CHECK CONSTRAINTS
  constraintList.forEach((el) => {
    if (typeof el === "object" && el !== null && constraintObjectType(el)) {
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
      } else if (el.contype === "c") {
        // const val = el.condef.replaceAll("CHECK (", "").replace(")", "");

        // console.log(val);
        // console.log(el);

        // console.log("el", el);

        // console.log(el.condef.replace(/CHECK \(\((.*)\)\)/, "$1"));

        // let parsedCondef = el.condef.replace(/CHECK \((.*)\)/, "$1");
        let parsedCondef: any = el.condef.slice(6).replace(/[\(\)]/g, "");
        parsedCondef = parsedCondef.replace(/\:\:\w+\s?\w+(\[\])?/g, "");
        parsedCondef = parsedCondef.split(" AND ");
        // parsedCondef = parsedCondef.match(/\w+ [\<\>]?[\=] /g)

        const val = [];

        for (let i = 0; i < parsedCondef.length; i++) {
          const arrayRegex = /\[(.*)\]/;
          if (arrayRegex.test(parsedCondef[i])) {
            const parsedCondef1 = parsedCondef[i].replace(/(.*\s\=\s).*/, "$1");
            // const parsedCondef2 = JSON.parse(parsedCondef[i].match(arrayRegex)[0].replaceAll('\'', '\"').replaceAll(' ', ''));
            const parsedCondef2 = parsedCondef[i].match(arrayRegex)[0];
            parsedCondef[i] = parsedCondef1 + parsedCondef2;
          }
          val.push(parsedCondef[i]);
        }

        // console.log('parsedCondef:', parsedCondef);

        // console.log(parsedCondef.replace(/\:\:\w+\s?\w+(\[\])?/g, ''));

        // console.log(parsedCondef.replace(/\s/g, '\n'));

        // console.log(el.condef.match(/\((\w+)\)/g));

        // const definitionStart = el.condef.indexOf("(");
        // const definitionEnd = el.condef.lastIndexOf(")");

        // const val: any = el.condef.slice(definitionStart + 1, definitionEnd);

        const columnName = val[0].match(/\w+/g)[0];

        // const columnName = val.slice(1, val.indexOf(" "));

        // const columnName = el.condef.replace(/CHECK.*(\w+).*/, '$1');
        // console.log(object);

        // console.log("COL NAME", columnName);
        // console.log("COL VAL", val);

        if (
          tableListObj[el.table_name][columnName].checks === undefined
        ) {
          tableListObj[el.table_name][columnName].checks = {};
        }

        // else {
        //   tableListObj[el.table_name][columnName].checks?.push({
        //     name: el.conname,
        //     definition: val
        //   });
        // }
        tableListObj[el.table_name][columnName].checks[el.conname] = val;

        // tableListObj[el.table_name].checks.push(String(val));
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

  // console.log(tableListObj.people.species_id.association);

  return [tableListObj, enumObj];
};
