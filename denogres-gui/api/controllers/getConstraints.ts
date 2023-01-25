import { allConstraints } from '../repositories/dbRepo.ts';
import { Context } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { getOneConnection } from '../repositories/userRepo.ts';

export default async (ctx: Context) => {
  const connectionId: string = await ctx.cookies.get('connectionId');
  const userId: string = await ctx.cookies.get('userId');
  if (!connectionId) {
    ctx.response.body = await allConstraints();
    return;
  }
  const connection = await getOneConnection(userId, connectionId);
  ctx.response.body = await allConstraints(connection);
};
