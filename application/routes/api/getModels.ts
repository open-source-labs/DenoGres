import { Handlers, HandlerContext } from "$fresh/server.ts";
import { generateModels } from "../../utils/generateModel.ts";
import { userUri } from "../../user/uri.ts";

// pull list of models in db instance and return as arrays of model names and content
// TODO: need to label enum as enum for FE
export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext): Promise<Response> {
   const modelsListObject = await generateModels(userUri, { asText: true });
    const modelNamesArr = [];
    const modelContentArr = [];
    for (const key in modelsListObject) {
      modelNamesArr.push(key);
      // const stringified = JSON.stringify(modelsListObject[key]);
      modelContentArr.push(modelsListObject[key]);
    }
    return new Response(JSON.stringify([modelNamesArr, modelContentArr]));
  },
};