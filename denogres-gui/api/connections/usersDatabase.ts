import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

//! TESTING ONLY - MUST NOT BE HARDCODED HERE IN THE PRODUCTION CODE

const client = new Client({
  user: "bheazclb",
  database: "bheazclb",
  hostname: "kashin.db.elephantsql.com",
  password: "1i_gDuUEk9FSlwrtSl2BzEs0a3CMPwm6",
  port: 5432,
});

await client.connect();

export default client;