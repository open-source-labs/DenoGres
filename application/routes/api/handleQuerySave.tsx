import { Handlers, HandlerContext } from "$fresh/server.ts";
import { IQueryObject } from '../../islands/Console.tsx';
// import { writeQueryText } from "../../utils/fileTextWriters.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    const newQuery: string = await req.json();

    const path: string = './application/data/queries.json';
    const savedQueries:  = JSON.parse(Deno.readTextFileSync(path));
    savedQueries.push(newQuery);
    Deno.writeTextFileSync(path, JSON.stringify(savedQueries));

    return new Response('Successfully saved query!', { status: 200 });
  },
};


//     const response = new Response(stringify(queryResult), {
//       status: 200,
//       headers: {
//         "content-type": "application/json",
//       },
//     });
//     return response;
//   },
// };
