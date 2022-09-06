import { Handlers, HandlerContext } from "$fresh/server.ts";
import { IConnectionObject } from '../../islands/Connections.tsx';

// obtain connection details from front-end and update local connections.json
// TODO: add functionality to save to DB once set up 
export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    const newConnectionObject: IConnectionObject = await req.json();
    const path: string = './application/data/connections.json';
    const savedConnections: IConnectionObject[] = JSON.parse(Deno.readTextFileSync(path));
    savedConnections.push(newConnectionObject);
    Deno.writeTextFileSync(path, JSON.stringify(savedConnections));

    return new Response('Successfully saved new connection!', { status: 200 });
  },
};
