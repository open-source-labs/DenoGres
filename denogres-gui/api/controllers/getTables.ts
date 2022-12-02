import { allTables } from "../repositories/dbRepo.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";

export default async ({ response }: Context) => {
  console.log('getTables middleware')
  response.body = await allTables();
};