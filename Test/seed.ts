import {
  assertAlmostEquals,
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { Model } from "../src/class/Model.ts";
import * as denogres from '../models/model.ts'

Deno.test(function helloWorld3() {
  const test1: object = { 1: "a", 2: "b" };
  const test2: object = { 1: "a", 2: "b" };
  assertStrictEquals(test1, test2);
});

const people = denogres.Person;

console.log(await people.select('*').query());