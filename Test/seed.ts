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

Deno.test(async function helloWorld3() {
  const db = await ConnectDb(
    // * starwars
    // "postgres://obdwuryp:EcSMdYz0mPXGgiQSD4_8vLEYPjkHOJ5e@heffalump.db.elephantsql.com/obdwuryp",
  );

  const people = [
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

  let insertQuery = `INSERT INTO ${denogres.Person.table} (${Object.keys(denogres.Person.columns)}) VALUES `;
  // let columns = `(`;
  let values = ``;

  console.log('insertQuery', insertQuery);

  // for (const column in denogres.Person.columns) {
  //   console.log('column in denogres.PErson.columns', column);
  //   columns += `${column}, `;
  // }

  for (const person of people) {
    values += `(${Object.values(person)}), `;
  }

  // console.log(columns, values);

  values = values.slice(0, values.length - 2) + ';';

  console.log(values);

  insertQuery += values;

  console.log('final insertQuery', insertQuery);


  DisconnectDb(db);
});

// const people = denogres.Person;

// console.log(await people.select('*').query());
