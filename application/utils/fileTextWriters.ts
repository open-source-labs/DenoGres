import { isValidModel } from './inputValidators.ts';

export const writeQueryText = (uri: string, userQueryStr: string): string => {

  // validate user input; may include a suite (array) of tests later
  // WILL NEED TO GUARD AGAINST INJECTION OTHER THAN DEFAULT ERR CATCHING
  if (!isValidModel(userQueryStr)) {
    return `
      export default (): string => {
        return 'Error: model does not exist in database instance';
      };
    `;
  }
  const fullQueryString: string = userQueryStr.slice(0, -2) + '\'' + uri + '\'' + userQueryStr.slice(-2);
  console.log(fullQueryString);
  return `
    import * as denogres from '../../models/model.ts';\n
    export default async (): Promise<unknown[]> => {
      const result = await denogres.${fullQueryString}
      return result;
    };
  `;
};