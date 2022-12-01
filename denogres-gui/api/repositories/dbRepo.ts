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

export const allConstraints = (tableName: string) => {
  return client.queryArray({
    text: "SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE tc.table_name=$1;",
    args: [tableName]
  });
}


export default { 
  allTables,
  columnNames,
  allConstraints
};