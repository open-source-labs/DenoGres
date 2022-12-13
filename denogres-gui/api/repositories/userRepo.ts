import client from '../connections/userDatabase.ts';

//? userRepo is the repository for user-related queries - aka anything dealing with our USER database - not the database the user is connected to

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
export const addConnection = async (newConnection): Promise<any> => {
  console.log('hei 1', newConnection);
  console.log('hello', [
    newConnection.user_id,
    newConnection.connection_name,
    newConnection.connection_address,
    newConnection.port_number,
    newConnection.default_db,
    newConnection.db_username,
    newConnection.db_password,
  ]);
  const result = await client.queryObject({
    text: 'INSERT INTO connections (user_id, connection_name, connection_address, port_number, default_db, db_username, db_password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    args: [
      newConnection.user_id,
      newConnection.connectionName,
      newConnection.address,
      newConnection.port,
      newConnection.defaultDB,
      newConnection.username,
      newConnection.password,
    ],
  });
  console.log(result);
  return result;
};

// get all connections for a user
export const getAllConnections = async (userID: string): Promise<any> => {
  const result = await client.queryObject({
    text: 'SELECT * FROM connections WHERE user_id=$1',
    args: [userID],
  });
  return result.rows;
};

// get a specific connection for a user
export const getOneConnection = async (
  userID: string,
  connectionID: string
): Promise<any> => {
  console.log(connectionID)
  console.log(userID)
  const result = await client.queryObject({
    text: 'SELECT * FROM connections WHERE user_id=$1 AND id=$2',
    args: [userID, connectionID],
  });
  console.log(result);
  return result.rows[0];
};

// addQuery
export const getAllQueries = async (connectionId: string): Promise<any> => {
  const result = await client.queryObject({
    text: 'SELECT * FROM queries WHERE connection_id=$1',
    args: [connectionId],
  });
  return result.rows;
};

export const addQuery = async (
  connectionId: string,
  queryName: string,
  formattedQuery: string
): Promise<string> => {
  console.log(connectionId);
  console.log(queryName);
  console.log(formattedQuery);
  const result = await client.queryObject({
    text: `INSERT INTO queries (connection_id, query_name, query_text)
    VALUES ($1, $2, (E'${formattedQuery}')::text)`,
    args: [connectionId, queryName],
  });
  return 'New query created successfully';
};

export const updateQuery = async (
  queryName: string,
  formattedQuery: string,
  queryId: string
): Promise<string> => {
  const result = await client.queryObject({
    text: `UPDATE queries SET
    query_name = $1, query_text = (E'${formattedQuery}')::text
    WHERE id = $2`,
    args: [queryName, queryId],
  });
  return 'New query updated successfully';
};

export const deleteQuery = async (queryId: string): Promise<any> => {
  console.log(queryId);
  const result = await client.queryObject({
    text: `DELETE FROM queries WHERE id = $1`,
    args: [queryId],
  });
  return 'Successfully deleted saved query';
};
export default {
  checkUser,
  checkPW,
  getAllConnections,
  createUser,
  addConnection,
  getAllQueries,
  addQuery,
  getOneConnection,
};
