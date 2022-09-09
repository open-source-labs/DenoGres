// will need to refactor these imports to pull from our deno module instead of locally
// since they normally live on the denogres code outside of app folder
import { introspect } from "../../src/functions/introspect.ts";
import { createClassName } from "../../src/functions/StringFormat.ts";
import { Model } from "https://deno.land/x/denogresdev/mod.ts";

export const generateModels = async (userUri: string): Promise<object> => {

  const [ tableListObj, enumObj ] = await introspect(userUri);

  const modelsList: any = {};

  // iterate over all table objs, create each as a class extending Model
  // insert each into the "denogres" models object
  for (const key in tableListObj) {
    const className = createClassName(key);
    modelsList[className] = class extends Model{};
    modelsList[className].table = key;
    modelsList[className].columns = tableListObj[key].columns;
  }

  /* 
  iterate over all enum objs from db
  create each as an enum object and insert into "denogres" models object
  sample form of enum object: {"sad": 0, "ok": 1, "happy": 2, "0": "sad", "1": "ok", "2": happy}

  see https://stackoverflow.com/questions/20278095/enums-in-typescript-what-is-the-javascript-code-doing
  for example of implementing enum using the Immediately Invoked Function Expression (IIFE) pattern below
  further testing is needed to determine if this is (un)necessary
  */
  for (const key in enumObj) {
    const enumName = key[0].toUpperCase().concat(key.slice(1));
    let TempEnum: any;
    (function (TempEnum) {
      for (let i = 0; i < enumObj[key].length; i++) {
        TempEnum[i] = enumObj[key][i];
        TempEnum[enumObj[key][i]] = i;
      }
    })(TempEnum || (TempEnum = {}));
    modelsList[enumName] = TempEnum;
  }
  return modelsList;
};