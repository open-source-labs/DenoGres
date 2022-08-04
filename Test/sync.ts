import { assert, assertEquals, beforeEach, describe, it, afterAll, beforeAll } from './deps.ts';
import{ dbPull } from '../src/functions/dbPull.ts';
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import { sync } from '../src/functions/sync.ts';
import { enumQuery } from '../src/queries/introspection.ts'

interface IDBEnum {
    enum_schema: string,
    enum_name: string,
    enum_value: string
}

const dbEnumGuard = (record: object): record is IDBEnum => {
    return 'enum_schema' in record && 'enum_name' in record && 'enum_value' in record;
}

Deno.test('Sync/Enum/New', async () => {
    const db = await ConnectDb();
    await dbPull();

    Deno.writeTextFileSync('./models/model.ts', `export enum Weather {\nsunny,\ncloudy,\nrainy\n}\n`, { append: true})
    await sync();
    const dbEnum = await db.queryObject(enumQuery.slice(0, -1) + ` WHERE enum_name = 'weather';`); // retrieve new enum from db
    await db.queryObject('DROP type weather;'); // remove new enum from database
    //await DisconnectDb(db);
    assert(dbEnum.rows.length === 1);
    assert((typeof dbEnum.rows[0] === 'object' && dbEnum.rows[0] !== null && dbEnumGuard(dbEnum.rows[0])));
    assert(dbEnum.rows[0].enum_name === 'weather');
    assert(dbEnum.rows[0].enum_value === 'sunny, cloudy, rainy');

    DisconnectDb(db);
})