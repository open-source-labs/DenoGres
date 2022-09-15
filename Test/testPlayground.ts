import { enumSync } from "../src/functions/enumSync.ts";
import { enumParser } from "../src/functions/enumParser.ts";
import { denoLog } from "../src/functions/migrationLog.ts";
import { dbPull } from "../src/functions/dbPull.ts";
// const parser = enumParser();
// console.log('This is the enum Parser: ', parser);

// const eSync = enumSync();
// console.log('This is the enum Sync: ', eSync);


const myParser = await Deno.readTextFile('./src/functions/enumParser.ts');
// console.log(myParser);

// console.log(denoLog());

console.log(dbPull())
