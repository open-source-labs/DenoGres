import { resolve } from 'https://deno.land/std/path/mod.ts';
import { createCurrentDate, dateNow } from './checkDbPull.ts';

//* creating dates
const dateFolder = createCurrentDate();
const today = dateNow();

export function checkDbSync(): void {
    const info = `This model was created when the command --db-pull was invoked on ${today}.
    \n This model is a reference to the shape of your SQL Database on ${today}. 
    \n If you'd like a more recent model please check the Migrations directory for synced versions of the model.` 
    const modelAfter = Deno.readTextFileSync(resolve('./models/model.ts'));
    console.log("the checkDbSync function worked!", modelAfter);
    //* Creating files and directory in Migrations 
    Deno.mkdirSync(`./Migrations/syncedModel_${dateFolder}`);
    Deno.writeTextFileSync(`./Migrations/syncedModel_${dateFolder}/synced_build.ts`, modelAfter);
    Deno.writeTextFile(`./Migrations/syncedModel_${dateFolder}/model_changes.txt`, info);
}

