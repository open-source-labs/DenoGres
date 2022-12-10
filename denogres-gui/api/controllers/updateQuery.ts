import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import { updateQuery } from '../repositories/userRepo.ts';
import formatQueryText from '../utilities/formatQueryToSave.ts';

export default async (ctx: Context) => {
  const { queryName, queryText, queryId } = await ctx.request.body().value;
  const formattedQuery = formatQueryText(queryText);
  if (!queryName) {
    ctx.response.status = 401;
    ctx.response.body = 'Please log in to view your queries';
  }
  await updateQuery(queryName, formattedQuery, queryId);
  ctx.response.status = 200;
  ctx.response.body = 'Successfully updated query';
  return;
};
