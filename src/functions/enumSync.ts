import { enumParser } from './enumParser.ts';
import { ConnectDb, DisconnectDb } from './Db.ts';
import { enumQuery } from '../queries/introspection.ts';

interface IEnumRow {
    enum_schema: string,
    enum_name: string,
    enum_value: string
}

const enumRowGuard = (record: object): record is IEnumRow => {
    return 'enum_schema' in record && 'enum_name' in record && 'enum_value' in record;
}

// syncs changes made to enum types in model.ts with the database
export const enumSync = async () => {
    let enumCreateAlter = ``;

    const modelEnum = enumParser(); //* This runs through the model.ts file and returns an object with all enum types as keys, and their values as array of strings
    const db = await ConnectDb(); 

    const results = await db.queryObject(enumQuery);
    const dbEnum = results.rows; //* returns an array of objects with each object being an enumerable that matches the shape of IEnumRow

    interface IEnumObj {
        enum_schema: string,
        enum_value: string[]
    }

    const dbEnumObj: Record<string, IEnumObj> = {};

    //* Goes through the dbEnum array and creates an object with enum_schema and enum_value as keys and their respective names as values. 
    //* ie enum_name: species, enum_value: canine, feline
    dbEnum.forEach(el => {
        if(typeof el === 'object' && el !== null && enumRowGuard(el)){
            dbEnumObj[el.enum_name] = {enum_schema: el.enum_schema, enum_value: el.enum_value.split(/, */)};

            //* if enum in database doesn't exist on model, remove enum from database
            if(!modelEnum[el.enum_name]) { // TESTED
                enumCreateAlter += `DROP type ${el.enum_name} CASCADE; `
            } 
            else {
                //* If the enum object and the values from modelEnum do not align
                if(JSON.stringify(el) !== JSON.stringify(modelEnum[el.enum_name])) {
                    // if the db and model do not align determine what needs to change
                    // console.log('Stringify Failed');
                }
            }
        }
    })

    Object.keys(modelEnum).forEach(key => {
        // check if key is currently in db, if not add
        if(!Object.keys(dbEnumObj).includes(key)){
            // model enum not currently in database - add enum to database
            const enumList = "'" + modelEnum[key].join("','") + "'"
            enumCreateAlter += `CREATE type ${key} as enum (${enumList}); `
        } else {
            // both model and database contain the enum
            // if the database and model enum do not align
            if(JSON.stringify(modelEnum[key]) !== JSON.stringify(dbEnumObj[key].enum_value)){
                const tempDBEnumVal = dbEnumObj[key].enum_value;

                let deleteEnum = false;
                for(let i = 0; i < tempDBEnumVal.length; i++){
                    if(!modelEnum[key].includes(tempDBEnumVal[i])){
                        i = tempDBEnumVal.length;
                        deleteEnum = true;
                    }
                }

                const testModelArray: string[] = [];

                modelEnum[key].forEach(el => {
                    if(tempDBEnumVal.includes(String(el))){
                        testModelArray.push(String(el));
                    }
                })

                if(JSON.stringify(testModelArray) !== JSON.stringify(tempDBEnumVal)) {
                    deleteEnum = true;
                }

                if(deleteEnum){ // TESTED
                    const enumList = "'" + tempDBEnumVal.join("','") + "'";
                    enumCreateAlter += `DROP type ${key} CASCADE; CREATE type ${key} as enum (${enumList})`;
                } else { // TESTED
                    const rev = modelEnum[key].reverse();
                    rev.forEach((val, idx) => {
                        // if not currently in the enum add it
                        if(!tempDBEnumVal.includes(String(val))) {
                            if(idx === 0) {
                                enumCreateAlter += `ALTER TYPE ${key} ADD VALUE '${val}';`
                            } else {
                                enumCreateAlter += `ALTER TYPE ${key} ADD VALUE '${val}' BEFORE '${rev[idx - 1]}';`
                            }
                        }
                    })
                }
            }
        }
    })
    await db.queryArray(enumCreateAlter);
    DisconnectDb(db);
}

// DROPPING AN ENUM TYPE OR RE_SORTING EXISISTING VALUESRESULTS IN THE DROPPING AND
// RE_ADDING OF THE TABLE. DO NOT USE THE ORM TO COMPLETE THIS STYLE OF UPDATES
// IF IMPLICATION IS NOT COMPLETELY UNDERSTOOD