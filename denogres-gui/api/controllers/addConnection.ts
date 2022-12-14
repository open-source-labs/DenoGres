import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { addConnection } from '../repositories/userRepo.ts';

interface ConnectionSettings {
  user_id: string;
  connection_name: string;
  connection_address: string;
  port_number: number;
  default_db: string;
  db_username: string;
  db_password: string;
}

export default async (ctx: Context) => {
  const userID = await ctx.cookies.get('userId');
  const connectionBody: ConnectionSettings = await ctx.request.body().value;
  connectionBody.user_id = userID;
  
  const cookieID: string = connectionBody.user_id;
  if (userID !== cookieID) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in to view your connections';
  } else {
    const newConnection = await addConnection(connectionBody);
    ctx.response.status = 201;
    ctx.response.body = newConnection;
  }
};
