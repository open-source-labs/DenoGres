import client from "../connections/userDatabase.ts"

//! allTables is a test function only
export const allTables = () => {
  return client.queryArray("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
};

// checkUser checks to see if a username is in the database

// checkPW checks to see if a password is in the database, using encryption

// createUser

// addConnection

// addQuery

export default { 
  allTables,
};