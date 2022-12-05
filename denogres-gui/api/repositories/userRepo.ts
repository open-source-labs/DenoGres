import client from "../connections/userDatabase.ts"

//! allTables is a test function only
export const allTables = () => {
  return client.queryArray("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
};

// checkUser checks to see if a username is in the database, if it is, it returns the hashed pw associated with that user, for comparison
export const checkUser = (username: string) => {
  const hashedPass: Object = client.queryObject({
    text: "SELECT password FROM users WHERE name=$1",
    args: [username]
  })
  console.log(hashedPass);
}

// checkPW checks to see if a password is in the database, using encryption

// createUser

// addConnection

// addQuery

export default { 
  allTables,
  checkUser,
};