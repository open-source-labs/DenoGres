# Methods

## Instance Methods

### **Save**

#### Expected Behavior:

> when a user creates a new model instance, adds properties to it, and invokes
> the `save` method...
>
> - a query will be sent to the user's db adding a new row to the corresponding
>   table with those prop/value pairs (props representing column names)
> - the added row (returned by the query) will be stored on the record property
>   of the model instance
> - the model instance will be returned

#### Edge Cases:

> - the user invokes the save method without adding any properties
> - the user invokes the save method without adding a property that is required
> - the user invokes the save method after adding a property that does not
>   correspond to a column name
> - the user invokes the save method after adding a property set to a value of
>   the wrong type
> - the query results in an error or undefined for unforseen reasons
> - the user tries to chain the save method after another method

### **Update**

#### Expected Behavior:

> when a user adds properties to a model instance they've already saved to the
> db and invokes `update`...
>
> - a query will be sent to the user's db targetting the row in the table
>   represented by that instance (as stored at the `record` property when the
>   `save` method was invoked)
> - the query will update the row with the new key/value pairs added by the user
> - the updated row (returned by the query) will be stored on the record
>   property of the model instance
> - the model instance will be returned

#### Edge Cases:

> - the user invokes the update method on a model instance that hasn't been
>   saved to the db already
> - ^^^ same edge cases as for the save method

## Model Methods

### **Insert**

#### Expected Behavior:

> when a user invokes the `insert` method on a model class and passes in one or
> more strings of the form `column_name = value`...
>
> - a query will be stored at the `sql` property of the class
> - query will be of the form
>   `INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...)`
> - when executed, query will add a new row to the db table with values in
>   corresponding columns
> - method itself returns the model (with query string appended)
> - when chained with `query` method, returns empty array

#### Edge Cases:

> - the user invokes the insert method without any arguments
> - the user invokes the insert method with malformatted arguments
> - the user invokes the insert method with column names that don't exist on the
>   table
> - the user invokes the insert method with values that are the wrong type for
>   their column
> - the user invokes the insert method with different values for the same column
> - the user chains the insert method with incompatible methods

#### Lacking Functionality:

> - have to specify column names--can't just
>   `INSERT INTO table_name VALUES (...)`
> - can't insert multiple rows at once
> - can't insert a row with all default values
> - can't chain insert with the select method to insert rows from another table
> - no error handling for no arguments

### **Delete**

#### Expected Behavior:

> when a user invokes the `delete` method on a model class (without any
> parameters)...
>
> - the query `DELETE FROM table_name` will be stored at the `sql` property of
>   the class
> - the method itself returns the model (with query string appended)
> - when executed (with `query` method), will delete entire table associated
>   with model and return empty array
> - when chained with `where` method, will delete only rows where conditions are
>   met

#### Edge Cases:

> - the user chains delete with incompatible methods

### **Select**

#### Expected Behavior:

> when a user invokes the `select` method on a model class with one or more
> column names passed in...
>
> - the query `SELECT column_name1, column_name2, ... FROM table_name` will be
>   stored at the `sql` property of the class
> - the method itself returns the model (with query string appended)
> - when executed itself (with `query` method), will return those columns from
>   all rows as an array of objects
> - when chained with `where` method, will return only rows that meet conditions

#### Edge Cases:

> - user invokes without any arguments
> - user invokes with columns that aren't in the table
> - user chains with incompatible methods

#### Lacking Functionality:

> - user could theoretically use aliases with `AS` but no documentation/explicit
>   support for it

### **Where**

#### Expected Behavior:

> when a user invokes the `where` method on a model class with one or more
> conditions of the form `column_name = value`, `AND column_name > value`, or
> `OR column_name LIKE value`...
>
> - if not chained onto another method, the query `SELECT * FROM table_name` is
>   stored at the `sql` property on the class
> - conditions are split on the following characters: =, >, <, >=, <=, LIKE
> - the second half of the condition is wrapped in single quotes
> - the string `WHERE condition1, condition2, ...` is appended to the `sql`
>   property
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
> - can't use `BETWEEN` keyword, ex:
>   `WHERE column_name BETWEEN value1 AND value2`
> - can't chain with `select` subquery, ex: `WHERE column_name = (SELECT ....)`
> - can't use the not equal operators `<>` or `!=`
> - with more than one condition, the user must provide connecting words like
>   `AND` and `OR`
> - user must know SQL syntax for specifications like 'starts with' or
>   'contains'

### **Limit**

#### Expected Behavior:

> when a user invokes the `limit` method on a model class with a number...
>
> - the query string `LIMIT number` is appended to the `sql` property of the
>   model class
> - the model is returned (with query string appended)
> - when executed along with a select query, will limit the number of rows
>   returned

#### Edge Cases:

> - the user invokes without any arguments
> - the user invokes with the wrong type of argument

### **Having**

#### Expected Behavior:

> when a user invokes the `having` method with one or more conditions that use
> an aggregate function (ex: `SUM(height) > 100`)...
>
> - the query string `HAVING condition1, condition2, ...` is appended to the
>   `sql` property of the model class
> - the model is returned (with query string appended)
> - when chained after the `select` and `group` methods and executed with
>   `query`, returns rows that meet the condition

#### Edge Cases:

> - the user invokes without any arguments
> - the user invokes with a malformatted condition
> - the user invokes with column names not in the table
> - the user chains with incompatible methods

#### Lacking Functionality:

> - user must write the aggregate function in the condition, can't use the built
>   in aggregate methods

### **Joins**

#### Expected Behavior:

> when a user invokes any of the `join` methods with three arguments: column1,
> column2, and 2nd table to join...
>
> - the query string
>   `INNER/LEFT/RIGHT/FULL JOIN table_name2 ON table_name1.column1 = table_name2.column2`
>   is appended to the `sql` property of the model class
> - the model is returned (with query string appended)
> - when executed after the `select` method, returns rows at intersection of the
>   two tables (depending on join type)

#### Edge Cases:

> - the user invokes without any arguments
> - the user invokes with column names or table names not in the database
> - the user chains with incompatible methods

#### Lacking Functionality:

> - user must specify table names (and potential aliases) in select inputs, ex:
>   `Planet.select('planets.name AS planet_name', 'species.name AS species_name').innerJoin('_id', 'homeworld_id', 'species')`

### **Group**

#### Expected Behavior:

> when user invokes the `group` method with one or more column names, often
> including aggregate functions of the form `max(column_name)`...
>
> - the query string `GROUP BY column_name1, column_name2, ...` is appended to
>   the `sql` property on the model class
> - the model is returned (with query string appended)
> - when executed after the `select` method, returns all rows with same value
>   for passed in column(s) into one 'summary row'

#### Edge Cases:

> - the user invokes without any arguments
> - the user invokes with column names not on the table
> - the user chains with incompatible methods

#### Lacking Functionality:

> - user must write the aggregate function in the condition, can't use the built
>   in aggregate methods

### **Order**

#### Expected Behavior:

> when user invokes the `order` method with the string `ASC` or `DESC` and one
> or more column names...
>
> - the query string `ORDER BY column_name1, column_name2, ... ASC/DESC` is
>   appended to the `sql` property on the model class
> - the model is returned (with query string appended)
> - when executed after the `select` method, returns rows sorted by column names
>   (all ascending or all descending)

#### Edge Cases:

> - the user invokes without any arguments
> - the user invokes without either `ASC` or `DESC`
> - the user invokes with column names not on the table
> - the user chains with incompatible methods

#### Lacking Functionality:

> - can't order some columns in ascending order and others in descending order
> - doesn't default to ascending (have to specify either ascending or
>   descending)

### **Aggregate Functions**

#### Expected Behavior:

> when user invokes any of the aggregate functions `count`, `sum`, `avg`, `min`,
> `max` with a column name...
>
> - the query string `SELECT COUNT/SUM/AVG/MIN/MAX(column_name) FROM table_name`
>   is appended to the `sql` property on the model class
> - the model is returned (with query string appended)
> - when executed (with the `query` method), returns single row with result of
>   aggregate function

#### Edge Cases:

> - the user invokes without a column name from the table
> - the user chains with incompatible methods

#### Lacking Functionality:

> - can only be used to select rows, not as part of other query clauses like
>   `having` and `group by`
> - can only select a single aggregate function, can't select multiple columns
>   including an aggregate function

## Query Methods

### **Query**

#### Expected Behavior:

> when user invokes the `query` method (with an optional `uri`), chained on
> after one or more other model methods...
>
> - a connection is opened with the user's database (either through the input
>   `uri` or the uri specified in the user's .env file)
> - the query string found on the `sql` property of the model is sent to the
>   database
> - the `sql` property on the model is reset to an empty string
> - the connection with the database is closed
> - if executing the query returned a result, the rows from that result are
>   returned to the user as an array of objects, where each object represents a
>   row
> - otherwise undefined is returned

#### Edge Cases:

> - the user invokes before chaining on any methods to build the necessary query
>   string
> - the user invokes with a malformatted query string
> - the user invokes without a valid uri in the input or .env file

### **Query Instance**

#### Expected Behavior:

> when user invokes the `queryInstance` method (with optional arguments `uri`
> and `print`), chained on after the `select` (or `where` method on its own)...
>
> - a connection is opened with the user's database (either the input `uri` or
>   the uri specified in the user's .env file)
> - if `print` is specified, the query string found on the `sql` property is
>   printed to the console
> - the query string is sent to the database
> - the `sql` property on the model is reset to an empty string
> - the connection with the database is closed
> - a new instance of the model is returned with property/value pairs
>   representing the first row returned from the query

#### Edge Cases:

> - the user invokes before chaining on any methods to build the necessary query
>   string
> - the user invokes with a malformatted query string
> - the user invokes without a valid uri in the input or .env file
> - the user's query doesn't yield any results from the database

## Association Methods

### **Belongs To**

#### Expected Behavior:

> when user invokes the `belongsTo` method on a model class, passing in a target
> model (i.e. table to form the association with) and NOT passing in an options
> object...
>
> - a new property is added to the columns object on the model
> - the property's name is the new foreign key column name (of the form >
>   `target_id`)
> - the corresponding value is an object with the propreties: > - `type` set to
>   the type of the primary id on the target model > - `association` set to an
>   object with the following properties: > - `rel_type` set to `belongsTo` > -
>   `table` set to the name of the target table > - `mappedCol` set to the name
>   of the primary id on the target table > (usually `id` or `_id`)
> - a new instance of the `BelongsTo` class is returned with the following
>   passed to the constructor:
> - the current model and the target model
> - a `mappingDetails` object with the properties: > - `association_type` set to
>   `belongsTo` > - `association_name` set to string of the form >
>   `currentTable_belongsTo_targetTable` > - `targetModel` set to the target
>   model itself > - `foreignKey_ColumnName` set to a foreign key of the form
>   `target_id` > - `mapping_ColumnName` set to the name of the primary key on
>   the target > table
> - an `associationQuery` string with two queries (separated by a semicolon):
> - `ALTER TABLE current_table ADD foreignKey_ColumnName type` > -
>   `ALTER TABLE current_table ADD CONSTRAINT fk_foreignKey_ColumnName FOREIGN KEY (foreignKey_ColumnName) REFERENCES target_table ON DELETE SET NULL ON UPDATE CASCADE`
> - note that, to send the `associationQuery` to the user's database, fully
>   establishing the new association, the user must then invoke the
>   `syncAssociation` method on the `BelongsTo` instance returned (see below)

#### Resulting Methods:

> the new instance of the `BelongsTo` class will contain a method called
> `syncAssociation`, which, when invoked...
>
> - opens a connection with the user's database
> - sends the `associationQuery` passed to the instance (see above) to the
>   database
> - disconnects from the user's database
> - returns undefined (regardless of success or failure)

> instantiation of this new `BelongsTo` instance also triggers the addition of a
> getter method (of the form `getModel`, ex: `getSpecies` or `getPlanet`) onto
> the current model, which, when invoked on an instance of that model...
>
> - opens a connection with the user's database
> - sends a query string of the form
>   `SELECT * FROM target_table WHERE target_primaryKey = 'foreignKey_ColumnName'`
>   to the user's database
> - returns the row(s) returned from the database, which should be the row
>   associated with the current model instance, ex:
> - step 1. `await Capital.belongsTo(Country)`
> - step 2. >
>   `const ottawa = await Capital.where('name = Ottawa').queryInstance()`
> - step 3. `const ottawaCountry = await ottawa.getCountry()`
> - `ottawaCountry` should be an array with a single object representing the >
>   row for Canada

### **Has One**

#### Expected Behavior:

> when user invokes the `hasOne` method on a model class, passing in a target
> model (i.e. table to form the association with)...
>
> - the `belongsTo` method is invoked on the target model, passing in the
>   current model along with an options object specifying the `associationName`
>   as `hasOne`, this has all the following effects:
> - a new property is added to the columns object on the target model
> - the property's name is the new foreign key column name (of the form >
>   `model_id` where the model is the original one on which the `hasOne` >
>   method was invoked)
> - the corresponding value is an object with the propreties: > - `type` set to
>   the type of the primary id on the original model > - `association` set to an
>   object with the following properties: > - `rel_type` set to `hasOne` > -
>   `table` set to the name of the original table > - `mappedCol` set to the
>   name of the primary id on the original table > (usually `id` or `_id`)
> - a new instance of the `HasOne` class is returned with the following passed
>   to the constructor:
> - the target model and the original model
> - a `mappingDetails` object with the properties: > - `association_type` set to
>   `belongsTo` (**ISSUE, HARD-CODED**) > - `association_name` set to string of
>   the form > `targetTable_belongsTo_originalTable` (**ISSUE, HARD-CODED**) > -
>   `targetModel` set to the original model > - `foreignKey_ColumnName` set to a
>   foreign key of the form `model_id` > - `mapping_ColumnName` set to the name
>   of the primary key on the original > table
> - an `associationQuery` string with two queries (separated by a semicolon):
> - `ALTER TABLE target_table ADD foreignKey_ColumnName type` > -
>   `ALTER TABLE target_table ADD CONSTRAINT fk_foreignKey_ColumnName FOREIGN KEY (foreignKey_ColumnName) REFERENCES original_table ON DELETE SET NULL ON UPDATE CASCADE`
> - note that, to send the `associationQuery` to the user's database, fully
>   establishing the new association, the user must then invoke the
>   `syncAssociation` method on the `HasOne` instance returned (see below)

#### Resulting Methods:

> the new instance of the `HasOne` class will contain a method called
> `syncAssociation`, which, when invoked...
>
> - opens a connection with the user's database
> - sends the `associationQuery` passed to the instance (see above) to the
>   database
> - disconnects from the user's database
> - returns undefined (regardless of success or failure)

> instantiation of this new `HasOne` instance also triggers the addition of a
> getter method (of the form `getModel`) onto the original model, which, when
> invoked on an instance of that model...
>
> - opens a connection with the user's database
> - sends a query string of the form
>   `SELECT * FROM target_table WHERE target_primaryKey = 'foreignKey_ColumnName'`
>   to the user's database
> - returns the row(s) returned from the database, which should be the row
>   associated with the current model instance, ex:
> - step 1. `await Country.hasOne(Capital)`
> - step 2. >
>   `const canada = await Country.where('name = Canada').queryInstance()`
> - step 3. `const canadaCapital = await canada.getCapital()`
> - `canadaCapital` should be an array with a single object representing the >
>   row for the capital of Canada, Ottowa

### **Has Many**

#### Expected Behavior:

> when user invokes the `hasMany` method on a model class, passing in a target
> model (i.e. table to form the association with)...
>
> - if a relationship between the models already exists, a new instance of the
>   `HasMany` class is returned with the following passed to the constructor:
> - the current model and the target model
> - a `mappingDetails` object with the properties: > - `association_type` set to
>   `hasMany` > - `association_name` set to string of the form >
>   `currentTable_hasMany_targetTable` > - `targetModel` set to the target model
> - `foreignKey_ColumnName` set to the foreign key on the target table > linking
>   it to the current table OR an empty string (if the relationship > does not
>   yet exist) > - `mapping_ColumnName` set to the name of the primary key on
>   the current > table
> - an `associationQuery` set to an empty string (**ISSUE, OBSOLETE**)
> - if a relationship between the models does NOT already exist, an error will
>   be thrown
> - NOTE: this method, unlike the others, does not establish a new relationship
>   between tables but instead returns a HasMany instance representing an
>   existing relationship; to establish a new one-to-many relationship, the docs
>   recommend using the `belongsTo` method

#### Resulting Methods:

> instantiation of the `HasMany` class triggers the addition of a getter method
> (of the form `getModels`, ex: `getPlanets` or `getUsers`) onto the original
> model, which, when invoked on an instance of that model...
>
> - opens a connection with the user's database
> - sends a query string of the form
>   `SELECT * FROM target_table WHERE foreignKey_ColumnName = 'primaryKey'` to
>   the user's database
> - returns the row(s) returned from the database, which should be the rows from
>   the target table associated with the current model instance, ex:
> - step 1. `await Species.hasMany(Person)`
> - step 2. >
>   `const droid = await Species.where('name = Droid').queryInstance()`
> - step 3. `const droidCharacters = await droid.getPersons()`
> - `droidCharacters` should be an array with objects representing the rows >
>   for each droid character

### **Many-To-Many**

#### Expected Behavior:

> when user invokes the `manyToMany` function (independent of a model), passing
> in two models and an options object of the form
> `{ through: join_table_name }`...
>
> - if a relationship between these models already exists, a new instance of the
>   `ManyToMany` class is returned with the following passed to the constructor:
> - the two models (modelA and modelB)
> - a `mappingDetails` object with the properties: > - `association_type` set to
>   `ManyToMany` > - `association_name` set to string of the form
>   `modelA_hasMany_modelB` > - `modelA` set to the first model passed in > -
>   `modelB` set to the second model passed in > - `throughModel` set to the
>   join table name passed into the options object > -
>   `modelA_foreignKey_inThroughModel` set to the name of the foreign key >
>   associated with modelA on the join table > -
>   `modelB_foreignKey_inThroughModel` set to the name of the foreign key >
>   associated with modelB on the join table > - `modelA_mappingKey` set to the
>   name of the primary key on modelA > - `modelB_mappingKey` set to the name of
>   the primary key on modelB
> - an `associationQuery` set to an empty string (**ISSUE, OBSOLETE**)
> - NOTE: this method, like hasMany, cannot currently establish a new
>   relationship between tables but instead returns a ManyToMany instance
>   representing an existing relationship; there is currently no way to
>   establish a new many-to-many relationship

#### Resulting Methods:

> instantiation of the `ManyToMany` class triggers the addition of getter
> methods (of the form `getModels`) onto models A and B, which, when invoked on
> instances of those models...
>
> - opens a connection with the user's database
> - sends the database a query string of the form
>   `SELECT tableA.* FROM tableB INNER JOIN joinTable ON tableB.primaryKey = joinTable.foreignKeyB INNER JOIN tableA ON joinTable.foreignKeyA = tableA.primaryKey WHERE tableA.primaryKey = 'primary_key_on_instance' ORDER BY tableB.primaryKey`
> - returns the rows returned from the database, which should be the rows
>   associated with the current model instance, ex:
> - step 1. `await manyToMany(Person, Film, { through: PeopleInFilm })`
> - step 2. >
>   `const luke = await Person.where('name = Luke Skywalker').queryInstance()`
> - step 3. `const lukeFilms = await luke.getFilms()`
> - `lukeFilms` should be an array with objects representing the rows for each >
>   film Luke is in
