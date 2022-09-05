// need to take care of type, probably via a model.d.ts... 
// but on FE would be importing * as models from a written file provided by user
// so can maybe export an interface from *that* model.ts 

import * as models from '../../models/model.ts'

export interface IModel {
  [key: string]: boolean;
}

// check if first second of query string is a valid model in DB
export const isValidModel = (queryStr: string): boolean => {
  // const models = await import('../user/model.ts');
  const modelName = queryStr.split('.')[0];
  const modelsDict: IModel = {};
  for (const key in models) {
    if (models[key] instanceof Function) {
      modelsDict[key] = true;
    }
  }
  return modelName in modelsDict;
};

// console.log(isValidModel('Person.select()'));
// console.log(isValidModel('Persona.select()'));

/* 
Currently, all other query syntax errors will be handled via DB error.
In the future, can write more specific tests (e.g. balanced parens) to validate
input before attempting DB query
*/