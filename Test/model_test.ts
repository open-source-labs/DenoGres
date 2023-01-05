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
 * when a user creates a new model instance, adds properties to it, and invokes the 'save' method
 * 1) a query will be sent to the user's db adding a new row to the corresponding table with
 * those prop/value pairs (props representing column names)
 * 2) the added row (returned by the query) will be stored on the record property of the model instance
 * 3) the model instance will be returned
 * 
 * EDGE CASES:
 * - the user invokes the save method without adding any properties
 * - the user invokes the save method without adding a property that is required
 * - the user invokes the save method after adding a property that does not correspond to a column name
 * - the user invokes the save method after adding a property set to a value of the wrong type
 * - the query results in an error or undefined for unforseen reasons
 * - the user tries to chain the save method after another method
 */

/**
 * UPDATE:
 * when a user adds properties to a model instance they've already saved to the db and invokes 'update':
 * 1) a query will be sent to the user's db targetting the row in the table represented by that instance
 * (as stored at the 'record' property when the 'save' method was invoked)
 * 2) the query will update the row with the new key/value pairs added by the user
 * 3) the updated row (returned by the query) will be stored on the record property of the model instance
 * 4) the model instance will be returned 
 * 
 * EDGE CASES:
 * - the user invokes the update method on a model instance that hasn't been saved to the db already
 * - ^^^ same edge cases as for the save method
 */