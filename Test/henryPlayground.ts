import { modelParser } from "../src/functions/modelParser.ts";

import { getDbData, introspect } from "../src/functions/introspect.ts";

import { sync } from "../src/functions/sync.ts";

// import { parse } from "https://deno.land/std@0.152.0/path/posix.ts";

import { resolve } from "https://deno.land/std@0.152.0/path/posix.ts";

// import makeloc from 'https://x.nest.land/dirname@v1.1.2/mod.ts'

// const { __dirname,  __filename } = makeloc(import.meta)

// import { path } from 'npm:path';

// import { resolve } from "https://deno.land/std@0.154.0/path/posix.ts";

// const modelText = Deno.readTextFileSync("./models/model.ts");

// console.log(modelText);

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

const models = modelParser();

// console.log("models\n", models);
const associations = [];

for (const model of models) {
  for (const columnName in model.columns) {
    // console.log(columnName);

    if (model.columns[columnName].association) {
      // console.log(model.)
      // console.log(model.columns[columnName]);

      associations.push({
        columnName: columnName,
        table: model.columns[columnName].association?.table,
        mappedCol: model.columns[columnName].association?.mappedCol,
      });
    }
  }
}

// console.log(associations);

// await sync(true);

//       Deno.run({
//   cmd: ["deno", "fmt"],
// });

// console.log(parse('./henryPlayground.ts'));

// console.log(resolve('./henryPlayground.ts'));
// console.log(resolve('./Test/henryPlayground.ts'));

Deno.run({ cmd: ["deno", "fmt", resolve("./Test/henryPlayground.ts")] });

// Deno.run({})

//  Deno.run
// await sync();

// console.log(await getDbData());

// const test = await getDbData();

// console.log(test.constraintList);

// const modelArray = modelParser();

// const speciesAssociation = modelArray[1].columns.species_id.association;

// console.log(
//   "species_id association",
//   speciesAssociation,
// );

// console.log(speciesAssociation?.table);
// console.log(speciesAssociation?.mappedCol);
