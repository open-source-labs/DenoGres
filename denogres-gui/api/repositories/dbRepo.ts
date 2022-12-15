import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import {
  sampleConstraints,
  sampleTables,
  sampleColumns,
} from '../connections/sampleDatabase.ts';

interface ConnectionSettings {
  user_id: string;
  connection_name: string;
  connection_address: string;
  port_number: number;
  default_db: string;
  db_username: string;
  db_password: string;
}
export const allTables = async (connection: ConnectionSettings) => {
  if (!connection) {
    return sampleTables;
  }
  const client = new Client({
    user: connection.db_username,
    database: connection.default_db,
    hostname: connection.connection_address,
    password: connection.db_password,
    port: connection.port_number,
  });
  const response = await client.queryArray(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'"
  );
  client.end();
  return response;
};

export const columnNames = async (
  tableName: string,
  connection: ConnectionSettings
) => {
  if (!connection) {
    return sampleConstraints;
  }
  const client = new Client({
    user: connection.db_username,
    database: connection.default_db,
    hostname: connection.connection_address,
    password: connection.db_password,
    port: connection.port_number,
  });
  const response = await client.queryArray({
    text: 'SELECT column_name, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name=$1',
    args: [tableName],
  });
  client.end();
  return response;
};

export const allConstraints = async (connection: ConnectionSettings) => {
  if (!connection) {
    return sampleConstraints;
  }
  console.log('in all constraints', connection);
  const client = new Client({
    user: connection.db_username,
    database: connection.default_db,
    hostname: connection.connection_address,
    password: connection.db_password,
    port: connection.port_number,
  });
  const response = await client.queryArray(
    'SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name'
  );
  client.end();
  return response;
};

export default {
  allTables,
  columnNames,
  allConstraints,
};
