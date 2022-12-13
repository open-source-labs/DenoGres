import { allTables } from "../repositories/dbRepo.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";

export default async (ctx: Context) => {
  ctx.response.body = await allTables(ctx.request.body.value());
};