import { sqlDataTypes } from '../constants/sqlDataTypes.ts';

import { createClassName } from '../functions/StringFormat.ts'

import { introspect } from './introspect.ts'


export async function dbPull() {
    const [tableListObj, enumObj] = await introspect();
    // const tableListObj = await introspect();
    console.log('Table List Obj', tableListObj)

    let autoCreatedModels = `import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'\n// user model definition comes here\n\n`;

    // iterate over the properties of tableListObj
    Object.keys(tableListObj).forEach(el => {
        // reference to table object
        const tableObj = tableListObj[el];
        // create the class name
        const className = createClassName(el);
        // initialize interface code holder
        let interfaceCode = `\nexport interface ${className} {\n`;
        // initialize class code holder
        let classCode =`export class ${className} extends Model {\n` +
        `  static table: '${el}';\n` +
        `  static columns: {\n`;

        // iterate over each property within the columns object
        Object.keys(tableListObj[el].columns).forEach(colName => {
            const columnObj = tableListObj[el].columns[colName];
            // add the column as a property to the interface, checking for enums first
            if (columnObj.type.includes('enum:')){
                const enumName = columnObj.type.replaceAll('enum: ', '');
                const enumCapitalized = enumName[0].toUpperCase() + enumName.substring(1);
                interfaceCode += `  ${colName}: keyof typeof ${enumCapitalized}\n` 
            } else {
            interfaceCode += `  ${colName}: ${sqlDataTypes[columnObj.type]}\n`;
            }
            // add the column as a property to the class, remove enum column name if enum type is found
            if (columnObj.type.includes('enum:')){
                classCode += `    ${colName}: {\n` +
            `      type: 'enum',\n`
            } else {    
            classCode += `    ${colName}: {\n` +
            `      type: '${columnObj.type}',\n`
            }
            // for each 'property' of the column add it to the object
            if(columnObj.length) classCode += `      length: ${columnObj.length}\n`;
            if (columnObj.notNull) classCode += `      notNull: true,\n`;
            if (columnObj.primaryKey) classCode += `      primaryKey: true,\n`;
            if (columnObj.unique) classCode += `      unique: true,\n`;
            if (columnObj.checks) classCode += `      check: [${columnObj.checks}]`
            if (columnObj.defaultVal) classCode += `      defaultVal: ${columnObj.defaultVal}`;
            if (columnObj.autoIncrement) classCode += `      autoIncrement: true,\n`;
            if (columnObj.association) {
                classCode += `      association: {\n` +
                `        table: '${columnObj.association.table}',\n` +
                `        mappedCol: '${columnObj.association.mappedCol}',\n      }\n`;
            }
            // close the column obj
            classCode += `    },\n`
        })
        
        // close the interface and class code
        interfaceCode += `}\n\n`;
        classCode += `  }\n`
        // add the interface and class code to the autoCreatedModels string
        autoCreatedModels += interfaceCode + classCode;
        // for each table constraint add as properties onto the autoCreatedModels query
        if(tableObj.checks.length > 0) autoCreatedModels += `  static checks: ${JSON.stringify(tableObj.checks)}\n`
        if(tableObj.unique) autoCreatedModels += `  static unique: ${JSON.stringify(tableObj.unique)}\n`
        if(tableObj.primaryKey) {
          autoCreatedModels += `  static primaryKey: ${JSON.stringify(tableObj.primaryKey)}\n`
        }
        if(tableObj.foreignKey) {
            autoCreatedModels += `  static foreignKey: [`

            tableObj.foreignKey.forEach((fkObj, idx) => {
                const delimiter = idx === 0 ? '' : ', ';

                autoCreatedModels += `${delimiter}\n    {columns: ${JSON.stringify(fkObj.columns)}, mappedColumns: ${JSON.stringify(fkObj.mappedColumns)}, table: '${fkObj.table}'}`;
            })

            autoCreatedModels +=`]\n`
        }
        // close the query for this table
        autoCreatedModels += `}\n\n`
    })
    // Add all enums from enum object 
    Object.keys(enumObj).forEach(el => {
        const enumCapitalized = el[0].toUpperCase() + el.substring(1);
        autoCreatedModels += `export enum ${enumCapitalized} {\n`;
        enumObj[el].forEach(str => {
            autoCreatedModels += `${str},\n`
        })
        autoCreatedModels += `}\n\n`;
    })
    // Create the model.ts file
    Deno.writeTextFileSync('./models/model.ts', autoCreatedModels);
}

