import { assert, assertEquals, beforeEach, describe, it, afterAll, beforeAll } from './deps.ts';
import{ dbPull } from '../src/functions/dbPull.ts';
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import { sync } from '../src/functions/sync.ts';
import { introspect } from '../src/functions/introspect.ts'
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
    assert(dbEnum.rows.length === 1, '1 Row');
    assert((typeof dbEnum.rows[0] === 'object' && dbEnum.rows[0] !== null && dbEnumGuard(dbEnum.rows[0])), 'All Proper Columns');
    assert(dbEnum.rows[0].enum_name === 'weather', 'Weather enum');
    assert(dbEnum.rows[0].enum_value === 'sunny, cloudy, rainy', 'Enum Values' + dbEnum.rows[0].enum_value);

    DisconnectDb(db);
})

const newTableStr = 
`export interface TestTable {
    _id: number,
    username: string
}
export class TestTable extends Model {
    static table: 'testtable';
    static columns: {
        _id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: 'varchar',
            notNull: true,
            unique: true,
            length: 16
        }
    }
}
export interface Invoice {
    invoice_id: number,
    store_id: number,
    customer_id: number
}
export class Invoice extends Model {
    static table: 'invoice';
    static columns: {
        invoice_id: {
            type: 'integer';
            autoIncrement: true,
        },
        store_id: {
            type: 'integer',
            autoIncrement: true
        },
        customer_id: {
            type: 'integer',
            autoIncrement: true
        }
    }
    static primaryKey: ['invoice_id', 'store_id']
}
export interface PayMe {
    invoice_id: number,
    store_id: number,
    customer_id: number
}
export class PayMe extends Model {
    static table: 'PayMe';
    static columns: {
        payment_id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        invoice_id: {
            type: 'integer',
            autoIncrement: true
        },
        store_id: {
            type: 'integer',
            autoincrement: true
        },
        payment_date: {
            type: 'timestamp',
            defaultVal: 'NOW()'
        },
        payment_amount: {
            type: 'integer',
        }
    }
    static foreignKey: [{columns: ['invoice_id', 'store_id'], mappedColumns: ['invoice_id', 'store_id'], table: 'invoice'}]
}`;

Deno.test('Sync/Table/Create', async () => {
    const db = await ConnectDb();
    await dbPull();

    Deno.writeTextFileSync('./models/model.ts', newTableStr, { append: true})
    await sync();
    const [tableObj] = await introspect();
    await db.queryObject('DROP TABLE testtable; DROP table payme; DROP table invoice'); // remove new enum from database

    const id = tableObj.testtable.columns._id;
    const username = tableObj.testtable.columns.username;
    const payment = tableObj.payme;
    const invoice = tableObj.invoice;
    //await DisconnectDb(db);
    assert(Object.keys(tableObj.testtable.columns).length === 2);
    assert(id);
    assert(username);
    assert(id.primaryKey);
    assert(id.autoIncrement);
    assert(username.notNull);
    assert(username.unique);
    assert(username.length === 16);
    assertEquals(invoice.primaryKey, ['invoice_id', 'store_id'], String(invoice.primaryKey));
    assert(payment.columns.payment_date.defaultVal === 'now()', `defaultVal: ${payment.columns.payment_date.defaultVal}`)
    assertEquals(payment.foreignKey, [{columns: ['invoice_id', 'store_id'], mappedColumns: ['invoice_id', 'store_id'], table: 'invoice'}])

    DisconnectDb(db);
})

// const checksTableStr = 
// `export interface RandomPerson {

// }
// export class RandomPerson extends Model {
//     static table: 'randompeople';
//     static columns: {
//         avg_mood: {
//             type: 'enum',
//             enumName: 'mood'
//         },
//         person_id: {
//             type: 'integer',
//             primaryKey: true,
//             autoIncrement: true
//         }
//     }
// }`;

// Deno.test('Sync/Table/Create', async () => {
//     const db = await ConnectDb();
//     await dbPull();

//     Deno.writeTextFileSync('./models/model.ts', checksTableStr, { append: true})
//     await sync();
//     const [tableObj] = await introspect();
//     await db.queryObject('DROP TABLE testtable; DROP table payme; DROP table invoice'); // remove new enum from database

//     const id = tableObj.testtable.columns._id;
//     const username = tableObj.testtable.columns.username;
//     const payment = tableObj.payme;
//     const invoice = tableObj.invoice;
//     //await DisconnectDb(db);
//     assert(Object.keys(tableObj.testtable.columns).length === 2);
//     assert(id);
//     assert(username);
//     assert(id.primaryKey);
//     assert(id.autoIncrement);
//     assert(username.notNull);
//     assert(username.unique);
//     assert(username.length === 16);
//     assertEquals(invoice.primaryKey, ['invoice_id', 'store_id'], String(invoice.primaryKey));
//     assert(payment.columns.payment_date.defaultVal === 'now()', `defaultVal: ${payment.columns.payment_date.defaultVal}`)
//     assertEquals(payment.foreignKey, [{columns: ['invoice_id', 'store_id'], mappedColumns: ['invoice_id', 'store_id'], table: 'invoice'}])

//     DisconnectDb(db);
// })