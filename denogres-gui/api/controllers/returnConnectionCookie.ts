import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';

export default async (ctx: Context) => {
  const connectionId: string = await ctx.cookies.get('connectionId');
  

  if (!connectionId) {
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify({
      hasConnection: false,
    });
    return;
  } else if (connectionId) {
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify({
      hasConnection: true,
    });
    return;
  } else return (ctx.response.status = 500);
};
