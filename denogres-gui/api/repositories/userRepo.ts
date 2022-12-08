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
/*
  id: number;
  user_id: number;
  connection_name: string;
  connection_address: string;
  port_number: number;
  default_db: string;
  db_username: string;
  db_password: string;
*/
export const addConnection = async (userID: string, connectionName: string): Promise<void> => {
  
}

// get all connections for a user
export const getAllConnections = async (userID: string): Promise<any> => {
  const result = await client.queryObject({
    text: "SELECT * FROM connections WHERE user_id=$1",
    args: [userID]
  })
  return result.rows;
}

// addQuery

export default { 
  checkUser,
  checkPW,
  getAllConnections,
};