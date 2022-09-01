import { modelParser } from "../src/functions/modelParser.ts";

import { introspect } from "../src/functions/introspect.ts";



// const modelText = Deno.readTextFileSync('./models/model.ts');

// console.log('before\n', modelText);

// console.log(JSON.stringify(modelText));

// const afterJSON = JSON.parse(JSON.stringify(modelText));


// console.log('after\n', JSON.parse(JSON.stringify(modelText)));

// console.log(modelText === afterJSON);



// console.log('modelParser\n', modelParser());

// console.log(await introspect());

const parsedModel = modelParser();

console.log('parsedModel', parsedModel);

const introspection = await introspect();

console.log('introspection[0]\n', introspection[0]);

// console.log(typeof introspection[0], typeof parsedModel);

// console.log(introspection[0].people.columns.species_id.association);

// console.log(parsedModel[1].columns.species_id.association);
