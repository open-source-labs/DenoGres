import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';


export async function setClientInfo(connection) {
  clientInfo.user = connection.db_username;
  clientInfo.database = connection.default_db;
  clientInfo.hostname = connection.connection_address;
  clientInfo.password = connection.db_password;
  clientInfo.port = connection.port_number;

  const client = new Client(clientInfo);
  await client.connect();

  return client;
}
// const client = new Client({
//   user: clientInfo.user,
//   database: clientInfo.database,
//   hostname: clientInfo.hostname,
//   password: clientInfo.password,
//   port: clientInfo.port,
// });

// client.connect();

// export default client;
