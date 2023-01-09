//! FILE is a WIP

import { readLines } from 'https://deno.land/std@0.141.0/io/buffer.ts';
// import { promptString } from "./myLog.ts";
// import { resolve } from "https://deno.land/std@0.155.0/path/win32.ts";
import sync from './sync.ts';

function isString(filePath: string | null): filePath is string {
  return typeof filePath === 'string';
}

/** This function will do the following
 * * (1): Prompt the user for a decision, yes or no.
 * * (2): If yes, the function will read the file path and then write the chosen model into the models/model.ts file.
 * * (3): Db sync will then be ran.
 * * (4): If no is entered as decision, nothing will happen, function will exit.
 */
export default function restoreModel() {
  let filePath: string | null = prompt('Enter path of model to restore: ');
  //* check if current file path exists

  if (isString(filePath)) {
    // filePath = resolve(filePath?.replace(/\s/g, ""), "/build_model.ts");
    // filePath = resolve(filePath, "/build_model.ts");
    if (filePath.includes('modelBuild')) {
      filePath = filePath + '/build_model.ts';
    } else if (filePath.includes('syncedModel')) {
      filePath = filePath + '/synced_build.ts';
    }

    // console.log("FILEPATH", filePath);
    // filePath = resolve(filePath, "./build_model.ts");
    const restoreModel = Deno.readTextFileSync(filePath);

    let decision = prompt(
      `This will overwrite your current model, are you sure you want to restore? \n Enter[yes/no]: `,
    );

    if (isString(decision)) {
      decision = decision?.replace(/\s/g, '').toLowerCase();

      switch (decision) {
        case 'yes':
        case 'y': {
          Deno.writeTextFileSync('./models/model.ts', restoreModel);

          console.log('Syncing your database...');

          sync(true);
          return;
        }
        case 'no': {
          console.log('Exiting restoration');
        }
        default:
      }
    } else return;
  } else return;
}
