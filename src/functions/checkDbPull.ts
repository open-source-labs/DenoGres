import { resolve } from 'https://deno.land/std/path/mod.ts';
import { ensureDir } from 'https://deno.land/std/fs/ensure_dir.ts';
// import { promptString } from './checkDbSync.ts';
import { uniqueLog } from './myLog.ts';


//* Creating timestamp for folders
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

//* Today's date and time
const today = dateNow();
const dateFolder = createCurrentDate();

//* Function checks if db-pull was invoked.
export function checkDbPull(): void {
    uniqueLog('db-pull');
    const info = `This model was created when the command --db-pull was invoked on ${today}.
    \n This model is a reference to the shape of your SQL Database on ${today}. 
    \n If you'd like a more recent model please check the Migrations directory for synced versions of the model.` 
        const modelBefore = Deno.readTextFileSync(resolve('./models/model.ts'));
        console.log("the checkDbPullfunction worked!", dateFolder);
         //* Checking directory exist to write safely
        ensureDir('./Migrations')
        //* Creating files and directory in Migrations
        .then(() => {
            Deno.mkdirSync(`./Migrations/modelBuild_${dateFolder}`);
            Deno.writeTextFileSync(`./Migrations/modelBuild_${dateFolder}/build_model.ts`, modelBefore);
            Deno.writeTextFileSync(`./Migrations/modelBuild_${dateFolder}/build_model.txt`, modelBefore);
            Deno.writeTextFile(`./Migrations/modelBuild_${dateFolder}/migration_log.txt`, info);
        })
    }


// export const todayDate = today; //* date used to compare when modelBuild was created in human readable format.
// export const permDate = dateFolder; //* date that is the timestamp for the folder when it was created.

export {today, dateFolder};
