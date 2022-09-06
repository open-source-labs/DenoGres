import { Handlers, HandlerContext } from "$fresh/server.ts";

// obtain plain text of model.ts and write file in user folder
export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {
    // could potentially use fileTextWriter to add import statement in model.ts
    const modelFileText: string = await req.json();
    console.log(modelFileText);
    const path: string = './application/user/model.ts';
    Deno.writeTextFileSync(path, modelFileText);

    return new Response('Successfully saved model file!', { status: 200 });
  },
};