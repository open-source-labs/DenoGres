import { CHAR_LINE_FEED } from "https://deno.land/std@0.141.0/path/_constants.ts";
import {
  assertAlmostEquals,
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { Model } from "../src/class/Model.ts";
import { ConnectDb, DisconnectDb } from "../src/functions/Db.ts";
import * as denogres from "../models/model.ts";
import { Person } from "../models/model.ts";

Deno.test(async function insertQuery() {
  // const db = await ConnectDb(
  //   // * starwars
  //   // "postgres://obdwuryp:EcSMdYz0mPXGgiQSD4_8vLEYPjkHOJ5e@heffalump.db.elephantsql.com/obdwuryp",
  // );

  const desiredQuery = `
    INSERT INTO people (name, _id, species_id) VALUES ('john', '10', '2'), ('david', '12', '2'), ('jessica', '13', '2');
  `;

  // const random = denogres.Person.prototype;

  // interface Person2 {
  //   _id: number;
  //   name: string;
  //   species_id: bigint;
  //   current_mood: string;
  // }

  const people: any[] = [
    {
      name: "john",
      _id: 10,
      species_id: BigInt(2),
      current_mood: "sad",
    },
    {
      name: "david",
      _id: 12,
      species_id: BigInt(2),
      current_mood: "sad",
    },
    {
      name: "jessica",
      _id: 13,
      species_id: BigInt(2),
      current_mood: "sad",
    },
  ];

  // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
  // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
  // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
  // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();

  // for (let i = 0; i < people.length; i += 2) {
  //   denogres.Person.insert(`'name' = ${people[i].name}, '_id' = ${people[i].name}, 'species_id'`)
  // }

  // for (const person of people) {
  //   denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
  // }

  let columns = "";

  for (const column in people[0]) {
    columns += `${column}, `;
  }

  columns = columns.slice(0, columns.length - 2);

  let insertQuery = `INSERT INTO ${denogres.Person.table} (${columns}) VALUES `;

  let value;
  let values = "";

  for (const person of people) {
    value = "(";
    for (const key in person) {
      value += `'${person[key]}', `;
    }
    value = value.slice(0, value.length - 2) + "), ";
    values += value;
  }

  // console.log(columns, values);

  values = values.slice(0, values.length - 2) + ";";

  // console.log(values);

  insertQuery += values;

  // console.log("final insertQuery");

  // console.log(insertQuery);

  console.log(insertQuery);

  console.log("DQuery:", desiredQuery.replace(/\s/gm, ""));

  console.log("IQuery:", insertQuery.replace(/\s/gm, ""));

  assertEquals(
    desiredQuery.replace(/\s/gm, ""),
    insertQuery.replace(/\s/gm, ""),
  );
  // DisconnectDb(db);
});

// const people = denogres.Person;

// console.log(await people.select('*').query());
