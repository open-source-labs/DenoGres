import { Handlers, HandlerContext } from "$fresh/server.ts";
// import { writeQueryText } from "../../utils/fileTextWriters.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    const queriesList: string = await req.json();

    const writePath: string = './application/data/queries.json';
    Deno.writeTextFileSync(writePath, queriesList);

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
