import { introspect } from './introspect.ts';
import { ConnectDb, DisconnectDb } from './Db.ts'
import { primaryKeyQuery, tableUniqueQuery } from '../queries/introspection.ts'

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
    checks?: string[];
    unique?: string[];
    primaryKey?: string[];
}

const jsonify = (text: string): ModelInfo[] => {
        //remove extraneous text
        text = text.replaceAll(/export interface \w+ {[\n +\w+: \w+]+}/g, ''). // interfaces
        replaceAll('  static ', ''). // static
        replaceAll(/export class \w+ extends Model/g, ''). // class boilerplate
        replaceAll("import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'\n", ''). // initial wording
        replaceAll(/\/\/ user model definition comes here\n+/g, ''). // initial wording
        replaceAll(/\n+/g, ''). // all line breaks
        replaceAll(';', ',').
        replaceAll(/(?<!checks\: *\[\"[\W\w]+) (?!\")/g, '')//.
        // replaceAll(',}', '}').
        // replaceAll('}{', '}, {'). // begin formatting as array to mimick JSON
        // replaceAll('\'', ''). // JSON: replace sing quotes with double quotes
        // replaceAll('=', ':'). // JSON: replace equals declartions with colons
        // replaceAll(':', '":"'). //JSON all property names enclosed in double quotes, add closing quote
        // replaceAll('{', '{"'). // JOSN add some opening double-quotes
        // replaceAll('}', '"}').
        // replaceAll(',', ',"'). // JSON add remaining opening double quotes
        // replaceAll(',"', '","').
        // replaceAll('," ', ', '). //JSON edit incorrect double quotes out
        // replaceAll('}"}"}', '}}}').
        // replaceAll(':"{', ':{').
        // replaceAll('}",', '},').
        // replaceAll('}"}', '}}').
        // replaceAll(/}checks/g, '},"checks').
        // replaceAll(/}primaryKey/g, '},"primaryKey').
        // replaceAll(/}unique/g, '},"unique').
        // replaceAll(/}foreignKey/g, '},"foreignKey').
        // replaceAll('""', '"').
        // replaceAll('"[', '[').
        // replaceAll(']"', ']').
        // replaceAll('":":"', '::').
        // replaceAll('"true"', 'true').
        // replaceAll('"false"', 'false')

        text = '[' + text + ']';
        console.log(text)
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
    if(column.primaryKey) str += ` PRIMARY KEY`
    if(column.unique && !column.primaryKey && !column.autoIncrement) str += ` UNIQUE`
    if(column.defaultVal) str += ` DEFAULT ${column.defaultVal}`
    if(column.association) {
        str += ` REFERENCES ${column.association.table}(${column.association.mappedCol})`}
    
    return str;

}

const createTable = (table_name: string, columns: Record<string, ModelColumn>, checks: string[] | undefined, 
    unique: string[] | undefined, primaryKey: string[] | undefined): string => {
    let queryText = `CREATE TABLE ${table_name}(`;

    // Add columns to query
    for(const key in columns){
        queryText += ` ${key} ${newColAttr(columns[key])},`
    }

    // TABLE CHECKS
    if(checks) {
        checks.forEach(el => {
            queryText += `CHECK ${el},`
        })
    }

    // TABLE UNIQUE
    if(unique) {
        queryText += `UNIQUE(${unique}),`
    }

    // TABLE PRIMARY KEY
    if(primaryKey) {
        queryText += `PRIMARY KEY(${primaryKey}),`
    }
    
    return queryText.slice(0, -1) + ');'; // remove the last comma
}

const alterTableError = (err: Error) => {
    console.error();
}

export const sync = async (overwrite = false) => {
    const tableListObj = await introspect();
    // import typescript model of tables
    const modelText = Deno.readTextFileSync('./models/model.ts');

    const modelArray = jsonify(modelText); // parse import

    let createTableQueries = ``;
    let alterTableQueries = ``;

    const db = await ConnectDb(); // db connection to send off alter and create queries

    for (let el of modelArray){
        // SQL statements for tables not currently in the database
        if(!tableListObj[String(el.table)]){
            // New Table Added in Model by User
            createTableQueries += createTable(String(el.table), el.columns, el.checks, el.unique, el.primaryKey);
        } else {
            const dbTableObj = tableListObj[String(el.table)];

            for(let colMA of Object.keys(el.columns)) {
                // modelArray column object
                const colObj = el.columns[colMA];
                // New Column added in Model by User
                if(!tableListObj[el.table].columns[colMA]) {
                    alterTableQueries += `ALTER TABLE ${el.table} ADD ${colMA} `

                    alterTableQueries += newColAttr(colObj) + ';';
                } else {
                    // Check column constraints for updates
                    const dbColObj = tableListObj[el.table].columns[colMA];
                    // NOT NULL updated
                    if(Boolean(colObj.notNull) !== dbColObj.notNull) { //TESTED
                        alterTableQueries += `ALTER TABLE ${el.table} ALTER COLUMN ${colMA} `;
                        alterTableQueries += colObj.notNull ? `SET ` : `DROP `;
                        alterTableQueries += `NOT NULL; `;
                    }
                    // UNIQUE updated
                    if(Boolean(colObj.unique) !== Boolean(dbColObj.unique)) { //TESTED
                        alterTableQueries += `ALTER TABLE ${el.table} `;
                        alterTableQueries += colObj.unique ? `ADD UNIQUE (${colMA});` : 
                            !overwrite ? `DROP CONSTRAINT ${el.table}_${colMA}_key;`: `DROP CONSTRAINT ${el.table}_${colMA}_key CASCADE;`;
                    }
                    // DEFAULT updated
                    if((colObj.defaultVal === undefined ? null : colObj.defaultVal) !== dbColObj.defaultVal && (colObj.defaultVal !== undefined  && dbColObj !== undefined)){ // TESTED
                        alterTableQueries += `ALTER TABLE ${el.table} ALTER COLUMN ${colMA} `
                        alterTableQueries += colObj.defaultVal === null || 
                                                colObj.defaultVal === '' ? `DROP DEFAULT; ` : `SET DEFAULT ${colObj.defaultVal}; `
                    }
                    // PRIMARY KEY updated
                    if(colObj.primaryKey !== dbColObj.primaryKey){
                        // QUERY TO UPDATE PRIMARY KEY - CHECK ON ISSUES WITH PRIMARY KEY ALREADY EXISISTING AND NEEDING 
                        // TO OVERWRITE

                        // Check if table has existing primary key
                        const pKeys = await db.queryObject(primaryKeyQuery + `'${el.table}';`);
                        const existingPK = pKeys.rows;

                        if(!colObj.primaryKey) {
                            // remove exisisting primaryKey
                            if(overwrite){
                                // overwrite is true so can be deleted
                                alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${existingPK[0].conname}; `
                            } else { // TESTED
                                console.log(`Cannot remove column primary key from ${el.table} table without -x passed to --db-sync.`)
                            }
                        } else {
                            if(existingPK.length > 0 && !overwrite && colObj.primaryKey){ // TESTED
                            // add primary key but there is exisisting primary key and overwrite is false
                                console.log(`Cannot overwrite existing primary key information to the ${el.table} table. If you wish to proceed with these` +
                                ` updates, please re-run --db-sync with the argument -x`);
                            } else if (existingPK.length > 0 && overwrite){ // TESTED
                            // add primary key with exisisting primary key and overwrite is set to true
                                alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${existingPK[0].conname}; ` +
                                    `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_pkey PRIMARY KEY (${colMA});`;
                            } else { // TESTED
                            // No prior primary key just add the update
                                alterTableQueries += `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_pkey PRIMARY KEY (${colMA});`
                            }
                        }

                    }
                    // FOREIGN KEY updated
                    if(JSON.stringify(colObj.association) !== JSON.stringify(dbColObj.association)) {
                        // QUERY TO UPDATE FOREIGN KEY - CHECK ON ISSUES WITH FOREIGN KEY ALREADY EXISTS AND NEEDING
                        // TO OVERWRITE
                        console.log('association', el.table, colMA)
                        console.log(colObj.association, dbColObj.association)

                        if(!overwrite && colObj.association === undefined) {
                            // remove exisisting foreign key, overwrite false - inform user update cannot be made
                            console.log(`Cannot delete foreign key from column ${colMA} on ${el.table}. Please re-run command with -x flag.`)
                        } else if(overwrite && colObj.association === undefined) {
                            // remove exisisting foreign key, overwrite true
                            alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${el.table}_${colMA}_fkey; `
                        } else if(dbColObj.association === undefined) {
                            // add new foreign key to column
                            alterTableQueries += `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_${colMA}_fkey FOREIGN KEY (${colMA}) REFERENCES ${colObj.association?.table}(${colObj.association?.mappedCol}); `
                        } else if (!overwrite) {
                            // update exisisting foreign key overwrite false - inform user update cannot be made
                            console.log(`Cannot update foreign key on column ${colMA} on ${el.table} table. Please re-run command with -x flag.`)
                        } else {
                            alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${el.table}_${colMA}_fkey; ` +
                            `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_${colMA}_fkey FOREIGN KEY (${colMA}) REFERENCES ${colObj.association?.table}(${colObj.association?.mappedCol}); `
                        }
                    }

                    if(alterTableQueries !== ``){
                        //await db.queryObject(alterTableQueries);
                        console.log(alterTableQueries)
                        alterTableQueries = ``;
                    }
                }
        }
        // ADD TABLE CONSTRAINT LOGIC

        // CHECKS
        if(String(dbTableObj.checks) !== String(el.checks)){
            console.log(String(dbTableObj.checks),  String(el.checks))
        }

        // UNIQUE
        if(String(dbTableObj.unique) !== String(el.unique)) { //TESTED
            const toAdd: string[] = [];

            if(!dbTableObj.unique) {
                // add unique table constraints to db where there previously weren't any
                alterTableQueries += `ALTER TABLE ${el.table} ADD UNIQUE (${el.unique});`;
            } else if(!el.unique && !overwrite){
                // remove all exisisting db unique table constraints - notify user -x needs to be set
                console.log(`Cannot delete exisisting UNIQUE table constraints for ${el.table}. Please re-run --db-sync with -x flag.`)
            } else if (!el.unique && overwrite) {
                // remove all exisisting db unique table constraints
                const results = await db.queryObject(tableUniqueQuery);
                const dbUniqueConst = results.rows;

                dbUniqueConst.forEach(uTables => {
                    alterTableQueries += `ALTER TABLE ${uTables.table} DROP CONSTRAINT ${uTables.conname} CASCADE`;
                })
            } else if (el.unique) {
                const dbU = dbTableObj.unique.map(element => String(element));
                const modelU = el.unique.map(element => String(element));

                modelU.forEach(element => {
                    if(!dbU.includes(element)) toAdd.push(element);
                })

                if(toAdd.length){
                    toAdd.forEach(element => {
                        alterTableQueries += `ALTER TABLE ${el.table} ADD UNIQUE ${element.replace('[','(').replace(']', ')')}`
                    })
                }
            }
            
            // } else if (el.unique && overwrite) {
            //     // both have content need to compare what's missing and what's not
            //     const dbU = dbTableObj.unique.map(element => String(element)).sort();
            //     const modelU = el.unique.map(element => String(element)).sort();

            //     dbU.forEach(element => {
            //         if(!modelU.includes(element)) alterTableQueries += ``
            //     })                
            // } else {
            //     console.log(`If you wish to proceed with the changes to the UNIQUE table constraint for ${el.table} please re-run --db-sync with -x flag.`)
            // }

            alterTableQueries += `ALTER TABLE ${el.table} `;
            if(el.unique && !dbTableObj.unique){
                alterTableQueries += `ADD UNIQUE (${el.unique});`
            }
        }

        // PRIMARY KEY
        if(String(dbTableObj.primaryKey) !== String(el.primaryKey)) {
            // Check if table has existing primary key (required b/c column level primary key)
            const pKeys = await db.queryObject(primaryKeyQuery + `'${el.table}';`);
            const existingPK = pKeys.rows;

            if(existingPK[0] && !overwrite){
            // primary key exisits but user hasn't provided overwrite permissions
                console.log(`Table ${el.table} currently has primary key constraint. To overwrite existing value please re-run --db-sync with the -x flag.`)
            } else if (existingPK[0] && overwrite) {
                alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${existingPK[0].conname}; ` +
                                    `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_pkey PRIMARY KEY (${el.primaryKey});`;
            } else { // TESTED
             // No prior primary key just add the update
                alterTableQueries += `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_pkey PRIMARY KEY (${el.primaryKey});`
            }
        }
        }
    }
    console.log(createTableQueries, alterTableQueries)
    //console.log(tableListObj)
    DisconnectDb(db);
}

// PRIMARY KEY WORK ON WHEN THERE ARE INTERCONNECTED DEPENDENCIES (WHEN A FOREIGN KEY REFERENCES THE PRIMARY KEY)
// CASCADE for unique - error handling for when there are dependencies and overwrite is false

// Following changes will not be implemented via sync: changing column types, the deletes of individual UNIQUE table constraints all would need to be
// deleted, the deltes of individual CHECKS all would need to be deleted
// Do no support tables with more than one composite foreign key