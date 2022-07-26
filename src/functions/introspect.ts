import { ConnectDb, DisconnectDb } from './Db.ts'
import { tableListQuery, tableConstQuery, columnInfoQuery } from '../queries/introspection.ts'
import { sqlDataTypesKeys, sqlDataTypes } from '../constants/sqlDataTypes.ts';
// import { sqlDataTypesKeys2 } from '../constants/sqlDataTypes.ts'

// INTERFACES
interface ITableQueryRecords {
    table_name: string
}

interface IColumnQueryRecords {
    schemaname: string
    table_name: string
    column_name: string
    column_type: string
    col_default: unknown
    not_null: boolean
}

interface IConstraint {
  schemaname: string
  table_name: string
  condef: string
  contype: string
}

// orders5: {
//     columns: {
//       order_id: { type: "int4", notNull: true, defaultVal: null, primaryKey: true },
//       shipping_address: { type: "text", notNull: false, defaultVal: null }
//     },

// interfaceCode += `  ${colName}: ${sqlDataTypes[columnObj.type]}\n`

// Research "keyof" a type


interface ITableListObj {
    [key: string]: {
        columns: {
            [key: string]: {
                type: ( 'int' | 'int2' | 'int4' | 'int8' | 'smallint' | 'integer' | 'bigint' | 'decimal' | 'numeric' | 'real' | 'float' | 'float4' | 'float8' | 'money' | 'varchar' | 'char' | 'text' | 'bit' | 'bitVar' | 'time' | 'timetz' | 'timestamp' | 'timestamptz' | 'interval' | 'boolean' | 'json' | 'jsonb' ), // ( int2 | int4 ) be more specific and only allow the strings which are keys of SQLDataTypes. Object.keys?
                primaryKey?: boolean,
                notNull?: boolean,
                unique?: boolean,
                checks?: string[],
                defaultVal?: unknown,
                autoIncrement?: boolean,
                association?: { rel_type: string, table: string, mappedCol: string}
            }
        };
        checks: string[];
        unique?: string[];
        primaryKey?: string[];
        association?: { rel_type: string, table: string, mappedCol: string}
    }
}

// TYPE GUARD FUNCTIONS
const recordObjectType = (record: object): record is ITableQueryRecords => {
    return 'table_name' in record;
}

const colRecordObjectType = (record: object): record is IColumnQueryRecords => {
    return 'schemaname' in record && 'table_name' in record && 'column_name' in record &&
        'column_type' in record && 'col_default' in record && 'not_null' in record;
}

const constraintObjectType = (record: object): record is IConstraint => {
    return 'schemaname' in record && 'table_name' in record && 'condef' in record;
}


// Introspection Function
const getDbData = async () => {
    const db = await ConnectDb();

    const tableList = await db.queryObject(tableListQuery);
    const columnList = await db.queryObject(columnInfoQuery);
    const constraintList = await db.queryObject(tableConstQuery);

    DisconnectDb(db);

    //console.log('tableList=', tableList, 'columnList=', columnList, 'constraintList=', constraintList);
    return {
        tableList: tableList.rows,
        columnList: columnList.rows,
        constraintList: constraintList.rows
    }
}

export const introspect = async () => {
    const { tableList, columnList, constraintList } = await getDbData();

    // convert table list to an object
    const tableListObj: ITableListObj = {};

    // Add each table to the tableListObj for easier access
    tableList.forEach(el => {
        if(typeof el === 'object' && el !== null && 'table_name' in el){
            if(recordObjectType(el)) tableListObj[String(el.table_name)] = {columns: {}, checks: []};
        }
    });

    columnList.forEach(el => {
        if(typeof el === 'object' && el !== null && colRecordObjectType(el)){
            tableListObj[el.table_name].columns[el.column_name] = {type: el.column_type};

            const refObj = tableListObj[el.table_name].columns[el.column_name];

            refObj['notNull'] = el.not_null;

            if(/nextval\('\w+_seq'::regclass/.test(String(el.col_default))) {
                refObj['autoIncrement'] = true;
            } else {
                refObj['defaultVal'] = el.col_default;
            }
    }
    })
    console.log(constraintList)

    // PRIMARY & UNIQUE & CHECK CONSTRAINTS
    constraintList.forEach(el => {
        if (typeof el === 'object' && el !== null && constraintObjectType(el)){
            if (el.contype === 'p'){
                const key = el.condef.replaceAll("PRIMARY KEY (","").replaceAll(")","");
                if (key.includes(',')){
                    tableListObj[el.table_name].primaryKey = key.replaceAll(' ', '').split(',');
                } else {
                tableListObj[el.table_name].columns[key]['primaryKey'] = true;
                }
            } else if (el.contype === 'u'){
                const key = el.condef.replaceAll("UNIQUE (","").replaceAll(")","");
                // Check if it's composite
                if(key.includes(',')) {
                    tableListObj[el.table_name].unique = key.replaceAll(' ', '').split(',')
                } else {
                    tableListObj[el.table_name].columns[key]['unique'] = true;
                }
            }
            else if (el.contype === 'c'){
                const val = el.condef.replaceAll("CHECK (", "").replace(")","");
                    tableListObj[el.table_name].checks.push(String(val));       
            } else if (el.contype === 'f') {
                let condef = el.condef;

                if(condef.includes(',')) {
                    console.log('composite foreign key')
                } else {
                    condef = condef.replace('FOREIGN KEY (', '').replace(') REFERENCES', '')
                    const condefArray = condef.split(' '); // 0: table column // 1: foreign table and its id

                    const columnObj = tableListObj[el.table_name].columns[condefArray[0]]
                    columnObj.association = {rel_type: 'belongsTo', 
                    table: condefArray[1].split('(')[0], 
                    mappedCol: condefArray[1].replace(/\w+\(/, '').replace(')', '')};
                }
            }
        }
    })
    //console.log(tableListObj)
    return tableListObj;
};