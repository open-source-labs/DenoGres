import { resolve } from 'https://deno.land/std/path/mod.ts';
import { ensureDir } from 'https://deno.land/std/fs/ensure_dir.ts';
import { uniqueLog } from './myLog.ts';


//* Have to declare these date functions in both files, otherwise I end up with issues.
export const createCurrentDate = () : string => {
    const currentDate: string = new Date().toISOString()
    .replace(/[-:.Z]/g, '')     // replace T with a space
    .replace(/[T]/g, '_');
    return currentDate;
}

//* Date and time for txt file.
export const dateNow = () : Date => {
    const time : number = new Date().getTime();
    const myDate: Date = new Date(time);
    return myDate;
}


//* creating dates
const dateFolderSync = createCurrentDate();
const todaySync = dateNow();

//* Function will create synced version after dbSync has ran
export function checkDbSync(): void {
    uniqueLog('db-sync');
    const info = `This model was created when the command --db-sync was invoked on ${todaySync}.
    \n This model is a reference to the shape of your SQL Database on ${todaySync}. 
    \n If you'd like a more recent model please check the Migrations directory for synced versions of the model.` 
    const modelAfter = Deno.readTextFileSync(resolve('./models/model.ts'));
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

