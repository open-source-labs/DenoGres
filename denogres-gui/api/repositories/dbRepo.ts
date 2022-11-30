import client from "../db/database.ts"

export const allTables = () => {
  return client.queryArray("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
};

export const columnNames = (tableName: string) => {
  return client.queryArray({
    text: "SELECT column_name, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name=$1",
    args: [tableName]
  })
};

export default { 
  allTables,
  columnNames,
};