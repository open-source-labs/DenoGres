import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { updateConnection } from '../repositories/userRepo.ts';

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
  // Get the connection settings from the request body
  const connectionBody: ConnectionSettings = await ctx.request.body().value;

  // Get the user ID from the cookies
  const userID = await ctx.cookies.get('userId');
  connectionBody.user_id = userID;

  // Check if the user ID in the cookies matches the user ID in the connection settings
  const cookieID: string = connectionBody.user_id;
  if (userID !== cookieID) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in to view your connections';
  } else {
    // Update the connection using the connection ID and connection settings
    const updatedConnection = await updateConnection(connectionBody);

    // Set the response status to 201 (created) and return the updated connection
    ctx.response.status = 201;
    ctx.response.body = updatedConnection;
  }
};
