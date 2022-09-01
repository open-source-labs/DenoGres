import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(_, ctx) {
    console.log("In the handler");

    // await Deno.writeTextFile(path, str, { append: false });

    const getResult = async (): Promise<any> => {
      const str = `
      import * as denogres from './models/model.ts';\n
      export default async (): Promise<unknown[]> => {
        const result = await denogres.Species.select('*').query();
        return result;
      };`;

      const writePath = "./function.ts";
      await Deno.writeTextFile(writePath, str, { append: false });
      const importPath = "../../../function.ts";
      const funcToRun = await import(importPath);
      return funcToRun.default();
    };

    const queryResult = await getResult();

    // function to stringify where field is bigint
    const stringify = (obj: object): string => {
      return JSON.stringify(
        obj,
        (key, value) => typeof value === "bigint" ? value.toString() : value,
      );
    };

    const response = new Response(stringify(queryResult), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
    return response;
  },
};
