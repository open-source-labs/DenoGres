import { allTables } from "../repositories/userRepo.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";

export default async ({ response }: Context) => {
  response.body = await allTables();
};