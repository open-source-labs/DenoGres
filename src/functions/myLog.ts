/**
 * * Create a log, that is similar to git log
 * * Everytime dbSync is invoked, we want the following to happen:
 * * (1) - Make a copy of the current model.ts file before sync is invoked and save it in Migrations folder.
 * * (2) - Create a unique id name for the model.ts that was saved date with 24 time marker
 * * (3) - Save the unique id and user comment to a log file
 */
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts"
import { createCurrentDate } from "./checkDbPull.ts";

export function uniqueLog(): void {
    const uniqueId = createCurrentDate();
    const beforeSyncModel = Deno.readTextFileSync('./models/model.ts');
    Deno.writeTextFileSync('./Migrations/log/migration_log.txt', `${uniqueId} \n`, { append: true }); //* adds onto the text file instead of creating it again.
    console.log(beforeSyncModel);
}