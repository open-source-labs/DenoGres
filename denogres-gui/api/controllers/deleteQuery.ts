import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { deleteQuery } from '../repositories/userRepo.ts';

export default async (ctx: Context) => {
  const { queryId } = await ctx.request.body().value;
  if (!queryId) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in to view your queries';
  }
  await deleteQuery(queryId);
  ctx.response.status = 200;
  ctx.response.body = 'Successfully deleted query';
  return;
};
