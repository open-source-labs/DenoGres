import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { deleteConnection } from '../repositories/userRepo.ts';

export default async (ctx: Context) => {
  const userID = await ctx.cookies.get('userId');
  const connectionId = await ctx.request.body().value;
  console.log('delete test', connectionId);
  if (!userID) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in to delete your connections';
  }
  console.log('DELETING', connectionId);
  const result = await deleteConnection(connectionId);
  console.log(' RESULT', result);
  console.log('DELETED');
  ctx.response.status = 200;
  ctx.response.body = result;
};
