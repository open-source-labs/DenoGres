import { modelParser } from "../src/functions/modelParser.ts";

import { introspect } from "../src/functions/introspect.ts";



const modelText = Deno.readTextFileSync('./models/model.ts');

// console.log('modelText\n', modelText);

// console.log(JSON.stringify(modelText));

// const beforeJSON = JSON.parse(modelText);

// const afterJSON = JSON.stringify(modelText);


// console.log('after\n', JSON.parse(JSON.stringify(modelText)));

// console.log(modelText === afterJSON);

// console.log(afterJSON);

// console.log(JSON.parse(afterJSON));

const beforeParse = JSON.stringify(modelText);

console.log('beforeParse\n', beforeParse);

const afterParse = JSON.parse(beforeParse);

console.log('afterParse\n', afterParse);

// console.log('modelParser\n', modelParser());

// console.log(await introspect());

// const parsedModel = modelParser();

// console.log('parsedModel', parsedModel);

// const introspection = await introspect();

// console.log('introspection[0]\n', introspection[0]);

// console.log(typeof introspection[0], typeof parsedModel);

// console.log(introspection[0].people.columns.species_id.association);

// console.log(parsedModel[1].columns.species_id.association);


// console.log(JSON.stringify(`
//   I love food
// `))