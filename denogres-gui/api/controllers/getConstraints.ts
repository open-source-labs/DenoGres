import { allConstraints } from "../repositories/dbRepo.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

export default async ({ response }: Context) => {
  console.log('getTables middleware')
  response.body = await allConstraints();
};