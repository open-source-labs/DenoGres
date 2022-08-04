import { introspect } from './introspect.ts';
import { ConnectDb, DisconnectDb } from './Db.ts'
import { primaryKeyQuery, tableUniqueQuery } from '../queries/introspection.ts'
import { modelParser, ModelColumn, ModelInfo } from './modelParser.ts';
import { enumSync } from './enumSync.ts';

// take the data from the model.ts file and reverse engineer it
// essentially make it look like the query results

interface IConQuery {
    conname: string,
    table_name: string,
}

interface IForeignKey {
    columns: string[];
    mappedColumns: string[];
    rel_type?: string;
    table: string;
}

const conQueryGuard = (record: object): record is IConQuery => {
    return 'conname' in record && 'table_name' in record;
}

const newColAttr = (column: ModelColumn): string => {
    let str = ``;

    // Make column type SERIAL if auto-increment is true
    if(column.autoIncrement){
        str += ` SERIAL`
    } else if(column.type === 'enum') {
        str += ` ${column.enumName}`
        if(column.notNull && !column.primaryKey) str += ` NOT NULL`;
    }else {
        // Otherwise use 
        str += `${column.type}`
        if(column.length) str += `(${column.length})`;
        // Not Null for non-serial columns
        if(column.notNull && !column.primaryKey) str += ` NOT NULL`
    }
    if(column.primaryKey) str += ` PRIMARY KEY`
    if(column.unique && !column.primaryKey && !column.autoIncrement) str += ` UNIQUE`
    if(column.defaultVal) {
        let dV;
        if(column.type === 'timestamp' && typeof column.defaultVal === 'string'){
            dV = column.defaultVal.replaceAll(/\'|\"/g, '')
        } else {
            dV = column.defaultVal;
        }
        str += ` DEFAULT ${dV}`
    }
    if(column.association) {
        str += ` REFERENCES ${column.association.table}(${column.association.mappedCol})`}

    if(column.checks) {
        column.checks.forEach(check => {
            str += ` CHECK ${check}`; 
        })
    }
    
    return str;

}

const createTable = (table_name: string, columns: Record<string, ModelColumn>, checks: string[] | undefined, 
    unique: string[][] | undefined, primaryKey: string[] | undefined, foreignKey: IForeignKey[] | undefined): string => {
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
        unique.forEach(el => {
            queryText += `UNIQUE(${el}),`
        })
    }

    // TABLE PRIMARY KEY
    if(primaryKey) {
        queryText += `PRIMARY KEY(${primaryKey}),`
    }

    // COMPOSITE FOREIGN KEYS
    if(foreignKey) {
        foreignKey.forEach(el => {
            queryText += `FOREIGN KEY (${el.columns}) REFERENCES ${el.table} (${el.mappedColumns}),`
        })
    }
    
    return queryText.slice(0, -1) + '); '; // remove the last comma
}

const alterTableError = (err: Error) => {
    console.error();
}

export const sync = async (overwrite = false) => {
    const [tableListObj] = await introspect();

    const modelArray = modelParser();

    let createTableQueries = ``;
    let alterTableQueries = ``;

    await enumSync();

    const db = await ConnectDb(); // db connection to send off alter and create queries
    for (const el of modelArray){
        // SQL statements for tables not currently in the database
        if(!tableListObj[String(el.table)]){
            // New Table Added in Model by User
            createTableQueries += createTable(String(el.table), el.columns, el.checks, el.unique, el.primaryKey, el.foreignKey);
        } else {
            const dbTableObj = tableListObj[String(el.table)];

            for(const colMA of Object.keys(el.columns)) {
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
                        let dV;
                        if(colObj.type === 'timestamp' && typeof colObj.defaultVal === 'string'){
                            dV = colObj.defaultVal.replaceAll(/\'|\"/g, '')
                            console.log(dV, 'dV')
                        } else {
                            dV = colObj.defaultVal;
                        }
                        alterTableQueries += `ALTER TABLE ${el.table} ALTER COLUMN ${colMA} `
                        alterTableQueries += colObj.defaultVal === null || 
                                                colObj.defaultVal === '' ? `DROP DEFAULT; ` : `SET DEFAULT ${dV}; `
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
                                if(typeof existingPK[0] === 'object' && existingPK[0] !== null && conQueryGuard(existingPK[0])){
                                    alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${existingPK[0].conname}; `
                                }
                                
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
                            if(typeof existingPK[0] === 'object' && existingPK[0] !== null && conQueryGuard(existingPK[0])) {
                                alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${existingPK[0].conname}; ` +
                                `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_pkey PRIMARY KEY (${colMA});`;
                            }
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
                        //console.log('association', el.table, colMA)
                        //console.log(colObj.association, dbColObj.association)

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
                        console.log(alterTableQueries)
                        await db.queryObject(alterTableQueries);
                        alterTableQueries = ``;
                    }
                }
        }
        // ADD TABLE CONSTRAINT LOGIC

        // CHECKS
        if(JSON.stringify(dbTableObj.checks) !== JSON.stringify(el.checks)){
            //console.log(String(dbTableObj.checks),  String(el.checks))
        }

        // UNIQUE
        if(String(dbTableObj.unique) !== String(el.unique)) { //TESTED
            const toAdd: string[] = [];
            const toRemove: string[] = [];

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
                    if(typeof uTables === 'object' && uTables !== null && conQueryGuard(uTables)){
                        alterTableQueries += `ALTER TABLE ${uTables.table_name} DROP CONSTRAINT ${uTables.conname} CASCADE`;
                    } 
                })
            } else if (el.unique) {
                const dbU = dbTableObj.unique.map(element => String(element));
                const modelU = el.unique.map(element => String(element));

                modelU.forEach(element => {
                    if(!dbU.includes(element)) toAdd.push(element);
                })

                if(toAdd.length){
                    toAdd.forEach(element => {
                        alterTableQueries += `ALTER TABLE ${el.table} ADD UNIQUE (${element.replace('[','(').replace(']', ')')}); `;
                    })
                }

                if(!overwrite) {
                    console.log('Cannot delete existing UNIQUE table constraints. Please re-run --db-sync with -x flag.')
                } else {
                    // REMOVE UNIQUES FROM DB
                    // dbU.forEach(element => {
                    //     if(!modelU.includes(element)) toRemove.push(element);
                    // })

                    // if(toRemove.length){
                    //     toRemove.forEach(async element => {
                    //         const results = await db.queryObject(tableUniqueQuery + ` AND pg_get_constraintdef(pg_constraint.oid) LIKE %(${element})%`);
                    //         console.log(results.rows)
                    //         //alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${} CASCADE; `;
                    //     })
                    // }
                }
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
                if(typeof existingPK[0] === 'object' && existingPK[0] !== null && conQueryGuard(existingPK[0])){
                    alterTableQueries += `ALTER TABLE ${el.table} DROP CONSTRAINT ${existingPK[0].conname}; ` +
                                    `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_pkey PRIMARY KEY (${el.primaryKey});`;
                }
            } else { // TESTED
             // No prior primary key just add the update
                alterTableQueries += `ALTER TABLE ${el.table} ADD CONSTRAINT ${el.table}_pkey PRIMARY KEY (${el.primaryKey});`
            }
        }
        }
    }
    console.log(createTableQueries, alterTableQueries)
    await db.queryObject(createTableQueries)
    //console.log(tableListObj)
    DisconnectDb(db);
}

// PRIMARY KEY WORK ON WHEN THERE ARE INTERCONNECTED DEPENDENCIES (WHEN A FOREIGN KEY REFERENCES THE PRIMARY KEY)
// CASCADE for unique - error handling for when there are dependencies and overwrite is false

// Following changes will not be implemented via sync: changing column types, the deletes of individual UNIQUE table constraints all would need to be
// deleted, the deltes of individual CHECKS all would need to be deleted
// Do no support tables with more than one composite foreign key for ALTER
// Sync will not handle composite keys, this should be done exclusively via association methods and introspection