import { isValidModel } from './inputValidators.ts';

export const writeQueryText = (uri: string, userQueryStr: string): string => {

  // validate user input; may include a suite (array) of tests later
  // WILL NEED TO GUARD AGAINST INJECTION OTHER THAN DEFAULT ERR CATCHING
  if (!isValidModel(userQueryStr)) {
    return `
      const modelMissing = (): string => {
        console.log('Error: model does not exist in database instance');
      };
      modelMissing();
    `;
  }
  const fullQueryString: string = userQueryStr.slice(0, -2) + '\'' + uri + '\'' + userQueryStr.slice(-2);
  console.log(fullQueryString);
  return `
    import * as denogres from '../../models/model.ts';\n
    const logResults = async (): void => {
      const result = await denogres.${fullQueryString}
      const stringified = JSON.stringify(
        result, 
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
      console.log(stringified);
    };
    logResults();
  `;
};

// return `
// import * as denogres from '../../models/model.ts';\n
// export const logging = async (): Promise<unknown[]> => {
//   const result = await denogres.${fullQueryString};
//   console.log(result);
//   return result;
// };
// logging();`;