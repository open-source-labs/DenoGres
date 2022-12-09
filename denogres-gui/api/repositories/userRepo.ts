import client from '../connections/userDatabase.ts';

// checkUser checks to see if a username is in the database, if it is, it returns the hashed pw associated with that user, for comparison
export const checkUser = async (
  username: string
): Promise<string | undefined> => {
  try {
    const result = await client.queryObject({
      text: 'SELECT id FROM users WHERE username=$1',
      args: [username],
    });
    if (result.rows && result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      return undefined;
    }
  } catch (err) {
    // Handle the error and log it or throw it as needed
    console.error(err);
    return undefined;
  }
};

// checkPW checks to see if a password is in the database, using encryption
export const checkPW = async (username: string): Promise<string> => {
  const result = await client.queryObject({
    text: 'SELECT password FROM users WHERE username=$1',
    args: [username],
  });
  const hashedPass: string = result.rows[0].password;
  return hashedPass;
};

// createUser
export const createUser = async (
  username: string,
  hashedPW: string
): Promise<string> => {
  const checkUserID = checkUser(username);
  if ((await checkUserID) === undefined) {
    console.log('username:', username);
    console.log('hashedPW:', hashedPW);
    const result = await client.queryObject({
      text: 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      args: [username, hashedPW],
    });
    console.log(result);
    const userID: string = result.rows[0].id;
    return userID;
  } else {
    return 'User already exists';
  }
};

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
export const addConnection = async (
  userID: string,
  connectionName: string
): Promise<void> => {};

// get all connections for a user
export const getAllConnections = async (userID: string): Promise<any> => {
  const result = await client.queryObject({
    text: 'SELECT * FROM connections WHERE user_id=$1',
    args: [userID],
  });
  return result.rows;
};

// addQuery

export default {
  checkUser,
  checkPW,
  getAllConnections,
  createUser,
};
