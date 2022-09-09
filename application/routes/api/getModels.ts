import { Handlers, HandlerContext } from "$fresh/server.ts";
import { generateModels } from "../../utils/generateModel.ts";
import { userUri } from "../../user/uri.ts";

// obtain connection details from front-end and update local connections.json
// TODO: add functionality to save to DB once set up 
export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    return new Response('Successfully saved new connection!', { status: 200 });
  },
};