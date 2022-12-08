import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

//! TESTING ONLY - MUST NOT BE HARDCODED IN THE PRODUCTION CODE
const client = new Client({
  user: "ltolmioe",
  database: "ltolmioe",
  hostname: "kashin.db.elephantsql.com",
  password: "b3aocBfDytGOvtmqZ_NaTgRMteO9_75B",
  port: 5432,
});

await client.connect();

export default client;