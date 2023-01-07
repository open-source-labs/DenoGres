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

/**
 * INSERT:
 * when a user invokes the 'insert' method on a model class and passes in one or more strings of the form
 * 'column_name = value':
 * 1) a query will be stored at the 'sql' property of the class
 * 2) query will be of the form 'INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...)
 * 3) when executed, query will add a new row to the db table with values in corresponding columns
 * 4) method itself returns the model (with query string appended)
 * 5) when chained with 'query' method, returns empty array
 * 
 * EDGE CASES:
 * - the user invokes the insert method without any arguments
 * - the user invokes the insert method with malformatted arguments
 * - the user invokes the insert method with column names that don't exist on the table
 * - the user invokes the insert method with values that are the wrong type for their column
 * - the user invokes the insert method with different values for the same column
 * - the user chains the insert method with incompatible methods
 * 
 * LACKING FUNCTIONALITY:
 * - have to specify column names--can't just INSERT INTO table_name VALUES (...)
 * - can't insert multiple rows at once
 * - can't insert a row with all default values
 * - can't chain insert with the select method to insert rows from another table
 */

/**
 * EDIT:
 * 
 */

/**
 * DELETE:
 * when a user invokes the 'delete' method on a model class (without any parameters):
 * 1) the query 'DELETE FROM table_name' will be stored at the 'sql' property of the class
 * 2) the method itself returns the model (with query string appended)
 * 3) when executed (with 'query' method), will delete entire table associated with model and return empty array
 * 4) when chained with 'where' method, will delete only rows where conditions are met
 * 
 * EDGE CASES:
 * - the user chains delete with incompatible methods
 */

/**
 * SELECT:
 * when a user invokes the 'select' method on a model class with one or more column names passed in:
 * 1) the query 'SELECT column_name1, column_name2, ... FROM table_name' will be stored at the 'sql' property of the class
 * 2) the method itself returns the model (with query string appended)
 * 3) when executed itself (with 'query' method), will return those columns from all rows as an array of objects
 * 4) when chained with 'where' method, will return only rows that meet conditions
 * 
 * EDGE CASES:
 * - user invokes without any arguments
 * - user invokes with columns that aren't in the table
 * - user chains with incompatible methods
 * 
 * LACKING FUNCTIONALITY:
 * - user could theoretically use aliases with 'AS' but no documentation/explicit support for it
 */

/**
 * WHERE:
 * when a user invokes the 'where' method on a model class with one or more conditions of the form
 * 'column_name = value', 'column_name > value', or 'column_name LIKE value':
 * 1) if not chained onto another method, the query 'SELECT * FROM table_name' is stored at the 'sql' property on the class
 * 2) conditions are split on the following characters: =, >, <, >=, <=, LIKE
 * 3) the second half of the condition is wrapped in single quotes
 * 4) the string 'WHERE condition1, condition2, ...' is appended to the 'sql' property
 * 5) the method itself returns the model (with query string appended)
 * 
 * EDGE CASES:
 * - the user invokes without any arguments
 * - the user invokes with malformatted conditions (or unsupported syntax)
 * - the user invokes with column names not on the table
 * - the user invokes with values of the wrong type for their columns
 * - the user chains with incompatible methods
 * 
 * LACKING FUNCTIONALITY:
 * - can't specify condition where column_name 'IS NOT NULL'
 * - can't use 'IN' keyword, ex: 'WHERE column_name IN ( value1, value2, ... )'
 * - can't use 'BETWEEN' keyword, ex: 'WHERE column_name BETWEEN value1 AND value2'
 * - can't chain with 'select' subquery, ex: 'WHERE column_name = (SELECT ....)'
 * - can't use the not equal operators '<>' or '!='
 */

/**
 * LIMIT:
 * when a user invokes the 'limit' method on a model class with a number:
 * 1) the query string 'LIMIT number' is appended to the 'sql' property of the model class
 * 2) the model is returned (with query string appended)
 * 3) when executed along with a select query, will limit the number of rows returned
 * 
 * EDGE CASES:
 * - the user invokes without any argument
 * - the user invokes with the wrong type of argument
 */