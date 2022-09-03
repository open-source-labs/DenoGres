import { Handlers, HandlerContext } from "$fresh/server.ts";
// import { writeQueryText } from "../../utils/fileTextWriters.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    const newQuery: string = await req.json();

    const path: string = './application/data/queries.json';
    
    // need to read from file, parse out the array, push new obj into that array, and then write it!
    // Deno.writeTextFileSync(path, JSON.stringify([newQuery]));

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
