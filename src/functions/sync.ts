import { ConnectDb, DisconnectDb } from './Db.ts'
import { tableListQuery, tableConstQuery, columnInfoQuery } from '../queries/introspection.ts'

// take the data from the model.ts file and reverse engineer it
// essentially make it look like the query results

const introspectDb = async () => {
    const db = await ConnectDb();

    const tableList = await db.queryObject(tableListQuery);
    //const columnList = await db.queryObject(columnInfoQuery);
    //const tableConstraints = await db.queryObject(tableConstQuery);

    console.log('Table List', tableList.rows)
    //console.log('Column Info', columnList.rows), 
    //console.log('Constraint', tableConstraints.rows);
    return tableList;
}


const jsonify = (text: string): Record<string, unknown>[] => {
        // remove extraneous text
        text = text.replaceAll(/export interface \w+ {[\n +\w+: \w+]+}/g, ''). // interfaces
        replaceAll('  static ', ''). // static
        replaceAll(/export class \w+ extends Model/g, ''). // class boilerplate
        replaceAll("import { Model } from '../src/model/Model.ts'\n", ''). // initial wording
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

export const sync = () => {
    const tableList = introspectDb();
    // import typescript model of tables
    let modelText = Deno.readTextFileSync('./src/functions/temp_model.ts');

    const modelArray = jsonify(modelText);

    let createTableQueries = ``;

    // convert table list to an object
    const tableListObj: Record<string, unknown> = {};
    tableList.rows.forEach(el => {
        tableListObj[String(el.table_name)] = true;
    })

    modelArray.forEach(el => {
        if(!tableListObj[String(el.table_name)]){
            createTableQueries += createTable(String(el.table_name), el.columns);
        }
    })

    console.log(createTableQueries)
}