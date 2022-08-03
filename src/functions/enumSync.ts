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

export const enumSync = async () => {
    let enumCreateAlter = ``;

    const modelEnum = enumParser();
    const db = await ConnectDb();

    const results = await db.queryObject(enumQuery);
    const dbEnum = results.rows;

    console.log('model', modelEnum, 'db', dbEnum)
    dbEnum.forEach(el => {
        if(typeof el === 'object' && el !== null && enumRowGuard(el)){
            if(!modelEnum[el.enum_name]) { // TESTED
                enumCreateAlter += `DROP type ${el.enum_name}; `
            } else {
                // compare the enums structure to determine if updates are needed
                const dbEnumArray = el.enum_value.split(/, */);
                if(JSON.stringify(el) !== JSON.stringify(modelEnum[el.enum_name])) {
                    // if the db and model do not align determine what needs to change
                }
            }
        }
    })

    Object.keys(modelEnum).forEach(key => {
        // check if key is currently in db, if not add
        const contains = false;
        dbEnum.forEach(elDB => {
            if(typeof elDB === 'object' && elDB !== null && 
                enumRowGuard(elDB) && elDB.enum_name === key) {
                }
        })
    })

    DisconnectDb(db);
    console.log(enumCreateAlter)
}

enumSync()