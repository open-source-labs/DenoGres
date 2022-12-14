import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";


export default async (ctx: Context) => {
    const isValid = await ctx.cookies.get('jwt')
    // validate JWT
    console.log('JWT',isValid)
    if (!isValid) {
        ctx.response.body = JSON.stringify({
            success: false,
            message: 'Unable to Authenticate User',
            status: 200,
          });
          ctx.response.status = 200;
          return;
    }
  
    else if (isValid) {
        ctx.response.body = JSON.stringify({
        success: true,
        message: 'Successfully Authenticated User',
        status: 200,
      });
      ctx.response.status = 200;
      return;
    }
}