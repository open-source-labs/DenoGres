import { columnNames } from "../repositories/dbRepo.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getOneConnection } from "../repositories/userRepo.ts";

interface ContextWithParams extends Context {
  params: {
    table: string;
  };
}

export default async ({
  params,
  response,
  cookies,
}: ContextWithParams) => {
  const tableName = params.table;

  if (!tableName) {
    response.status = 400;
    response.body = { msg: "Invalid table name" };
    return;
  }
  const connectionId: string = await cookies.get('connectionId');
  const userId: string = await cookies.get('userId');
  if (!connectionId) {
    response.status = 401;
    response.body = 'Please log in to view your queries';
  }
  const connection = await getOneConnection(userId, connectionId);
  const foundTable = await columnNames(tableName, connection);
  if (!foundTable) {
    response.status = 404;
    response.body = { msg: `Table with name ${tableName} not found` };
    return;
  }

  response.body = foundTable;
};

