import { Handlers, HandlerContext } from "$fresh/server.ts";
import { writeQueryText } from "../../utils/fileTextWriters.ts";
import { checkInput, extractType, IError } from '../../utils/inputCheckers.ts';

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext): Promise<Response> {

    const uriFilePath = '../../user/uri.ts';
    const { userUri } = await import(uriFilePath);
    const queryStr: string = await req.json();

    const errorObj: IError | null = await checkInput(queryStr);
    if (errorObj) {
      return new Response(JSON.stringify([errorObj]));
    }

    const queryType: string = extractType(queryStr);
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
      const decodedError: string = new TextDecoder().decode(error);
      Deno.removeSync(writePath);
      return new Response(JSON.stringify([{ Error: `
        An error occurred while retrieving records from the database.
      `}]));
    }

    if (queryType === 'insert') {
      return new Response(JSON.stringify([{ Success: `
        Inserted record into database.
      `}]));
    }
    if (queryType === 'edit') {
      return new Response(JSON.stringify([{ Success: `
        Updated record(s) in database.
      `}]));
    }
    if (queryType === 'delete') {
      return new Response(JSON.stringify([{ Success: `
        Deleted record(s) from database.
      `}]));
    }

    const records: string = new TextDecoder().decode(output);
    Deno.removeSync(writePath);
    return new Response(records);
  },
};

