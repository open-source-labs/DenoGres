import { beforeAll, afterAll, afterEach } from './deps.ts';
import { Model } from '../src/class/Model.ts'

beforeAll(async () => {
  // connect to the database
});

afterAll(async () => {
  // close database connection
});

afterEach(async () => {
  // clear the database
})

/**
 * SAVE:
 * when a user creates a new model instance, adds properties to it,
 * and invokes the 'save' method on that instance, a query will be
 * sent to the user's db adding a new row to the corresponding table
 * with those prop/value pairs (props representing column names) and
 * the added row (returned by the query) will be stored at the private
 * 'record' property on the model instance
 */

/**
 * UPDATE:
 * 
 */