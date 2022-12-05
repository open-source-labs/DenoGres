import client from "../connections/userDatabase.ts"

//! allTables is a test function only
export const allTables = () => {
  return client.queryArray("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
};

// checkUser checks to see if a username is in the database, if it is, it returns the hashed pw associated with that user, for comparison
export const checkUser = async (username: string): boolean => {
  const result  = await client.queryObject({
    text: "SELECT password FROM users WHERE username=$1",
    args: [username]
  })
  const hashedPass: string = result.rows[0].password
  if (!hashedPass) {
    return false;
  } else return true;
}

// checkPW checks to see if a password is in the database, using encryption
export const checkPW = (password: string) => {
  console.log('checkPW Function' + password)
}
// createUser

// addConnection

// addQuery

export default { 
  allTables,
  checkUser,
  checkPW
};