import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
let client: Client;

// Function to initialize the connection
export const initClient = async (connection) => {
  console.log(connection.port_number);
  const client = new Client({
    user: connection.db_username,
    database: connection.default_db,
    hostname: connection.connection_address,
    password: connection.db_password,
    port: connection.port_number,
  });
  console.log('THIS IS THE NEW CLIENT', client);
  client.connect();
};

export const getClient = () => client;
