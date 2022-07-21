import { ConnectDb, DisconnectDb } from './Db.ts'
import { tableListQuery, tableConstQuery, columnInfoQuery } from '../queries/introspection.ts'

// take the data from the model.ts file and reverse engineer it
// essentially make it look like the query results

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

interface ModelInfo {
    table_name: string
    columns: Record<string, Record<string, unknown>>
}

// TYPE GUARD FUNCTIONS
const recordObjectType = (record: object): record is ITableQueryRecords => {
    return 'table_name' in record;
}

const colRecordObjectType = (record: object): record is IColumnQueryRecords => {
    return 'schemaname' in record && 'table_name' in record && 'column_name' in record &&
        'column_type' in record && 'col_default' in record && 'not_null' in record
}

const introspectDb = async () => {
    const db = await ConnectDb();

    const tableList = await db.queryObject(tableListQuery);
    const columnList = await db.queryObject(columnInfoQuery);
    const constraintList = await db.queryObject(tableConstQuery);

    DisconnectDb(db);

    return {
        tableList: tableList.rows,
        columnList: columnList.rows,
        constraintList: constraintList.rows
    }
}


const jsonify = (text: string): ModelInfo[] => {
        // remove extraneous text
        text = text.replaceAll(/export interface \w+ {[\n +\w+: \w+]+}/g, ''). // interfaces
        replaceAll('  static ', ''). // static
        replaceAll(/export class \w+ extends Model/g, ''). // class boilerplate
        replaceAll("import { Model } from './src/class/Model.ts'\n", ''). // initial wording
        replaceAll(/\/\/ user model definition comes here \n+/g, ''). // initial wording
        replaceAll(/\n+/g, ''). // all line breaks
        replaceAll(';', ',').
        replaceAll(' ', '').
        replaceAll(',}', '}').
        replaceAll('}{', '}, {'). // begin formatting as array to mimick JSON
        replaceAll('\'', ''). // JSON: replace sing quotes with double quotes
        replaceAll('=', ':'). // JSON: replace equals declartions with colons
        replaceAll(':', '":"'). //JSON all property names enclosed in double quotes, add closing quote
        replaceAll('{', '{"'). // JOSN add some opening double-quotes
        replaceAll('}', '"}').
        replaceAll(',', ',"'). // JSON add remaining opening double quotes
        replaceAll(',"', '","').
        replaceAll('," ', ', '). //JSON edit incorrect double quotes out
        replaceAll('}"}"}', '}}}').
        replaceAll(':"{', ':{').
        replaceAll('}",', '},')
        
        text = '[' + text + ']';
        return JSON.parse(text);
}

const createTable = (table_name: string, columns: Record<string, Record<string, unknown>>): string => {
    let queryText = `CREATE TABLE ${table_name}(`;

    for(let key in columns){
        queryText += ` ${key} ${columns[key].type},`
    }
    
    return queryText.slice(0, -1) + ');';
}

export const sync = async () => {
    const { tableList, columnList, constraintList } = await introspectDb();

    // import typescript model of tables
    let modelText = Deno.readTextFileSync('./src/functions/temp_model.ts');

    const modelArray = jsonify(modelText); // parse import

    let createTableQueries = ``;
    let alterTableQueries = ``;

    // convert table list to an object
    const tableListObj: Record<string, Record<string, Record<string, unknown>>> = {};

    // Add each table to the tableListObj for easier access
    tableList.forEach(el => {
        if(typeof el === 'object' && el !== null && 'table_name' in el){
            if(recordObjectType(el)) tableListObj[String(el.table_name)] = {};
        }
    });

    // Add columns to the table's object in the tableListObj for easier look-up
    columnList.forEach(el => {
        if(typeof el === 'object' && el !== null && colRecordObjectType(el)){
            tableListObj[el.table_name][el.column_name] = {};

            const refObj = tableListObj[el.table_name][el.column_name];

            refObj['column_type'] = el.column_type;
            refObj['col_default'] = el.col_default;
            refObj['not_null'] = el.not_null;
    }
    })

    console.log(tableListObj, modelArray)

    modelArray.forEach(el => {
        // SQL statements for tables not currently in the database
        if(!tableListObj[String(el.table_name)]){
            createTableQueries += createTable(String(el.table_name), el.columns);
        } else {
            // Table exists - need to confirm all database structure aligns with model structure
            // iterate over the columns within the modelArray property
            Object.keys(el.columns).forEach(colMA => {
                // if the column currently doesn't exist in the db
                if(!tableListObj[el.table_name][colMA]) {
                    alterTableQueries += `ALTER TABLE ${el.table_name} ADD` +
                    ` ${colMA} ${el.columns[colMA].type}`
                    // NEED TO IMPLEMENT OTHER INFORMATION
                    console.log(alterTableQueries)
                }
            })
        }
    })

    console.log(createTableQueries)
}