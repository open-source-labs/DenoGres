import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { getAllQueries } from '../repositories/userRepo.ts';

export default async (ctx: Context) => {
  const connectionId: string = await ctx.cookies.get('connectionId');
  if (!connectionId) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in to view your queries';
  }
  const queryList = await getAllQueries(connectionId);
  ctx.response.status = 200;
  ctx.response.body = queryList;
  return;
};
