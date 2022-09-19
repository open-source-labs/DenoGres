//! FILE is a WIP

import { readLines } from "https://deno.land/std@0.141.0/io/buffer.ts";
import { promptString } from "./myLog.ts";
import { resolve } from "https://deno.land/std@0.155.0/path/win32.ts";
import { existsSync } from "https://deno.land/std@0.156.0/fs/mod.ts?s=existsSync";
import sync2 from "./sync2.ts"


/** This function will do the following
* * (1): Prompt the user for a decision, yes or no.
* * (2): If yes, the function will read the file path and then write the chosen model into the models/model.ts file.
* * (3): Db sync will then be ran.
* * (4): If no is entered as decision, nothing will happen, function will exit.
*/
export async function restoreModel() {
    const filePath = await promptString('Enter path of model to restore: ');
    //* check if current file path exists
    try {
        const restoreModel = await Deno.readTextFile(filepath);
        const decision = await promptString(`This will overwrite your current model, are you sure you want to restore? \n Enter[yes/no]: `);
        if ( decision === 'Yes' || decision === 'Y' || decision === 'yes'){
            console.log(restoreModel);
            //* Restore the model and dbSync.
            Deno.writeFileSync(resolve('./models/model.ts'), restoreModel); // resolve file paths just in case
            sync2();
        }
      } 

    catch(e) {
        if(e instanceof Deno.errors.NotFound)
          console.error('file does not exists');

      }
      
    }


