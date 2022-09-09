import { Handlers, HandlerContext } from "$fresh/server.ts";
import { IQueryObject } from '../../islands/Console.tsx';

// obtain query object from front-end and update local queries.json
// TODO: add functionality to save to DB once set up 
// TODO: will remove this as we are now getting model via db pull
export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    const newQueryObject: IQueryObject = await req.json();
    const path: string = './application/data/queries.json';
    const savedQueries: IQueryObject[] = JSON.parse(Deno.readTextFileSync(path));
    savedQueries.push(newQueryObject);
    Deno.writeTextFileSync(path, JSON.stringify(savedQueries));

    return new Response('Successfully saved query!', { status: 200 });
  },
};
