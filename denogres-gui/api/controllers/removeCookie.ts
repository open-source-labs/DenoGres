import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";


export default async (ctx: Context) => {
    ctx.cookies.delete('userId');
    ctx.cookies.delete('jwt');
    return ctx.response.status = 200;
}