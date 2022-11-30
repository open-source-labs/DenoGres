import { Client } from 'https://deno.land/x/postgres/mod.ts';

const client = new Client({
  user: "bzopmbyy",
  database: "bzopmbyy",
  hostname: "heffalump.db.elephantsql.com",
  password: "gUrD5br_9QnTAoRdIaJcK54bc3M6Mr0H",
  port: 5432,
});

await client.connect();

export default client;