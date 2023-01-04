import {
  afterAll,
  assert,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "./deps.ts";
import { dbPull } from "../src/functions/dbPull.ts";
import { ConnectDb, DisconnectDb } from "../src/functions/Db.ts";
// ! Used to be { sync } which referred to the previous version of sync
import sync from "../src/functions/sync.ts";
import { introspect } from "../src/functions/introspect.ts";
import { enumQuery } from "../src/queries/introspection.ts";

interface IDBEnum {
  enum_schema: string;
  enum_name: string;
  enum_value: string;
}

const dbEnumGuard = (record: object): record is IDBEnum => {
  return "enum_schema" in record && "enum_name" in record &&
    "enum_value" in record;
};

Deno.test("Sync/Enum/New", async () => {
  const db = await ConnectDb();
  await dbPull();

  Deno.writeTextFileSync(
    "./models/model.ts",
    `export enum Weather {\nsunny,\ncloudy,\nrainy\n}\n`,
    { append: true },
  );
  await sync();
  const dbEnum = await db.queryObject(
    enumQuery.slice(0, -1) + ` WHERE enum_name = 'weather';`,
  ); // retrieve new enum from db
  await db.queryObject("DROP type weather;"); // remove new enum from database
  //await DisconnectDb(db);
  assert(dbEnum.rows.length === 1, "1 Row");
  assert(
    typeof dbEnum.rows[0] === "object" && dbEnum.rows[0] !== null &&
      dbEnumGuard(dbEnum.rows[0]),
    "All Proper Columns",
  );
  assert(dbEnum.rows[0].enum_name === "weather", "Weather enum");
  assert(
    dbEnum.rows[0].enum_value === "sunny, cloudy, rainy",
    "Enum Values" + dbEnum.rows[0].enum_value,
  );

  await DisconnectDb(db);
});

const newTableStr = `export interface TestTable {
    _id: number,
    username: string
}
export class TestTable extends Model {
    static table = 'testtable';
    static columns = {
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
    static table = 'invoice';
    static columns = {
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
    static primaryKey = ['invoice_id', 'store_id']
}
export interface PayMe {
    invoice_id: number,
    store_id: number,
    customer_id: number
}
export class PayMe extends Model {
    static table = 'PayMe';
    static columns = {
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
    static foreignKey = [{columns: ['invoice_id', 'store_id'], mappedColumns: ['invoice_id', 'store_id'], table: 'invoice'}]
}`;

Deno.test("Sync/Table/Create", async () => {
  const db = await ConnectDb();
  await dbPull();

  Deno.writeTextFileSync("./models/model.ts", newTableStr, { append: true });
  await sync();
  const [tableObj] = await introspect();
  await db.queryObject(
    "DROP TABLE testtable; DROP table payme; DROP table invoice",
  ); // remove new enum from database

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
  assertEquals(
    invoice.primaryKey,
    ["invoice_id", "store_id"],
    String(invoice.primaryKey),
  );
  assert(
    payment.columns.payment_date.defaultVal === "'now()'",
    `defaultVal: ${payment.columns.payment_date.defaultVal}`,
  );
  assertEquals(payment.foreignKey, [{
    columns: ["invoice_id", "store_id"],
    mappedColumns: ["invoice_id", "store_id"],
    table: "invoice",
  }]);

  await DisconnectDb(db);
});

const checksTableStr = `export interface Zipcode {
    zipcode: number
    state: string
}
export class Zipcodetable extends Model {
    static table = 'zipcode_table';
    static columns = {
        zipcode: {
            type: 'integer'
            primaryKey: true
        },
        state: {
            type: 'varchar'
        }
    }
    static checks = ['zipcode >= 0', 'zipcode <= 99999']
}
export interface RandomPerson {
    avg_mood: keyof typeof Mood
    person_id: number
}
export class RandomPerson extends Model {
    static table = 'randompeople';
    static columns = {
        avg_mood: {
            type: 'enum',
            enumName: 'mood'
        },
        person_id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true
        },
        zipcode: {
            type: 'integer',
            checks: ['zipcode >= 0', 'zipcode <= 99999'],
            association: { table: 'zipcode_table', mappedCol: 'zipcode'}
        }
    }
}
`;

Deno.test("Sync/Table/Create - Checks, Association, Enum Type", async () => {
  const db = await ConnectDb();
  await dbPull();

  Deno.writeTextFileSync("./models/model.ts", checksTableStr, { append: true });
  await sync();
  const [tableObj] = await introspect();
  await db.queryObject("DROP TABLE randompeople; DROP table zipcode_table;"); // remove new enum from database

  const zip = tableObj.zipcode_table;
  const rando = tableObj.randompeople;
  //await DisconnectDb(db);
  assert(zip);
  assert(rando);
  assertEquals(rando.columns.zipcode.association, {
    table: "zipcode_table",
    mappedCol: "zipcode",
  });
  //assert(rando.columns.avg_mood.type === 'enum: mood');
  assert(
    rando.checks.includes("(zipcode >= 0)"),
    String(rando.columns.zipcode.checks),
  );
  assert(rando.checks.includes("(zipcode <= 99999)"));
  assert(zip.checks.includes("(zipcode >= 0)"));
  assert(zip.checks.includes("(zipcode <= 99999)"));

  await DisconnectDb(db);
});

const uniqueTableStr = `export interface RandomPerson {
    avg_mood: keyof typeof Mood
    person_id: number
}
export class RandomPerson extends Model {
    static table = 'randompeople';
    static columns = {
        avg_mood: {
            type: 'enum',
            enumName: 'mood'
        },
        person_id: {
            type: 'integer',
            autoIncrement: true
        },
    }
    static unique = [['avg_mood', 'person_id']]
}
`;

Deno.test("Sync/Table/Create - Unique", async () => {
  const db = await ConnectDb();
  await dbPull();

  Deno.writeTextFileSync("./models/model.ts", uniqueTableStr, { append: true });
  await sync();
  const [tableObj] = await introspect();
  await db.queryObject("DROP TABLE randompeople; "); // remove new enum from database

  const rando = tableObj.randompeople;
  //await DisconnectDb(db);
  assert(rando.unique);
  assert(rando.unique.length === 1);
  assertEquals(rando.unique[0], ["avg_mood", "person_id"]);

  await DisconnectDb(db);
});
