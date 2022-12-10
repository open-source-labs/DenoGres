import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { allConnections } from '../services/dbService.ts';

export default async (ctx: Context) => {
  const userID: string = await ctx.cookies.get('userId');
  if (!userID) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in to view your connections';
  }
  const connectionList = await allConnections(userID);
  ctx.response.status = 200;
  ctx.response.body = connectionList;
  return;
};
