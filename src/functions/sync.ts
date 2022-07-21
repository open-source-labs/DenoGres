import { introspect } from './introspect.ts';

// take the data from the model.ts file and reverse engineer it
// essentially make it look like the query results

interface ModelInfo {
    table_name: string
    columns: Record<string, Record<string, unknown>>
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
    const tableListObj = await introspect();
    // import typescript model of tables
    let modelText = Deno.readTextFileSync('./src/functions/temp_model.ts');

    const modelArray = jsonify(modelText); // parse import

    let createTableQueries = ``;
    let alterTableQueries = ``;

    console.log(tableListObj)

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

    //console.log(createTableQueries)
}
