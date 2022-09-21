//! FILE is a WIP

import { readLines } from "https://deno.land/std@0.141.0/io/buffer.ts";
// import { promptString } from "./myLog.ts";
import { resolve } from "https://deno.land/std@0.155.0/path/win32.ts";
import sync from "./sync.ts";

function isString(filePath: string | null): filePath is string {
  return typeof filePath === "string";
}

/** This function will do the following
 * * (1): Prompt the user for a decision, yes or no.
 * * (2): If yes, the function will read the file path and then write the chosen model into the models/model.ts file.
 * * (3): Db sync will then be ran.
 * * (4): If no is entered as decision, nothing will happen, function will exit.
 */
// export async function restoreModel() {
//   const filePath: string | null = prompt("Enter path of model to restore: ");
//   //* check if current file path exists
//   try {
//     const restoreModel = Deno.readTextFileSync(filePath);
//     const decision = await promptString(
//       `This will overwrite your current model, are you sure you want to restore? \n Enter[yes/no]: `,
//     );
//     if (decision === "Yes" || decision === "Y" || decision === "yes") {
//       console.log(restoreModel);
//       //* Restore the model and dbSync.
//       Deno.writeFileSync(resolve("./models/model.ts"), restoreModel); // resolve file paths just in case
//       sync();
//     }
//   } catch (e) {
//     if (e instanceof Deno.errors.NotFound) {
//       console.error("file does not exists");
//     }
//   }
// }
export default function restoreModel() {
  let filePath: string | null = prompt("Enter path of model to restore: ");
  //* check if current file path exists

  if (isString(filePath)) {
    // filePath = resolve(filePath?.replace(/\s/g, ""), "/build_model.ts");
    // filePath = resolve(filePath, "/build_model.ts");
    filePath = filePath + "/build_model.ts";

    console.log("FILEPATH", filePath);
    // filePath = resolve(filePath, "./build_model.ts");
    const restoreModel = Deno.readTextFileSync(filePath);

    let decision = prompt(
      `This will overwrite your current model, are you sure you want to restore? \n Enter[yes/no]: `,
    );

    if (isString(decision)) {
      decision = decision?.replace(/\s/g, "").toLowerCase();

      switch (decision) {
        case "yes":
        case "y": {
          Deno.writeFileSync(filePath, restoreModel);
          sync();
          return;
        }
        default:
      }
    } else return;
  } else return;

  // try {
  //   const restoreModel = Deno.readTextFileSync(filePath);
  //   const decision = await promptString(
  //     `This will overwrite your current model, are you sure you want to restore? \n Enter[yes/no]: `,
  //   );
  //   if (decision === "Yes" || decision === "Y" || decision === "yes") {
  //     console.log(restoreModel);
  //     //* Restore the model and dbSync.
  //     Deno.writeFileSync(resolve("./models/model.ts"), restoreModel); // resolve file paths just in case
  //     sync();
  //   }
  // } catch (e) {
  //   if (e instanceof Deno.errors.NotFound) {
  //     console.error("file does not exists");
  //   }
  // }
}
