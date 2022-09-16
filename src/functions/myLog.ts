/**
 * * Create a log, that is similar to git log
 * * Everytime dbSync is invoked, we want the following to happen:
 * * (1) - Make a copy of the current model.ts file before sync is invoked and save it in Migrations folder.
 * * (2) - Create a unique id name for the model.ts that was saved date with 24 time marker
 * * (3) - Save the unique id and user comment to a log file
 */
import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts"
import { today, dateFolder } from './checkDbPull.ts'
import { todaySync, dateFolderSync } from "./checkDbSync.ts";
import { readLines } from 'https://deno.land/std@0.141.0/io/buffer.ts';


export async function promptString(question: string) {
    console.log(question);
    for await (const line of readLines(Deno.stdin)){
        return line;
    }
}
const input = await promptString("What is your comment? ");

//* Within this function we want to pass in the users comment and have it fire off. 
export function uniqueLog(method: string): void {
    console.log("Unique log is running.");
    console.log(input);
    // const uniqueId = createCurrentDate();
    if (method === 'db-pull') {
        const dbPullInfo = `This model was created with ${method} and was created on ${today}. It's currently stored in the directory './Migrations/modelBuild/_${dateFolder}'\n ${input}\n`;
        Deno.writeTextFileSync('./Migrations/log/migration_log.txt', `${dbPullInfo}\n`, { append: true }); //* adds onto the text file instead of creating it again.
        console.log(dbPullInfo);
    }
    else {
        const dbSyncInfo = `This model was created with ${method} and was created on ${todaySync}. It's currently stored in the directory './Migrations/syncedModel/_${dateFolderSync}'\n ${input}\n`;
        Deno.writeTextFileSync('./Migrations/log/migration_log.txt', `${dbSyncInfo}\n`, { append: true }); //* adds onto the text file instead of creating it again.
        console.log(dbSyncInfo);
    }
    //? Messing up right here when I use resolve to resolve path, direct path works, maybe because resolve is async??
    // Deno.writeTextFileSync('./Migrations/log/migration_log.txt', `${info}\n`, { append: true }); //* adds onto the text file instead of creating it again.
    // console.log(beforeSyncModel);
}