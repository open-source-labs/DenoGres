import client from "../connections/userDatabase.ts"

//? userRepo is the repository for user-related queries - aka anything dealing with our USER database - not the database the user is connected to

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


// add a new connection to user's list of connections
interface ConnectionSettings {
  user_id: string;
  connection_name: string;
  connection_address: string;
  port_number: number;
  default_db: string;
  db_username: string;
  db_password: string;
}
export const addConnection = async (newConnection: ConnectionSettings): Promise<any> => {
  const result = await client.queryObject({
    text: "INSERT INTO connections (user_id, connection_name, connection_address, port_number, default_db, db_username, db_password) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    args: [newConnection.user_id, newConnection.connection_name, newConnection.connection_address, newConnection.port_number, newConnection.default_db, newConnection.db_username, newConnection.db_password]
  });
  return result;
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
  addConnection,
};