import { modelParser } from "../src/functions/modelParser.ts";

import { introspect } from "../src/functions/introspect.ts";

import { sync } from '../src/functions/sync.ts'

// const modelText = Deno.readTextFileSync("./models/model.ts");

// const cleanedText = modelText
//   .replaceAll(
//     /export interface \w+ *\{[\n* *.*: \w+,*]+\}/g,
//     "",
//   )
//   .replaceAll(
//     "import { Model } from 'https://deno.land/x/denogres/mod.ts'\n",
//     "",
//   )
//   // initial wording
//   .replaceAll(/\/\/ user model definition comes here\n+/g, "")
//   .replaceAll(/\n */g, "")
//   .replaceAll(/export enum \w+ {[\n *\w+\,*]+}/g, ""); // remove enums for now, will need different logic to parse these

// const tableArray: string[] = cleanedText.split(
//   /export class \w+ extends Model */g,
// );

// console.log(modelText);

// console.log(cleanedText);

// console.log(tableArray);

// let test: any = modelText.match(
//   /export class \w+ extends Model {\n(\w+)\n\n\n/g,
// );

// test = modelText.replace(/export class \w+ extends Model(.*)\n\n$/g, "$1");

// console.log(test);

// let test2: any = "hello World".replace(/(hello)/, "$1$1");

// console.log(test2);

// sync();

await sync();




