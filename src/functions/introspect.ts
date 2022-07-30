import { ConnectDb, DisconnectDb } from './Db.ts'
import { tableListQuery, tableConstQuery, columnInfoQuery } from '../queries/introspection.ts'
import { sqlDataTypes } from '../constants/sqlDataTypes.ts';

// INTERFACES
interface ITableQueryRecords {
    table_name: string
}

interface IColumnQueryRecords {
    schemaname: string
    table_name: string
    column_name: string
    column_type: keyof typeof sqlDataTypes
    col_default: unknown
    not_null: boolean
    enum_value: string
}

interface IConstraint {
  schemaname: string
  table_name: string
  condef: string
  contype: string
}

// const indexNames = Object.keys(sqlDataTypes) 

interface ITableListObj {
    [key: string]: {
        columns: {
            [key: string]: {
                type: keyof typeof sqlDataTypes
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

interface IEnumObj {
    [key: string]: string[];
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
// Add enums to tablelist obj, OR Create a new seperate object for all the enums that THAT database has in it. 
// When you hit an enum that youre building out in dbpull, you can just query off of that object
export const introspect = async (): Promise<[ITableListObj, IEnumObj]> => {
    const { tableList, columnList, constraintList } = await getDbData();
    console.log("columnList", columnList);
    // convert table list to an object
    const tableListObj: ITableListObj = {};
    
    // Create object to store enums
    const enumObj: IEnumObj = {};

    // Add each table to the tableListObj for easier access
    tableList.forEach(el => {
        if (typeof el === 'object' && el !== null && 'table_name' in el){
            if(recordObjectType(el)) tableListObj[String(el.table_name)] = {columns: {}, checks: []};
        }
    });

    columnList.forEach(el => {
        if (typeof el === 'object' && el !== null && colRecordObjectType(el)){
            // Parse for enums, add to enumObj if found
            if (el.column_type.includes('enum:')){
                const enumName = el.column_type.replaceAll('enum: ', '');
                const enumVals = el.enum_value.replaceAll(',','').split(' ');
                enumObj[enumName] = enumVals;
            }
            console.log('enumObject!=>', enumObj)


            tableListObj[el.table_name].columns[el.column_name] = {type: el.column_type};
            const refObj = tableListObj[el.table_name].columns[el.column_name];
            refObj['notNull'] = el.not_null;

            if(/nextval\('\w+_seq'::regclass/.test(String(el.col_default))) {
                refObj['autoIncrement'] = true;
            } else {
                refObj['defaultVal'] = el.col_default;
            }
        }
    });

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
    return [tableListObj, enumObj];
};

// Will have to return array of objects and then deconstructure both objects in db pull




///// Current Generated Model

// export interface Persa {
//     current_mood: undefined
//     name: string
//   }
  
//   export class Persa extends Model {
//     static table = 'person';
//     static columns = {
//       current_mood: {
//         type: 'enum: mood',
//       },
//       name: {
//         type: 'text',
//       },
//     }
//   }

//////    Example ENUM model

// export interface Person {
//     current_mood: ('sad' | 'happy' | 'excited')
//     name: string
//   }
  
//   export class Person extends Model {
//     static table = 'person';
//     static columns = {
//       current_mood: {
//         type: 'enum',
//       },
//       name: {
//         type: 'text',
//       },
//     }
//   }
  
//   enum MyEnum { A, B, C };
//   keyof typeof MyEnum;  // "A" | "B" | "C"

  /////////
