import { introspect } from './introspect.ts';

// take the data from the model.ts file and reverse engineer it
// essentially make it look like the query results


interface ModelColumn {
    type: string,
    primaryKey?: boolean,
    notNull?: boolean,
    unique?: boolean,
    checks?: string[],
    defaultVal?: unknown,
    autoIncrement?: boolean,
    association?: { rel_type: string, table: string, mappedCol: string}
}

interface ModelInfo {
    table: string
    columns: Record<string, ModelColumn>
}

const jsonify = (text: string): ModelInfo[] => {
        // remove extraneous text
        text = text.replaceAll(/export interface \w+ {[\n +\w+: \w+]+}/g, ''). // interfaces
        replaceAll('  static ', ''). // static
        replaceAll(/export class \w+ extends Model/g, ''). // class boilerplate
        replaceAll("import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'\n", ''). // initial wording
        replaceAll(/\/\/ user model definition comes here\n+/g, ''). // initial wording
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
        replaceAll('}",', '},').
        replaceAll('}"}', '}}')

        text = '[' + text + ']';
        return JSON.parse(text);
}

const newColAttr = (column: ModelColumn): string => {
    let str = ``;

    // Make column type SERIAL if auto-increment is true
    if(column.autoIncrement){
        str += ` SERIAL`
    } else {
        // Otherwise use 
        str += `${column.type}`
        // Not Null for non-serial columns
        if(column.notNull && !column.primaryKey) str += ` NOT NULL`
    }
    console.log(column)
    if(column.primaryKey) str += ` PRIMARY KEY`
    if(column.unique && !column.primaryKey && !column.autoIncrement) str += ` UNIQUE`
    if(column.defaultVal) str += ` DEFAULT ${column.defaultVal}`
    if(column.association) {
        console.log(column.association)
        str += ` REFERENCES ${column.association.table}(${column.association.mappedCol})`}
    
    return str;

}

const createTable = (table_name: string, columns: Record<string, ModelColumn>): string => {
    let queryText = `CREATE TABLE ${table_name}(`;

    for(const key in columns){
        queryText += ` ${key} ${newColAttr(columns[key])},`
    }
    
    return queryText.slice(0, -1) + ');';
}

export const sync = async () => {
    const tableListObj = await introspect();
    // import typescript model of tables
    const modelText = Deno.readTextFileSync('./src/functions/temp_model.ts');

    const modelArray = jsonify(modelText); // parse import

    let createTableQueries = ``;
    let alterTableQueries = ``;

    console.log(tableListObj)

    modelArray.forEach(el => { // el is an object representing a table
        // SQL statements for tables not currently in the database
        if(!tableListObj[String(el.table)]){
            createTableQueries += createTable(String(el.table), el.columns);
            // ADD TABLE CONSTRAINT LOGIC
        } else {
            // Table exists - need to confirm all database structure aligns with model structure
            // iterate over the columns within the modelArray property
            Object.keys(el.columns).forEach(colMA => { // colMA is a column name
                // modelArray column object
                const colObj = el.columns[colMA];
                // if the column currently doesn't exist in the db
                if(!tableListObj[el.table].columns[colMA]) {
                    alterTableQueries += `ALTER TABLE ${el.table} ADD ${colMA}`

                    alterTableQueries += newColAttr(colObj) + ';';
                }
            }
            // ADD TABLE CONSTRAINT LOGIC
        )
        }
    })

    console.log(createTableQueries, alterTableQueries)
}

// EXTRA TO DOs - FOR PRIMARY KEY UPDATES CHECK TO CONFIRM IF THERE IS AN EXISTING PRIMARY KEY ON THE TABLE
// FIGURE OUT WHAT LOGIC IS THERE

/*
TO DO
CREATE w table constraints
Add constraints to existing columns
Add table constraints to exisisting
*/

/*
DONE
CREATE w/ column constraint
ALTER new column with column constraints
*/

// coordinate to have sync, belongsTo, introspect run to maintain file consistency
