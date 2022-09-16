import { resolve } from 'https://deno.land/std/path/mod.ts';
import { createCurrentDate, dateNow } from './checkDbPull.ts';
import { ensureDir } from 'https://deno.land/std/fs/ensure_dir.ts';
import { readLines } from 'https://deno.land/std@0.141.0/io/buffer.ts';
import { uniqueLog } from './myLog.ts';

//* creating dates
const dateFolderSync = createCurrentDate();
const todaySync = dateNow();


export function checkDbSync(): void {
    uniqueLog('db-sync');
    const info = `This model was created when the command --db-sync was invoked on ${todaySync}.
    \n This model is a reference to the shape of your SQL Database on ${todaySync}. 
    \n If you'd like a more recent model please check the Migrations directory for synced versions of the model.` 
    const modelAfter = Deno.readTextFileSync(resolve('./models/model.ts'));
    console.log("the checkDbSync function worked!");
    //* Checking directory exist to write safely
    ensureDir('./Migrations')
    //* Creating files and directory in Migrations
    .then(() => {
        Deno.mkdirSync(`./Migrations/syncedModel_${dateFolderSync}`);
        Deno.writeTextFileSync(`./Migrations/syncedModel_${dateFolderSync}/synced_build.ts`, modelAfter);
        Deno.writeTextFileSync(`./Migrations/syncedModel_${dateFolderSync}/synced_build.txt`, modelAfter);
        Deno.writeTextFile(`./Migrations/syncedModel_${dateFolderSync}/model_changes.txt`, info);
    })

}
export {todaySync, dateFolderSync};

