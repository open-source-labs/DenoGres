import client from "../connections/usersDatabase.ts"

export const allTables = () => {
  return client.queryArray("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
};


export default { 
  allTables,
};