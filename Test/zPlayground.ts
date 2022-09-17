import { dbPull2 } from "../src/functions/dbPull2.ts";
import { init } from "../src/functions/init.ts";
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts";
import { checkDbPull } from "../src/functions/checkDbPull.ts";
import sync2 from "../src/functions/sync2.ts";
import seed from "../src/functions/seed.ts";
import { checkDbSync } from "../src/functions/checkDbSync.ts";

// const myLog = Deno.readFileSync(
//   resolve("./Migrations/log/migration_log.txt"),
// );
// console.log(myLog);

// const path =  "./Migrations/log/migration_log.txt";
// console.log(path);

// const myLog = Deno.readTextFileSync(path);
// console.log(myLog);

const myLog = Deno.readTextFileSync(
  "./Migrations/log/migration_log.txt",
);
console.log(myLog);

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
