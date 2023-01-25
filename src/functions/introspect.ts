import { ConnectDb, DisconnectDb } from './Db.ts';
import { columnInfoQuery, enumQuery } from '../queries/introspection.ts';
import { sqlDataTypes } from '../constants/sqlDataTypes.ts';

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

type ITableListObj = any;

interface IEnumObj {
  [key: string]: string[];
}

interface IEnumEl {
  enum_schema: string;
  enum_name: string;
  enum_value: string;
}

export interface DbData {
  tableList: ITableQueryRecords[];
  columnList: IColumnQueryRecords[];
  constraintList: IConstraint[];
  enumList: IEnumEl[];
}

// TYPE GUARD FUNCTIONS
const recordObjectType = (record: object): record is ITableQueryRecords => {
  return 'table_name' in record;
};

const colRecordObjectType = (record: object): record is IColumnQueryRecords => {
  return 'schemaname' in record && 'table_name' in record &&
    'column_name' in record &&
    'column_type' in record && 'col_default' in record && 'not_null' in record;
};

const constraintObjectType = (record: object): record is IConstraint => {
  return 'schemaname' in record && 'table_name' in record && 'condef' in record;
};

const enumElType = (record: object): record is IEnumEl => {
  return 'enum_name' in record && 'enum_name' in record &&
    'enum_value' in record;
};

// returns the following information about each table in the user's db:
// schemaname (ex: 'public'), table_name (ex: 'planets'),
// condef (short for constraint definition, for ex: primary key/foreign key)
// contype (ex: 'p' for primary, 'f' for foreign), conname (ex: 'planets_pk')
const tableConstQuery = `SELECT tables.schemaname, class.relname AS table_name,
pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
FROM pg_class class
INNER JOIN pg_tables tables on class.relname = tables.tablename
INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid
WHERE tables.schemaname NOT IN ('pg_catalog', 'information_schema')`;

// returns all the user-defined table names in the db
const tableListQuery = `SELECT table_name FROM information_schema.tables
WHERE table_schema not in ('pg_catalog', 'information_schema')
AND table_type='BASE TABLE';`;

// MAIN FUNCTION: calls helper functions getDbData, introspectTables, and introspectEnums
// in order to extract schema from user's database and return objects representing that schema
export const introspect = async (
  uri?: string,
): Promise<[ITableListObj, IEnumObj]> => {
  const { tableList, columnList, constraintList, enumList } = await getDbData(
    uri,
  );

  const tableListObj = introspectTables(tableList, columnList, constraintList);
  const enumObj = introspectEnums(enumList);

  return [tableListObj, enumObj];
};

// * Grabs all the data needed to perform the INTROSPECT function
export const getDbData = async (uri?: string): Promise<DbData> => {
  const db = await ConnectDb(uri);

  const tableList = await db.queryObject(tableListQuery);
  const columnList = await db.queryObject(columnInfoQuery);
  const constraintList = await db.queryObject(tableConstQuery);
  const enumList = await db.queryObject(enumQuery);

  await DisconnectDb(db);

  return {
    tableList: tableList.rows,
    columnList: columnList.rows,
    constraintList: constraintList.rows,
    enumList: enumList.rows,
  };
};

export const introspectTables = (tableList, columnList, constraintList) => {
  // convert table list to an object
  const tableListObj: any = {};

  // Add each table to the tableListObj for easier access
  tableList.forEach((el) => {
    if (typeof el === 'object' && el !== null && 'table_name' in el) {
      if (recordObjectType(el)) {
        tableListObj[String(el.table_name)] = {};
      }
    }
  });

  // * loop through the columns to make columns and their respective properties into tables
  columnList.forEach((el) => {
    if (typeof el === 'object' && el !== null && colRecordObjectType(el)) {
      // * ENUM
      if (String(el.column_type).includes('enum')) {
        tableListObj[el.table_name][el.column_name] = {
          type: 'enum',
          enumName: String(el.column_type).slice(6),
        };
      } else {
        tableListObj[el.table_name][el.column_name] = {
          type: el.column_type,
        };
      }
      const refObj = tableListObj[el.table_name][el.column_name];

      // * NOT NULL
      if (!String(el.column_type).includes('enum')) {
        refObj['notNull'] = el.not_null;
      }

      // * MAX LENGTH (if not null)
      if (el.character_maximum_length) {
        refObj['length'] = el.character_maximum_length;
      }

      // * AUTOINCREMENT
      if (/nextval\('\w+_seq'::regclass/.test(String(el.col_default))) {
        refObj['autoIncrement'] = true;
      } else {
        // * DEFAULT
        if (typeof el.col_default === 'string') {
          // gets rid of cast operators of the form "::"
          let defaultVal: any = el.col_default.replace(/\:\:[\w\W]*/, '');

          // adds quotation marks around default values with cast operators of the form "CAST()"
          if (String(defaultVal).slice(-2) === '()') {
            defaultVal = '\'' + defaultVal + '\'';
          }

          refObj['defaultVal'] = JSON.parse(JSON.stringify(defaultVal));
        }
      }
    }
  });

  // PRIMARY & UNIQUE & CHECK CONSTRAINTS
  // * loop through all of the constraints
  constraintList.forEach((el) => {
    if (typeof el === 'object' && el !== null && constraintObjectType(el)) {
      // * primary key
      if (el.contype === 'p') {
        const key = el.condef.replaceAll('PRIMARY KEY (', '').replaceAll(
          ')',
          '',
        );
        if (key.includes(',')) {
          tableListObj[el.table_name].primaryKey = key.replaceAll(' ', '')
            .split(',');
        } else {
          tableListObj[el.table_name][key]['primaryKey'] = true;
        }
        // * unique
      } else if (el.contype === 'u') {
        const key = el.condef.replaceAll('UNIQUE (', '').replaceAll(')', '');
        // Check if it's composite
        if (key.includes(',')) {
          if (!tableListObj[el.table_name].unique) {
            tableListObj[el.table_name].unique = [];
            tableListObj[el.table_name].unique?.push(
              key.replaceAll(' ', '').split(','),
            );
          } else {
            tableListObj[el.table_name].unique?.push(
              key.replaceAll(' ', '').split(','),
            );
          }
        } else {
          tableListObj[el.table_name][key]['unique'] = true;
        }
        // * checks
      } else if (el.contype === 'c') {
        // * condef: Constraint Definition
        let parsedCondef: any = el.condef.slice(6).replace(/[\(\)]/g, '');
        parsedCondef = parsedCondef.replace(/\:\:\w+\s?\w+(\[\])?/g, '');
        parsedCondef = parsedCondef.split(' AND ');

        const val = [];

        for (let i = 0; i < parsedCondef.length; i++) {
          const arrayRegex = /\[(.*)\]/;
          // * if a check has list of categories listed (i.e. gender in ('F', 'M'))
          if (arrayRegex.test(parsedCondef[i])) {
            const parsedCondef1 = parsedCondef[i].replace(/(.*\s\=\s).*/, '$1');
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
      } else if (el.contype === 'f') {
        let condef = el.condef;
        let conname = el.conname;

        if (condef.includes(',')) {
          const condefArray = condef.replace(/FOREIGN KEY */, '').split(
            'REFERENCES ',
          );
          const fkColumns = condefArray[0].replaceAll(/\(|\)/g, '')
            .replaceAll(/(?<=\"|\,|\') +/g, '').replaceAll(/ +/g, '')
            .replaceAll(/ $/g, '').split(',');

          const tableName = condefArray[1].split(/ *\(/)[0];

          const mappedCol = condefArray[1].replaceAll(/[\W\w]+\(|\)/g, '')
            .replaceAll(/(?<=\"|\,|\') +/g, '').replaceAll(/ +/g, '')
            .replaceAll(/ $/g, '').split(',');

          const fKObj = {
            columns: fkColumns,
            mappedColumns: mappedCol,
            table: tableName,
          };
        } else {
          condef = condef.replace('FOREIGN KEY (', '').replace(
            ') REFERENCES',
            '',
          );
          const condefArray = condef.split(' '); // 0: table column // 1: foreign table and its id

          const columnObj: any = tableListObj[el.table_name][condefArray[0]];
          columnObj.association = {
            name: conname,
            mappedTable: condefArray[1].split('(')[0],
            mappedColumn: condefArray[1].replace(/\w+\(/, '').replace(')', ''),
          };
        }
      }
    }
  });

  return tableListObj;
};

const introspectEnums = (enumList) => {
  // Create object to store enums
  const enumObj: IEnumObj = {};

  // * loop through each enum type in the schema
  enumList.forEach((el) => {
    // * key: ENUM name value: list of all the enumerations (categories of the enum type)
    if (typeof el === 'object' && el !== null && enumElType(el)) {
      const enumVals = el.enum_value.split(/ *, */);
      enumObj[el.enum_name] = enumVals;
    }
  });

  return enumObj;
};
