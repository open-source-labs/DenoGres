import {
  assertAlmostEquals,
  assertEquals,
  assertNotEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { Model } from "../src/class/Model.ts";
import { ConnectDb, DisconnectDb } from "../src/functions/Db.ts";
import { sqlDataTypes } from "../src/constants/sqlDataTypes.ts";
import { resolve } from "https://deno.land/std@0.141.0/path/mod.ts";

Deno.test(function modelParser() {
  let data = Deno.readTextFileSync("./Test/modelParser2Test.ts");

  // console.log(data);

  // console.log(data.replace(/\s*/g, ""));
  data = data.replace(/\s*/g, "");
  const array: any = data.match(/class\w+extendsModel\S*/g);

  console.log(array);
  console.log(array[0]);

  // const tableNames: any = data.match(/(const|let|var)\s\w+:/g);

  // console.log(tableNames);

  // for (let i = 0; i < tableNames.length; i++) {
  //   tableNames[i] = tableNames[i].replace(/(const|let|var)\s(\w+)\:/g, "$2");
  // }
});
