const modelText = Deno.readTextFileSync('./models/model.ts');

const cleanedText = modelText.replaceAll(/export interface \w+ {[\n +\w+: \w+]+}/g, '').
        // replaceAll(/ +static +/g, ''). // static
        //replaceAll(/export class \w+ extends Model/g, ''). // class boilerplate
        replaceAll("import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'\n", ''). // initial wording
        replaceAll(/\/\/ user model definition comes here\n+/g, '').
        replaceAll(/\n */g, '')

const parsedArray: Record<string, unknown>[] = [];
const tableArray: string[] = cleanedText.split(/export class \w+ extends Model */g)

if(tableArray[0] === '') tableArray.shift();
tableArray.forEach((el)=> {
    const tableObj: Record<string, unknown> = {};
    // split on each static so that each array is its own sub-array
    const props = el.split(/{* *static */);
    if(props[0] === '') props.shift();

    props.forEach(prop => {
        if(prop.slice(0, 5) === 'table') {
            let updatedString = prop.replace(/table *: */, '') // remove known property
            
            // table property: add table property to obj
            const quote = updatedString[0];
            let propertyValue = '';
            let i = 1;

            while(i < updatedString.length){
                if(updatedString[i] === quote) {
                    i = updatedString.length
                    updatedString = updatedString.replace(quote + propertyValue + quote, '');
                } else {
                    propertyValue += updatedString[i];
                    i++;
                }
            }

            tableObj.table = propertyValue;

        } else if(prop.slice(0, 7) === 'columns'){
            const columnsObj: Record<string, unknown> = {};
            const colText = prop.replace(/columns: *{ */, '').replace(/\}$/, '')

            const columnsArray = colText.split(/\}\,(?!association)/)
            if(columnsArray.slice(-1)[0] === '}') columnsArray.pop();

            columnsArray.forEach(column => {
                const colNameIndex = column.indexOf(':')
                let colInfo = column.slice(colNameIndex + 1).replace(/^\{|/, '');
                colInfo = colInfo.replace(/^ *\{ */, '');

                let entered = true ;

                while(colInfo.length && entered) {
                    entered = false;

                    let property;
                    let quote;

                    if(colInfo.slice(0, 5) === 'type:') {
                        entered = true;

                        colInfo = colInfo.replace(/type: */, '')
                        property = 'type';

                        quote = colInfo[0];
                        colInfo = colInfo.slice(1);
    
                        const idx = colInfo.indexOf(quote);
                        columnsObj[property] = colInfo.slice(0, idx);
                        colInfo = colInfo.slice(idx + 1);
                        colInfo = colInfo.replace(/\,* *\}* */, '')
                    }

                    if(colInfo.slice(0, 11) === 'primaryKey:') {
                        if(!entered) entered = true;

                        colInfo = colInfo.replace(/primaryKey: */, '');
                        property = 'primaryKey';

                        columnsObj[property] = colInfo.slice(0, 4) === 'true';
                        colInfo = colInfo.slice(5).replace(/\,* *\}* */, '');
                    }

                    if(colInfo.slice(0, 8) === 'notNull:') {
                        if(!entered) entered = true;

                        colInfo = colInfo.replace(/notNull: */, '');
                        property = 'notNull';

                        columnsObj[property] = colInfo.slice(0, 4) === 'true';
                        colInfo = colInfo.slice(5).replace(/\,* *\}* */, '');
                    }

                    if(colInfo.slice(0, 7) === 'unique:') {
                        if(!entered) entered = true;

                        colInfo = colInfo.replace(/unique: */, '');
                        property = 'unique';

                        columnsObj[property] = colInfo.slice(0, 4) === 'true';
                        colInfo = colInfo.slice(5).replace(/\,* *\}* */, '');
                    }

                    if(colInfo.slice(0, 7) === 'checks:') {
                        if(!entered) entered = true;

                        colInfo = colInfo.replace(/checks: *\[ */, '');

                        const value = colInfo.split(/(?=\")]/, 1)[0].
                            split(/\' *, *\'|\" *, *\"/).
                            map(element => element.replaceAll(/^\"\(|^\'\(/g, '(').replaceAll(/\)\"|\)\'/g, ')'));

                        property = 'checks';

                        columnsObj[property] = value;
                        colInfo = colInfo.replace(/[\W\w]+ *\] *\,|[\W\w]+ *\] *\,*\}/, '');
                            
                    }

                    if(colInfo.slice(0, 11) === 'defaultVal:') {
                        if(!entered) entered = true;

                        colInfo = colInfo.replace(/defaultVal: */, '');
                        const value = colInfo.split(/,(?=[A-Za-z]+\:|,* *\})/)[0];
                        colInfo = colInfo.replace(value, '');

                        let transformValue: unknown;

                        if(columnsObj.type === 'boolean'){
                            transformValue = Boolean(value);
                        } else if(['int', 'int2', 'int4', 'int8', 'numeric', 'smallint', 'integer', 'bigint', 'float', 'float4', 'float8'].includes(columnsObj.type)) {
                            transformValue = Number(value);
                        }

                        property = 'defaultVal';

                        columnsObj[property] = transformValue;
                        colInfo = colInfo.replace(/[\W\w]* *\] *\,|[\W\w]+ *\] *\,*\}/, '');
                            
                    }

                    if(colInfo.slice(0, 14) === 'autoIncrement:') {
                        if(!entered) entered = true;

                        colInfo = colInfo.replace(/autoIncrement: */, '');
                        property = 'autoIncrement';

                        columnsObj[property] = colInfo.slice(0, 4) === 'true';
                        colInfo = colInfo.slice(5).replace(/\,* *\}* */, '');
                    }

                    if(colInfo.slice(0, 12) === 'association:') {
                        if(!entered) entered = true;

                        colInfo = colInfo.replace(/association: */, '');
                        property = 'association';

                        colInfo = colInfo.replace(/\{ *table: */, '');
                        const tableVal = colInfo.split(/\, *mappedCol\: */)[0].replaceAll(/^\'|^\"|\'$|\"$/g, '');
                        colInfo = colInfo.replace(tableVal, '').replace(/\'\'|\"\"/, '');
                        colInfo = colInfo.replace(/\, *mappedCol\: */, '')

                        const mappedColVal = colInfo.split(/\,* *\} */)[0].replaceAll(/^\'|^\"|\'$|\"$/g, '');
                        colInfo = colInfo.replace(mappedColVal, '').replace(/\'\'|\"\"/, '').replace(/ *} */, '');

                        columnsObj[property] = {table: tableVal, mappedCol: mappedColVal};
                    }

                }
            })

            tableObj.columns = columnsObj;
        }
        
        if(prop.slice(0, 6) === 'checks') {
            const checksArray = prop.replace(/checks: */, '').replaceAll(/^\[|\]}$|\]\$/g, '').split(/\' *, *\'|\" *, *\"/);
            tableObj.checks = checksArray.map(element => element.replaceAll(/^\"\(|^\'\(/g, '(').replaceAll(/\)\"|\)\'/g, ')'));
        } else if(prop.slice(0, 10) === 'primaryKey') {
            const pkArray = prop.replace(/ *primaryKey: *\[/, '').replace(/\]$|\]\}$/, '').split(",");
            tableObj.primaryKey = pkArray.map(element => element.replaceAll(/^\"|^\'/g, '').replaceAll(/\"|\'/g, ''));
        } else if(prop.slice(0, 6) === 'unique') {
            const uArray = prop.replace(/ *unique: *\[/, '').replace(/\]$|\]\}$/, '').split(/\] *, *\[/);
            tableObj.unique = uArray.map(element => element.replaceAll(/^\[|\]$/g, '').replaceAll('"', '').split(','));
        } else if (prop.slice(0, 10) === 'foreignKey') {
            const fkObj = prop.replaceAll(/ *foreignKey: *\[ *\{|\}\]\}*$/g, '');
            const fkArray = fkObj.split(/\} *\, *\{/);
            
            fkArray.forEach(elFK => {
                const elFKArray = elFK.split(/\, *(?=[A-Za-z]+\:)/);

                console.log(elFKArray)
            })
        }
    })

    parsedArray.push(tableObj)
})

//console.log(tableArray, tableArray.length)
console.log(parsedArray)
//console.log(cleanedText)