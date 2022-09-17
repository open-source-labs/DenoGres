import { Handlers, HandlerContext } from "$fresh/server.ts";
import { writeQueryText } from "../../utils/queryTextWriter.ts";
import { checkInput, extractType, IError, IModel } from '../../utils/inputCheckers.ts';
import { generateModels } from "../../utils/generateModel.ts";


const queryCache: any = {};

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    const reqBodyObj = await req.json();
    // TODO: stretch: validate JWT before caching anything (uri / model); redirect if missing/inauthentic

    // if request is to log out user, clear cache here
    // using a loop to delete every k-v pair on cache; 
    // alternatively could declare with 'let' and reassign to empty
    if (reqBodyObj.isLogOut) {
      for (const key in queryCache) {
        delete queryCache[key];
        return new Response(null, { status: 200 });
      }
    }

    // if request body contains db uri, validate by attempting to retrieve models
    // if successful, cache both uri and models
    if ('uri' in reqBodyObj) {
      queryCache['dbUri'] = reqBodyObj.uri;
      try {
        queryCache['modelObj'] = await generateModels(queryCache.dbUri);
      } catch (err) {
        delete queryCache.dbUri;
        return new Response(
          JSON.stringify([{ Error: `Failed to retrieve database models. Please check your database credentials.`}]),
          { status: 400 }
        );
      }
      return new Response('Successfully cached connection URI & database models.', { status: 200 });
    }

    if (reqBodyObj.getTextModels) {
      console.log('GETTING MODELS')
      console.log('query uri?:', queryCache.dbUri);
      try {
        const modelsListObject = await generateModels(queryCache.dbUri, { asText: true });
        const modelNamesArr = [];
        const modelContentArr = [];
        for (const key in modelsListObject) {
          modelNamesArr.push(key);
          modelContentArr.push(modelsListObject[key]);
        }
        return new Response(JSON.stringify([modelNamesArr, modelContentArr]));
      } catch (err) {
        return new Response(JSON.stringify([{ Error: `${err}`}]), { status: 400 });
      }
    }

    // otherwise receive query string from req body; retrieve uri & models from cache
    const queryStr = reqBodyObj.queryText;
    const userUri = queryCache.dbUri;
    const denogresModels = queryCache.modelObj;

    // handle missing uri (user did not connect before sending query request)
    if (!userUri) {
      return new Response(JSON.stringify([{ Error: `
        Missing database connection. Please be sure to connect before submitting queries.
      `}]), { status: 400 });
    }
    
    // handle query string errors 
    const errorObj: IError | null = checkInput(queryStr, denogresModels);
    if (errorObj) {
      return new Response(JSON.stringify([errorObj]), { status: 400 });
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
        `}]), { status: 200 });
      }
      if (queryType === 'edit') {
        return new Response(JSON.stringify([{ Success: `
          Updated record(s) in database.
        `}]), { status: 200 });
      }
      if (queryType === 'delete') {
        return new Response(JSON.stringify([{ Success: `
          Deleted record(s) from database.
        `}]), { status: 200 });
      }

      return new Response(response);
    } catch (err) {
      return new Response(JSON.stringify([{ Error: `${err}`}]), { status: 400 });
    }

  },
};

