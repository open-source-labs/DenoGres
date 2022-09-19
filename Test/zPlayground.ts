import { dbPull2 } from "../src/functions/dbPull2.ts";
import { init } from "../src/functions/init.ts";
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts";
import { checkDbPull } from "../src/functions/checkDbPull.ts";
import sync2 from "../src/functions/sync2.ts";
import seed from "../src/functions/seed.ts";
import { checkDbSync } from "../src/functions/checkDbSync.ts";
import { introspect2 } from "../src/functions/introspect2.ts";
import modelParser2 from "../src/functions/modelParser2.ts";

// await dbPull2();

sync2(true);

// const [dbTables] = await introspect2();

// const models = await modelParser2();

// console.log("MODELS");
// console.log(models);

// console.log(`\ndbTABLES`);
// console.log(dbTables);

// const removeWhitespaces = (string: string) => string.replace(/\s/g, '');

// console.log(JSON.stringify(models));

// console.log();
// console.log(JSON.stringify(dbTables));

// console.log(JSON.stringify(models) === removeWhitespaces(JSON.stringify(dbTables)));

// console.log(JSON.parse('false'));

// console.log(10 == "10");

// await dbPull2();

// console.log(dbTables.people.columns.species_id.association);

// const myLog = Deno.readFileSync(
//   resolve("./Migrations/log/migration_log.txt"),
// );
// console.log(myLog);

// const path =  "./Migrations/log/migration_log.txt";
// console.log(path);

// const myLog = Deno.readTextFileSync(path);
// console.log(myLog);

// const myLog = Deno.readTextFileSync(
//   "./Migrations/log/migration_log.txt",
// );
// console.log(myLog);

// const myLog = Deno.readFileSync(
//   resolve("./Migrations/log/migration_log.txt"),
// );
// console.log(myLog);

// await checkDbPull();

// sync2();

// await seed();

// checkDbSync()

// await dbPull2();

// init();
