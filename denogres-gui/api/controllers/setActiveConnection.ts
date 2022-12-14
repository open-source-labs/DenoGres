import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import connectionIdService from '../services/connectionIdService.ts';

export default async (ctx: Context) => {
  const userID = await ctx.cookies.get('userId');
  if (!userID) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in...';
  }
  const paramID = await ctx.params.id;
  const connectionId: string | null = await connectionIdService(
    paramID,
    userID
  );
  if (connectionId === null) {
    ctx.response.status = 404;
    ctx.response.body = 'Connection with that ID does not exist';
  }
  ctx.response.status = 201;
  ctx.cookies.set('connectionId', `${connectionId}`);
  ctx.response.body = 'Connection ID set';
  return;
};
