import {
  assertAlmostEquals,
  assertEquals,
  assertNotEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { Model } from "../src/class/Model.ts";
import { ConnectDb, DisconnectDb } from "../src/functions/Db.ts";
import * as denogres from "../models/model.ts";
import { Person } from "../models/model.ts";
import { sqlDataTypes } from "../src/constants/sqlDataTypes.ts";
import { resolve } from "https://deno.land/std@0.141.0/path/mod.ts";

const sampleData: any[] = [
  {
    name: "john",
    _id: 10,
    species_id: BigInt(2),
  },
  {
    name: "david",
    _id: 12,
    species_id: BigInt(2),
  },
  {
    name: "jessica",
    _id: 13,
    species_id: BigInt(2),
  },
];

const sampleTableName = "people";

Deno.test(
  async function insertQuery(
    data: any = sampleData,
    tableName: string = sampleTableName,
  ): Promise<void> {
    // const db = await ConnectDb(
    //   // * starwars
    //   // "postgres://obdwuryp:EcSMdYz0mPXGgiQSD4_8vLEYPjkHOJ5e@heffalump.db.elephantsql.com/obdwuryp",
    // );

    const expectedInsertQuery = `
    INSERT INTO ${sampleTableName} (name, _id, species_id) VALUES ('john', '10', '2'), ('david', '12', '2'), ('jessica', '13', '2');
  `;

    // interface Person2 {
    //   _id: number;
    //   name: string;
    //   species_id: bigint;
    //   current_mood: string;
    // }

    // const people: any[] = [
    //   {
    //     name: "john",
    //     _id: 10,
    //     species_id: BigInt(2),
    //   },
    //   {
    //     name: "david",
    //     _id: 12,
    //     species_id: BigInt(2),
    //   },
    //   {
    //     name: "jessica",
    //     _id: 13,
    //     species_id: BigInt(2),
    //   },
    // ];

    // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
    // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
    // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
    // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();

    let columns = "";

    for (const column in sampleData[0]) {
      columns += `${column}, `;
    }

    columns = columns.slice(0, columns.length - 2);

    let insertQuery = `INSERT INTO ${sampleTableName} (${columns}) VALUES `;

    let value;
    let values = "";

    for (const datum of sampleData) {
      value = "(";
      for (const key in datum) {
        value += `'${datum[key]}', `;
      }
      value = value.slice(0, value.length - 2) + "), ";
      values += value;
    }

    // console.log(columns, values);

    values = values.slice(0, values.length - 2) + ";";

    // console.log(values);
    //
    insertQuery += values;

    // console.log("final insertQuery");

    // console.log(insertQuery);

    // console.log(insertQuery);

    // console.log("DQuery:", expectedInsertQuery.replace(/\s/gm, ""));

    // console.log("IQuery:", insertQuery.replace(/\s/gm, ""));

    assertEquals(
      expectedInsertQuery.replace(/\s/gm, ""),
      insertQuery.replace(/\s/gm, ""),
    );
    // DisconnectDb(db);
  },
);

// const people = denogres.Person;

// console.log(await people.select('*').query());

Deno.test(async function createTableQuery(
  // data: Array<Object> = sampleData,
  // tableName: string = sampleTableName,
): Promise<void> {
  const expectedCreateTableQuery = `
    CREATE TABLE IF NOT EXISTS people
    (
      _id int4 NOT NULL PRIMARY KEY DEFAULT nextval('people__id_seq'::regclass),
      name varchar NOT NULL,
      species_id int8 NOT NULL
    );
  `;

  let createTableQuery =
    `CREATE TABLE IF NOT EXISTS ${denogres.Person.table} (`;

  const people: any[] = [
    {
      name: "john",
      _id: 10,
      species_id: BigInt(2),
    },
    {
      name: "david",
      _id: 12,
      species_id: BigInt(2),
    },
    {
      name: "jessica",
      _id: 13,
      species_id: BigInt(2),
    },
  ];

  let constraints = "";

  const columns: any = denogres.Person.columns;

  const associations = [];

  // type sqlDataTypes = { [key: string]: string };

  for (const column in columns) {
    const sqlType: string = sqlDataTypes[columns[column].type];

    // console.log(typeof columns[column].type);

    createTableQuery += `${column} ${columns[column].type}`;
    for (const constraint in columns[column]) {
      switch (constraint) {
        case "association": {
          associations.push({
            columnName: column,
            table: columns[column].association?.table,
            mappedCol: columns[column].association?.mappedCol,
          });
          break;
        }
        case "primaryKey": {
          constraints += " PRIMARY KEY";
          break;
        }
        case "notNull": {
          constraints += " NOT NULL";
          break;
        }
        case "unique": {
          constraints += " UNIQUE";
          break;
        }
        case "defaultVal": {
          constraints += ` DEFAULT ${columns[column].defaultVal}`;
          break;
        }
        case "autoIncrement": {
          constraints +=
            `DEFAULT nextval('${denogres.Person.table}_${column}_seq'::regclass)`;
          break;
        }
        default: {
          break;
        }
      }
    }
    createTableQuery += `${constraints}, `;
    constraints = "";
  }

  createTableQuery = createTableQuery.slice(0, createTableQuery.length - 2) +
    ");";

  // console.log("EXPECTED QUERY");
  // console.log(expectedCreateTableQuery);

  // console.log("CREATE TABLE QUERY");
  // console.log(createTableQuery);

  assertEquals(
    expectedCreateTableQuery.replace(/\s/gm, ""),
    createTableQuery.replace(/\s/gm, ""),
  );

  // console.log(denogres.Person.columns);
});

Deno.test(async function denoFormat() {
  const modelTS = Deno.readTextFileSync("./models/model.ts");

  // console.log(modelTS);

  // const regex = new RegExp(
  //   /export class \w+ extends Model {((\s*\w+.*)+(\s*},))+(\s*};)/g,
  // );

  // const regex2 = new RegExp(
  //   /export class \w+ extends Model {((\s*\w+.*)+(\s*},))+[\s|;|}]*}$/g,
  // );

  //

  // const models: any = modelTS.match(regex2);

  // console.log(readModel);
  // console.log(after);

  // console.log("models:", models);
  // console.log("models length:", models?.length);

  // console.log("models[0]", models[0]);

  // console.log(models);
  // console.log(models[1]);
  // console.log(before === readModel);

  const secondMethod = modelTS.replace(/\s*/g, "");

  console.log(modelTS.replace(/\s*/g, ""));

  const test = secondMethod.match(/export class(.*)(,},};})$/g);

  console.log(test);

  // replaceAll(/export enum \w+ {[\n *\w+\,*]+}/g, '') // remove enums for now, will need different logic to parse these
});
