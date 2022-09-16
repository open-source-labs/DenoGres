import { resolve } from 'https://deno.land/std/path/mod.ts';
import { createCurrentDate, dateNow } from './checkDbPull.ts';
import { ensureDir } from 'https://deno.land/std/fs/ensure_dir.ts';
import { readLines } from 'https://deno.land/std@0.141.0/io/buffer.ts';
import { uniqueLog } from './myLog.ts';

//* creating dates
const dateFolder = createCurrentDate();
const today = dateNow();

//* Get user comment
export async function promptString(question: string) {
    console.log(question);
    for await (const line of readLines(Deno.stdin)){
        return line;
    }
}

export async function checkDbSync(): Promise<void> {
    const input = await promptString("Enter Model Changes: ");
    uniqueLog(input);
    const info = `This model was created when the command --db-sync was invoked on ${today}.
    \n This model is a reference to the shape of your SQL Database on ${today}. 
    \n If you'd like a more recent model please check the Migrations directory for synced versions of the model.` 
    const modelAfter = Deno.readTextFileSync(resolve('./models/model.ts'));
    console.log("the checkDbSync function worked!");
    //* Checking directory exist to write safely
    ensureDir('./Migrations')
    //* Creating files and directory in Migrations
    .then(() => {
        Deno.mkdirSync(`./Migrations/syncedModel_${dateFolder}`);
        Deno.writeTextFileSync(`./Migrations/syncedModel_${dateFolder}/synced_build.ts`, modelAfter);
        Deno.writeTextFileSync(`./Migrations/syncedModel_${dateFolder}/synced_build.txt`, modelAfter);
        Deno.writeTextFile(`./Migrations/syncedModel_${dateFolder}/model_changes.txt`, info);
    })

}

