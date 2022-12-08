import client from "../connections/userDatabase.ts"

// checkUser checks to see if a username is in the database, if it is, it returns the hashed pw associated with that user, for comparison
export const checkUser = async (username: string): Promise<string> => {
  const result  = await client.queryObject({
    text: "SELECT * FROM users WHERE username=$1",
    args: [username]
  })
  const userID: string = result.rows[0].id;
  return userID;
}

// checkPW checks to see if a password is in the database, using encryption
export const checkPW = async (username: string): Promise<string> => {
  const result  = await client.queryObject({
    text: "SELECT password FROM users WHERE username=$1",
    args: [username]
  })
  const hashedPass: string = result.rows[0].password;
  return hashedPass;
}

// createUser

// addConnection

// addQuery

export default { 
  checkUser,
  checkPW
};