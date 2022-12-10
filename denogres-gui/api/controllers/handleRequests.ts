import writeQueryText from '../../utils/writeQueryText.ts';
import { checkInput, extractType, IError } from '../../utils/checkInputs.ts';
import { generateModels } from '../../utils/generateModels.ts';
// import * as cookie from 'cookie/cookie.ts';
import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';

const queryCache: any = {};

/*
TODO: stretch: can implement middleware pattern in Fresh.js 
TODO: and break down this handler into multiple specialized handlers
*/
export default async (ctx: Context) => {
  console.log('in router handle');
  const reqBodyObj = await ctx.request.body().value;
  console.log(reqBodyObj);
  const userId = await ctx.cookies.get('userId');
  console.log(userId);
  if (!userId) {
    return (ctx.response.status = 400);
  } else {
    // initialize user cache if not present
    if (!(userId in queryCache)) {
      queryCache[userId] = {};
    }
  }
  /* 
    TODO: stretch: can implement more robust validation & caching
    */
  switch (reqBodyObj.task) {
    // if request is to log out user, clear user cache
    case 'clear user cache': {
      delete queryCache[userId];
      return (ctx.response.status = 200);
    }
    // validate by attempting to retrieve models
    // if successful, cache both uri and models under user
    // otherwise, delete uri key on user cache so it does not persist
    case 'cache uri and validate': {
      console.log('in cache uri');
      queryCache[userId]['dbUri'] = reqBodyObj.uri;
      try {
        queryCache[userId]['modelObj'] = await generateModels(
          queryCache[userId].dbUri
        );
      } catch (_err) {
        delete queryCache[userId].dbUri;
        return console.log('failed');
        //   return (ctx.response.body =
        //     (JSON.stringify([
        //       {
        //         Error: `Failed to retrieve database models. Please check your database credentials.`,
        //       },
        //     ]),
        //     { status: 400 }));
      }

      // ctx.response.body =
      //   'Successfully cached connection URI & database models.';
      ctx.response.status = 200;
      return;
      // );
    }
    // generates models in stringifiable plain text to render on FE
    case 'get models as text': {
      try {
        const modelsListObject = await generateModels(
          queryCache[userId].dbUri,
          {
            asText: true,
          }
        );
        const modelNamesArr = [];
        const modelContentArr = [];
        for (const key in modelsListObject) {
          modelNamesArr.push(key);
          modelContentArr.push(modelsListObject[key]);
        }
        return new Response(JSON.stringify([modelNamesArr, modelContentArr]));
      } catch (err) {
        console.log('not working');
        return new Response(JSON.stringify([{ Error: `${err}` }]), {
          status: 400,
        });
      }
    }
    default: {
      // otherwise receive query string from req body; retrieve uri & models from cache
      const queryStr = reqBodyObj.queryText;
      const userUri = queryCache[userId].dbUri;
      const denogresModels = queryCache[userId].modelObj;

      // handle missing uri (user did not connect before sending query request)
      if (!userUri) {
        return new Response(
          JSON.stringify([
            {
              Error: `
            Missing database connection. Please be sure to connect before submitting queries.
          `,
            },
          ]),
          { status: 400 }
        );
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
      const AsyncFunction = async function () {}.constructor;

      // construct the new function (as opposed to writing it to a separate file)
      const newFunc = AsyncFunction('input', funcStr);

      // evaluate the function, passing in the denogres models
      // postgres will catch any db errors not previously caught via input validation (e.g. invalid column name)
      try {
        const response = await newFunc(denogresModels);
        if (queryType === 'insert') {
          return new Response(
            JSON.stringify([
              {
                Success: `
              Inserted record into database.
            `,
              },
            ]),
            { status: 200 }
          );
        }
        if (queryType === 'edit') {
          return new Response(
            JSON.stringify([
              {
                Success: `
              Updated record(s) in database.
            `,
              },
            ]),
            { status: 200 }
          );
        }
        if (queryType === 'delete') {
          return new Response(
            JSON.stringify([
              {
                Success: `
              Deleted record(s) from database.
            `,
              },
            ]),
            { status: 200 }
          );
        }
        if (response === undefined) {
          return new Response(
            JSON.stringify([
              {
                Error: `A database error has occurred. Please check your query syntax.`,
              },
            ])
          );
        }
        return new Response(response);
      } catch (err) {
        return new Response(JSON.stringify([{ Error: `${err}` }]), {
          status: 400,
        });
      }
    }
  }
};
