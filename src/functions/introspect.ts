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
  conname: string
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
    return 'schemaname' in record && 'table_name' in record && 'conname' in record;
}

// Introspection Function
const getDbData = async () => {
    const db = await ConnectDb();

    const tableList = await db.queryObject(tableListQuery);
    const columnList = await db.queryObject(columnInfoQuery);
    const constraintList = await db.queryObject(tableConstQuery);

    DisconnectDb(db);

    console.log('tableList=', tableList, 'columnList=', columnList, 'constraintList=', constraintList);
    return {
        tableList: tableList.rows,
        columnList: columnList.rows,
        constraintList: constraintList.rows
    }
}

export const introspect = async () => {
    const { tableList, columnList, constraintList } = await getDbData();

    // convert table list to an object
    const tableListObj: Record<string, Record<string, Record<string, unknown>>> = {};

    // Add each table to the tableListObj for easier access
    tableList.forEach(el => {
        if(typeof el === 'object' && el !== null && 'table_name' in el){
            if(recordObjectType(el)) tableListObj[String(el.table_name)] = {};
        }
    });
    // {person: {}, films: {}, species: {}}
    // Add columns to the table's object in the tableListObj for easier look-up
    columnList.forEach(el => {
        if(typeof el === 'object' && el !== null && colRecordObjectType(el)){
            tableListObj[el.table_name][el.column_name] = {};

            const refObj = tableListObj[el.table_name][el.column_name];

            refObj['column_type'] = el.column_type;
            refObj['not_null'] = el.not_null;

            if(/nextval\('\w+_seq'::regclass/.test(String(el.col_default))) {
                refObj['autoIncrement'] = true;
            } else {
                refObj['col_default'] = el.col_default;
            }
    }
    })

    // Parse through the constraint table
    constraintList.forEach(el => {
        if (typeof el === 'object' && el !== null && constraintObjectType(el)){
            if (el.conname.includes("PRIMARY KEY")){
                const key = el.conname.replaceAll("PRIMARY KEY (","").replaceAll(")","");
                tableListObj[el.table_name][key]['primaryKey'] = true;
            }
        }
    })
    return tableListObj;
};