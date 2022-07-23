import { ConnectDb, DisconnectDb } from './Db.ts'
import { tableListQuery, tableConstQuery, columnInfoQuery } from '../queries/introspection.ts'

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

interface ITableListObj {
    [key: string]: {
        columns: {
            [key: string]: {
                type: string,
                primaryKey?: boolean,
                notNull?: boolean,
                unique?: boolean,
                checks?: string[],
                defaultVal?: unknown,
                autoIncrement?: boolean,
                association?: { rel_type: string, model: unknown, mappedCol: string}
            }
        };
        checks: string[];
        unique?: string[];
        primaryKey?: string[];
        association?: { rel_type: string, model: unknown, mappedCol: string}
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
                    tableListObj[el.table_name].checks.push(val);       
            }
        }
    })
    
    return tableListObj;
};