# Methods

## Instance Methods

### **Save**

#### Expected Behavior:
> when a user creates a new model instance, adds properties to it, and invokes the `save` method...
> - a query will be sent to the user's db adding a new row to the corresponding table with
> those prop/value pairs (props representing column names)
> - the added row (returned by the query) will be stored on the record property of the model instance
> - the model instance will be returned

#### Edge Cases:
> - the user invokes the save method without adding any properties
> - the user invokes the save method without adding a property that is required
> - the user invokes the save method after adding a property that does not correspond to a column name
> - the user invokes the save method after adding a property set to a value of the wrong type
> - the query results in an error or undefined for unforseen reasons
> - the user tries to chain the save method after another method

### **Update**

#### Expected Behavior:
> when a user adds properties to a model instance they've already saved to the db and invokes `update`...
> - a query will be sent to the user's db targetting the row in the table represented by that instance
> (as stored at the `record` property when the `save` method was invoked)
> - the query will update the row with the new key/value pairs added by the user
> - the updated row (returned by the query) will be stored on the record property of the model instance
> - the model instance will be returned 

#### Edge Cases:
> - the user invokes the update method on a model instance that hasn't been saved to the db already
> - ^^^ same edge cases as for the save method

## Model Methods

### **Insert**

#### Expected Behavior:
> when a user invokes the `insert` method on a model class and passes in one or more strings of the form
> `column_name = value`...
> - a query will be stored at the `sql` property of the class
> - query will be of the form `INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...)`
> - when executed, query will add a new row to the db table with values in corresponding columns
> - method itself returns the model (with query string appended)
> - when chained with `query` method, returns empty array

#### Edge Cases:
> - the user invokes the insert method without any arguments
> - the user invokes the insert method with malformatted arguments
> - the user invokes the insert method with column names that don't exist on the table
> - the user invokes the insert method with values that are the wrong type for their column
> - the user invokes the insert method with different values for the same column
> - the user chains the insert method with incompatible methods

#### Lacking Functionality:
> - have to specify column names--can't just `INSERT INTO table_name VALUES (...)`
> - can't insert multiple rows at once
> - can't insert a row with all default values
> - can't chain insert with the select method to insert rows from another table

### **Delete**

#### Expected Behavior:
> when a user invokes the `delete` method on a model class (without any parameters)...
> - the query `DELETE FROM table_name` will be stored at the `sql` property of the class
> - the method itself returns the model (with query string appended)
> - when executed (with `query` method), will delete entire table associated with model and return empty array
> - when chained with `where` method, will delete only rows where conditions are met

#### Edge Cases:
> - the user chains delete with incompatible methods

### **Select**

#### Expected Behavior:
> when a user invokes the `select` method on a model class with one or more column names passed in...
> - the query `SELECT column_name1, column_name2, ... FROM table_name` will be stored at the `sql` property of the class
> - the method itself returns the model (with query string appended)
> - when executed itself (with `query` method), will return those columns from all rows as an array of objects
> - when chained with `where` method, will return only rows that meet conditions

#### Edge Cases:
> - user invokes without any arguments
> - user invokes with columns that aren't in the table
> - user chains with incompatible methods

#### Lacking Functionality:
> - user could theoretically use aliases with `AS` but no documentation/explicit support for it

### **Where**

#### Expected Behavior:
> when a user invokes the `where` method on a model class with one or more conditions of the form
> `column_name = value`, `AND column_name > value`, or `OR column_name LIKE value`...
> - if not chained onto another method, the query `SELECT * FROM table_name` is stored at the `sql` property on the class
> - conditions are split on the following characters: =, >, <, >=, <=, LIKE
> - the second half of the condition is wrapped in single quotes
> - the string `WHERE condition1, condition2, ...` is appended to the `sql` property
> - the method itself returns the model (with query string appended)

#### Edge Cases:
> - the user invokes without any arguments
> - the user invokes with malformatted conditions (or unsupported syntax)
> - the user invokes with column names not on the table
> - the user invokes with values of the wrong type for their columns
> - the user chains with incompatible methods

#### Lacking Functionality:
> - can't specify condition where column_name `IS NOT NULL`
> - can't use `IN` keyword, ex: `WHERE column_name IN ( value1, value2, ... )`
> - can't use `BETWEEN` keyword, ex: `WHERE column_name BETWEEN value1 AND value2`
> - can't chain with `select` subquery, ex: `WHERE column_name = (SELECT ....)`
> - can't use the not equal operators `<>` or `!=`
> - with more than one condition, the user must provide connecting words like `AND` and `OR`
> - user must know SQL syntax for specifications like 'starts with' or 'contains'

### **Limit**

#### Expected Behavior:
> when a user invokes the `limit` method on a model class with a number...
> - the query string `LIMIT number` is appended to the `sql` property of the model class
> - the model is returned (with query string appended)
> - when executed along with a select query, will limit the number of rows returned

#### Edge Cases:
> - the user invokes without any arguments
> - the user invokes with the wrong type of argument

### **Having**

#### Expected Behavior:
> when a user invokes the `having` method with one or more conditions that use an aggregate function (ex: `SUM(height) > 100`)...
> - the query string `HAVING condition1, condition2, ...` is appended to the `sql` property of the model class
> - the model is returned (with query string appended)
> - when chained after the `select` and `group` methods and executed with `query`, returns rows that meet the condition

#### Edge Cases:
> - the user invokes without any arguments
> - the user invokes with a malformatted condition
> - the user invokes with column names not in the table
> - the user chains with incompatible methods

#### Lacking Functionality:
> - user must write the aggregate function in the condition, can't use the built in aggregate methods

### **Joins**

#### Expected Behavior:
> when a user invokes any of the `join` methods with three arguments: column1, column2, and 2nd table to join...
> - the query string `INNER/LEFT/RIGHT/FULL JOIN table_name2 ON table_name1.column1 = table_name2.column2` is appended to the `sql` property of the model class
> - the model is returned (with query string appended)
> - when executed after the `select` method, returns rows at intersection of the two tables (depending on join type)

#### Edge Cases:
> - the user invokes without any arguments
> - the user invokes with column names or table names not in the database
> - the user chains with incompatible methods

#### Lacking Functionality:
> - user must specify table names (and potential aliases) in select inputs, ex:
`Planet.select('planets.name AS planet_name', 'species.name AS species_name').innerJoin('_id', 'homeworld_id', 'species')`

### **Group**

#### Expected Behavior:
> when user invokes the `group` method with one or more column names, often including aggregate functions of the form `max(column_name)`...
> - the query string `GROUP BY column_name1, column_name2, ...` is appended to the `sql` property on the model class
> - the model is returned (with query string appended)
> - when executed after the `select` method, returns all rows with same value for passed in column(s) into one 'summary row'

#### Edge Cases:
> - the user invokes without any arguments
> - the user invokes with column names not on the table
> - the user chains with incompatible methods

#### Lacking Functionality:
> - user must write the aggregate function in the condition, can't use the built in aggregate methods

### **Order**

#### Expected Behavior:
> when user invokes the `order` method with the string `ASC` or `DESC` and one or more column names...
> - the query string `ORDER BY column_name1, column_name2, ... ASC/DESC` is appended to the `sql` property on the model class
> - the model is returned (with query string appended)
> - when executed after the `select` method, returns rows sorted by column names (all ascending or all descending)

#### Edge Cases:
> - the user invokes without any arguments
> - the user invokes without either `ASC` or `DESC`
> - the user invokes with column names not on the table
> - the user chains with incompatible methods

#### Lacking Functionality:
> - can't order some columns in ascending order and others in descending order
> - doesn't default to ascending (have to specify either ascending or descending)

### **Aggregate Functions**

#### Expected Behavior:
> when user invokes any of the aggregate functions `count`, `sum`, `avg`, `min`, `max` with a column name...
> - the query string `SELECT COUNT/SUM/AVG/MIN/MAX(column_name) FROM table_name` is appended to the `sql` property on the model class
> - the model is returned (with query string appended)
> - when executed (with the `query` method), returns single row with result of aggregate function

#### Edge Cases:
> - the user invokes without a column name from the table
> - the user chains with incompatible methods

#### Lacking Functionality:
> - can only be used to select rows, not as part of other query clauses like `having` and `group by`
> - can only select a single aggregate function, can't select multiple columns including an aggregate function

## Query Methods

### **Query**

#### Expected Behavior:
> when user invokes the `query` method (with an optional `uri`), chained on after one or more other model methods...
> - a connection is opened with the user's database (either through the input `uri` or the uri specified in the user's .env file)
> - the query string found on the `sql` property of the model is sent to the database
> - the `sql` property on the model is reset to an empty string
> - the connection with the database is closed
> - if executing the query returned a result, the rows from that result are returned to the user as an array of objects, where each object represents a row
> - otherwise undefined is returned

#### Edge Cases:
> - the user invokes before chaining on any methods to build the necessary query string
> - the user invokes with a malformatted query string
> - the user invokes without a valid uri in the input or .env file

### **Query Instance**

#### Expected Behavior:
> when user invokes the `queryInstance` method (with optional arguments `uri` and `print`), chained on after the `select` (or `where` method on its own)...
> - a connection is opened with the user's database (either the input `uri` or the uri specified in the user's .env file)
> - if `print` is specified, the query string found on the `sql` property is printed to the console
> - the query string is sent to the database
> - the `sql` property on the model is reset to an empty string
> - the connection with the database is closed
> - a new instance of the model is returned with property/value pairs representing the first row returned from the query

#### Edge Cases:
> - the user invokes before chaining on any methods to build the necessary query string
> - the user invokes with a malformatted query string
> - the user invokes without a valid uri in the input or .env file
> - the user's query doesn't yield any results from the database


