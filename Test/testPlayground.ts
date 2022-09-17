import { enumSync } from "../src/functions/enumSync.ts";
import { enumParser } from "../src/functions/enumParser.ts";
// import { denoLog } from "../src/functions/migrationLog.ts";
import { dbPull } from "../src/functions/dbPull.ts";
import { sync } from "../src/functions/sync.ts"
// import { checkDiff } from "../src/functions/checkDiff.ts";
import { checkDbSync } from "../src/functions/checkDbSync.ts";
import { uniqueLog } from '../src/functions/myLog.ts';
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts"
// const parser = enumParser();
// console.log('This is the enum Parser: ', parser);

// const eSync = enumSync();
// console.log('This is the enum Sync: ', eSync);


// const myParser = await Deno.readTextFile('./src/functions/enumParser.ts');
// console.log(myParser);

// console.log(denoLog());
// console.log(dbPull());
// console.log(sync());

// console.log(checkDiff('./Migrations/modelBuild_20220915_183728203/build_model.ts', './Migrations/syncedModel_20220915_184717260/synced_build.ts'))
// const p=Deno.run({ cmd: ["echo", "abcd"] });
// p;
// dbPull();
// uniqueLog('This is my 4th comment');
sync();
// console.log(Deno.readTextFileSync('./Migrations/log/migration_log.txt'));