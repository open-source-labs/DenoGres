import { Handlers, HandlerContext } from "$fresh/server.ts";
import { writeQueryText } from "../../utils/fileTextWriters.ts";
import { checkInput, extractType, IError, IModel } from '../../utils/inputCheckers.ts';
import { generateModels } from "../../utils/generateModel.ts";

const modelCache: any = {};

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {
    // uri comes from dynamic import for now, but will refactor to come from user instead!
    const uriFilePath = '../../user/uri.ts';
    const { userUri } = await import(uriFilePath);
    const queryStr: string = await req.json();
    
    // cache model object on first run then subsequently retrieve from cache
    let denogresModels: IModel;
    if (!('modelObj' in modelCache)) {
      denogresModels = await generateModels(userUri);
      // console.log('first run: ', denogresModels);
      modelCache['modelObj'] = denogresModels;
    } else {
      denogresModels = modelCache.modelObj;
      // console.log('cached models: ', denogresModels);
    }

    const errorObj: IError | null = checkInput(queryStr, denogresModels);
    if (errorObj) {
      return new Response(JSON.stringify([errorObj]));
    }
    const queryType: string = extractType(queryStr);
    const fileStr: string = writeQueryText(userUri, queryStr);

    // TODO: need to fix this writeQueryText - put a placeholder for now
    // const fileStr = writeQueryText('abcde', queryStr)

    // Async Constructor - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
    const AsyncFunction = (async function () {}).constructor;
    
    // construct the new function (as opposed to writing it to a separate file)
    const newFunc = AsyncFunction('input', fileStr);

    // evaluate the function, passing in the denogres models
    // catch any db errors not previously caught via input validation (e.g. invalid column name)
    // pass back the postgres error since it is descriptive and useful!
    try {
      const response = await newFunc(denogresModels);

      if (queryType === 'insert') {
        return new Response(JSON.stringify([{ Success: `
          Inserted record into database.
        `}]));
      }
      if (queryType === 'edit') {
        return new Response(JSON.stringify([{ Success: `
          Updated record(s) in database.
        `}]));
      }
      if (queryType === 'delete') {
        return new Response(JSON.stringify([{ Success: `
          Deleted record(s) from database.
        `}]));
      }

      return new Response(response);
    } catch (err) {
      return new Response(JSON.stringify([{ Error: `${err}`}]));
    }

  },
};

