# DenoGres
Import Path: https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts

To install CLI: deno install --allow-read --allow-write --allow-net --allow-env --name denogres https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts

**How to use DenoGres methods**
 
Note: x represents a comparison operator (=, >, <, >=, <=, <>, LIKE)
NOT can be added before any arguments in the WHERE method


**SAVE: insert created properties on instance object into database
instance.save();

**UPDATE: update the properties on instance object and the database
instance.update(); 

**INSERT INTO VALUES: add value(s) to column(s) in this table
input: (column = value, ...)
Model.prototype.insert(...rows: string[])

**UPDATE: update existing records in database
input: (column = value, ...)
Model.prototype.edit(...rows: string[])

**DELETE FROM: delete table
input: none
Model.prototype.delete()

**SELECT FROM: select column(s) from this table
input: (column, ...)
Model.prototype.filter(...columns: string[])

**WHERE: add condition(s) to query
input: (column x value, AND/OR column x value, ...)
Model.prototype.where(...condition: string[])

**LIMIT: limit number of output rows
input: (limitNumber)
Model.prototype.limit(limit: number)

**HAVING: add condition(s) involving aggregate functions to query
input: (aggregateFn(column) x number); example: (COUNT(column) > 5)
Model.prototype.having(...conditions: string[])

** INNER JOIN: selects records with matching values on both table
input: (column1, column2, table2)
Model.prototype.innerJoin(column1: string, column2: string, table2: string)

**LEFT JOIN: selects records from this table and matching values on table2
input: (column1, column2, table2)
Model.prototype.leftJoin(column1: string, column2: string, table2: string)

**RIGHT JOIN: selects records from table2 and matching values on this table
input: (column1, column2, table2)
Model.prototype.innerJoin(column1: string, column2: string, table2: string)

**FULL Join: selects all records when a match exists in either table
input: (column1, column2, table2)
Model.prototype.fullJoin(column1: string, column2: string, table2: string)

**GROUP BY: group rows with same values into summary rows
input: (column, ...)
Model.prototype.group(...columns: string[])

**ORDER BY: sort column(s) by ascending/descending order
input: for (order: string), order should be either ASC or DESC
Model.prototype.order(order: string, ...column: string[])

**AVG-COUNT-SUM-MIN-MAX: calculate aggregate functions
input: (column)
Model.prototype.avg(column: string)
Model.prototype.count(column: string)
Model.prototype.sum(column: string)
Model.prototype.min(column: string)
Model.prototype.max(column: string)

**Execute query in database
Model.prototype.query()

