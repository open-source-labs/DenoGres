import { CHAR_LINE_FEED } from "https://deno.land/std@0.141.0/path/_constants.ts";
import {
  assertAlmostEquals,
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
// import { Model } from "../src/class/Model.ts";
import * as denogres from "../models/model.ts";
import { ConnectDb, DisconnectDb } from "../src/functions/Db.ts";
import { Person } from "../models/model.ts";

Deno.test(async function helloWorld3() {
  const db = await ConnectDb(
    // * starwars
    // "postgres://obdwuryp:EcSMdYz0mPXGgiQSD4_8vLEYPjkHOJ5e@heffalump.db.elephantsql.com/obdwuryp",
  );

  // const Person = denogres.Person;

  // console.log("columns");
  // console.log(denogres.Person.columns);

  console.log(Person.columns);

  const person = new denogres.Person();

  console.log(Person.table);

  interface Person2 {
    _id: number;
    name: string;
    species_id: bigint;
    current_mood: string;
  }

  const people: Person2[] = [
    {
      name: "john",
      _id: 10,
      current_mood: "happy",
      species_id: BigInt(2),
    },
    {
      name: "david",
      _id: 12,
      current_mood: "happy",
      species_id: BigInt(2),
    },
    {
      name: "jessica",
      _id: 13,
      current_mood: "happy",
      species_id: BigInt(2),
    },
  ];

  let insertQuery = `INSERT INTO people `;
  let columns = `(`;
  let values = `(`;

  // for (const person of people) {
  //   for (const column in person) {
  //     columns += `${column}, `;
  //     values += `${person[column]}, `;
  //   }
  // }

  DisconnectDb(db);
});

// const people = denogres.Person;

// console.log(await people.select('*').query());
