import { Handlers, HandlerContext } from "$fresh/server.ts";
import { writeQueryText } from "../../utils/queryTextWriter.ts";
import { checkInput, extractType, IError, IModel } from '../../utils/inputCheckers.ts';
import { generateModels } from "../../utils/generateModel.ts";

const queryCache: any = {};

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {
    // TODO: test uri connection to ensure uri is valid (currently db would throw error at the end)
    // possibly check FE UI to see if it makes sense to auto-test when clicking 'Connect'
    // versus manual "test connection" button!
    const reqBodyObj: any = await req.json();
    
    // if request body contains db uri (from connections route), cache it and return
    if ('uri' in reqBodyObj) {
      queryCache['dbUri'] = reqBodyObj.uri;
      // console.log('caching uri:', queryCache);
      return new Response ('Successfully cached connection URI.');
    }

    // otherwise receive query string from req body; retrieve uri from cache
    const userUri = queryCache.dbUri;
    const queryStr = reqBodyObj.queryText;
    console.log('retrieved uri: ', queryCache);

    // cache model object on first run then subsequently retrieve from cache
    let denogresModels: IModel;
    if (!('modelObj' in queryCache)) {
      denogresModels = await generateModels(userUri);
      queryCache['modelObj'] = denogresModels;
    } else {
      denogresModels = queryCache.modelObj;
    }
    // console.log('cached model:', queryCache);
    // handle missing uri (user did not connect before sending query request)
    if (!userUri) {
      return new Response(JSON.stringify([{ Error: `
        Missing database connection. Please be sure to connect before submitting queries.
      `}]));
    }
    
    // handle query string errors 
    const errorObj: IError | null = checkInput(queryStr, denogresModels);
    if (errorObj) {
      return new Response(JSON.stringify([errorObj]));
    }

    // extract type of query (e.g. select, edit, delete)
    const queryType: string = extractType(queryStr);

    // create string to write into function
    const funcStr: string = writeQueryText(userUri, queryStr);

    // Async Constructor - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
    const AsyncFunction = (async function () {}).constructor;
    
    // construct the new function (as opposed to writing it to a separate file)
    const newFunc = AsyncFunction('input', funcStr);

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

