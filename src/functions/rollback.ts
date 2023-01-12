import { DisconnectDb } from './Db.ts';

// Error for a failed transaction
export async function rollback(model: any): Promise<void> {
  // should rollback the query and disconnect from the db
  try {
    await model.transactionConnection.queryObject('ROLLBACK;');
    DisconnectDb(model.transactionConnection);
    model.transactionInProgress = false;
  } catch (err) {
    throw new Error('Rollback failed: ', err);
  }
}
