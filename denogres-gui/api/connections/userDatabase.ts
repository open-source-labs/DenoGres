import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts"

const env = config({
  path: "./api/userDB.env"
});

const client = new Client({
  user: env.USERDB_USERNAME,
  database: env.USERDB_DB,
  hostname: env.USERDB_HOST,
  password: env.USERDB_PASSWORD,
  port: env.USERDB_PORT
});

await client.connect();

export default client;