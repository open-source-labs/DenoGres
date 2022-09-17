import { dbPull2 } from "../src/functions/dbPull2.ts";
import { init } from "../src/functions/init.ts";
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts";
import {checkDbPull} from "../src/functions/checkDbPull.ts";
import sync2 from "../src/functions/sync2.ts"
import seed from "../src/functions/seed.ts"

// await checkDbPull();

// await sync2();

await seed();


// await dbPull2();

// init();
