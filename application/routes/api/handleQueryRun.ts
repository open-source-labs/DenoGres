import { Handlers, HandlerContext } from "$fresh/server.ts";
import { writeQueryText } from "../../utils/fileTextWriters.ts";
import findInputError, { IError } from '../../utils/inputChecker.ts';
// import { userUri } from '../../user/uri.ts';

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {
    const uriFilePath = '../../user/uri.ts';
    const { userUri } = await import(uriFilePath);
    // const uri: string = userUri;
    const queryStr: string = await req.json();
    const errorObj: IError | null = await findInputError(queryStr);
    if (errorObj) {
      return new Response(JSON.stringify([errorObj]));
    }

    const fileStr: string = writeQueryText(userUri, queryStr);
    const writePath: string = './application/data/query.ts';
    Deno.writeTextFileSync(writePath, fileStr);
    
    const cmd: Array<string> = ['deno', 'run', '-A', `${writePath}`];
    const process = Deno.run({ cmd, stdout: 'piped', stderr: 'piped' });
    const [ output, error ]: [ Uint8Array, Uint8Array ] = await Promise.all([
      process.output(),
      process.stderrOutput()
    ]);
    process.close();
    // this currently handles all other DB errors; 
    // can look into more robust & descriptive error handling
    if (error.length) {
      // console.log(error);
      Deno.removeSync(writePath);
      return new Response(JSON.stringify([{ Error: `
        An error occurred while retrieving records from the database. Please check your query syntax.
      `}]));
    }
    // console.log(output);
    const records: string = new TextDecoder().decode(output);
    // console.log(decoded);
    Deno.removeSync(writePath);
    return new Response(records);
  },
};
// export const handler: Handlers = {
//   async POST(_, ctx) {
//     console.log("In the handler");

//     // await Deno.writeTextFile(path, str, { append: false });

//     const getResult = async (): Promise<any> => {
//       const str = `
//       import * as denogres from './models/model.ts';\n
//       export default async (): Promise<unknown[]> => {
//         const result = await denogres.Species.select('*').query();
//         return result;
//       };`;

//       const writePath = "./function.ts";
//       await Deno.writeTextFile(writePath, str, { append: false });
//       const importPath = "../../../function.ts";
//       const funcToRun = await import(importPath);
//       return funcToRun.default();
//     };

//     const queryResult = await getResult();

//     // function to stringify where field is bigint
//     const stringify = (obj: object): string => {
//       return JSON.stringify(
//         obj,
//         (key, value) => typeof value === "bigint" ? value.toString() : value,
//       );
//     };

//     const response = new Response(stringify(queryResult), {
//       status: 200,
//       headers: {
//         "content-type": "application/json",
//       },
//     });
//     return response;
//   },
// };
