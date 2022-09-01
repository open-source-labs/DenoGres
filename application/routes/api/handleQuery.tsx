import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(_, ctx) {
    console.log("In the handler");

    // await Deno.writeTextFile(path, str, { append: false });

    const getResult = async (): Promise<any> => {
      const str = `export default function test () {
      console.log('This is a test');
      return [1,2,3,4,5];
      }`;

      const writePath = "./function.ts";
      await Deno.writeTextFile(writePath, str, { append: false });
      const importPath = "../../../function.ts";
      const funcToRun = await import(importPath);
      return funcToRun.default();
    };

    const queryResult = await getResult();

    const response = new Response(JSON.stringify(queryResult), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
    return response;
  },
};
