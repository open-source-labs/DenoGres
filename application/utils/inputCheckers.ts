export interface IModel {
  [key: string]: any
}

interface IModelDict {
  [key: string]: true;
}

interface IMethodsDict {
  [key: string]: true;
}

export interface IError {
  Error: string;
}

// current list of supported query methods
const METHODS: IMethodsDict = {
  query: true,
  select: true,
  where: true,
  edit: true,
  delete: true,
  insert: true,
  limit: true,
  group: true,
  innerJoin: true,
  leftJoin: true,
  rightJoin: true,
  fullJoin: true,
  order: true,
  avg: true,
  min: true,
  max: true,
  count: true,
  sum: true,
};

// check if first term in string is same as name of a valid model (i.e. ES6 class) in current db
const isValidModel = (modelName: string | undefined, models: IModel | undefined): boolean => {
  const modelsDict: IModelDict = {};
  for (const key in models) {
    if (models[key] instanceof Function) {
      modelsDict[key] = true;
    }
  }
  return modelName ? modelName in modelsDict : false;
};

// check if query methods are valid / currently supported
const allMethodsAreValid = (methodsArr: string[], methods: IMethodsDict): boolean => {
  for (let i = 0; i < methodsArr.length; i++) {
    if (!(methodsArr[i] in methods)) {
      return false;
    }
  }
  return true;
};

// helper function to parse query string into array of terms (model name + methods)
const separateQueryTerms = (queryStr: string): string[] => {
  return queryStr.replace(/\(.*?\)/g, '').replace(/;$/, '').split('.');
}

// extract the main CRUD method invoked in this query (e.g. 'select' in ['Person', 'select', 'query'])
export const extractType = (queryStr: string): string => {
  return separateQueryTerms(queryStr)[1];
}

// check input query string for errors
export const checkInput = (queryStr: string, modelsObj?: IModel): IError | null => {
  const termsArray: string[] = separateQueryTerms(queryStr);
  const modelName: string | undefined = termsArray.shift();

  if (!isValidModel(modelName, modelsObj)) {
    return { Error: 'Model does not exist in database instance.'};
  }
  if (!allMethodsAreValid(termsArray, METHODS)) {
    return { Error: 'Invalid or unsupported query method(s).' };
  }
  return null;
}

/* 
Currently, all other query syntax errors will be handled via DB error.
In the future, can write more specific tests (e.g. balanced parens) to validate
input before attempting DB query
*/