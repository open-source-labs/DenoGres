import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { addQuery } from '../repositories/userRepo.ts';
import formatQueryText from '../utilities/formatQueryToSave.ts';

export default async (ctx: Context) => {
  const connectionId: string = await ctx.cookies.get('connectionId');
  const { queryName, queryText } = await ctx.request.body().value;
  const formattedQuery = formatQueryText(queryText);
  if (!connectionId) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in to view your queries';
  }
  await addQuery(connectionId, queryName, formattedQuery);
  ctx.response.status = 200;
  ctx.response.body = 'Successfully added new query';
  return;
};
