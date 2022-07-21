# DenoGres
Import Path: https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts

To install CLI: deno install --allow-read --allow-write --allow-net --allow-env --name denogres https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts

**How to use DenoGres methods**
 
Note: x represents a comparison operator (=, >, <, >=, <=, <>)

**INSERT INTO VALUES: add value(s) to column(s) in this table
input: (column = value, ...)
Model.prototype.add(...rows: string[])

**UPDATE SET: update existing records in database
input: (column = value, ...)
Model.prototype.update(...rows: string[])

**DELETE FROM: delete table
input: none
Model.prototype.delete()

**SELECT FROM: select column(s) from this table
input: (column, ...)
Model.prototype.filter(...columns: string[])

**WHERE: add condition(s) to query
input: (column = value, AND/OR column = value, ...)
Model.prototype.where(...condition: string[])

**LIMIT: limit number of output rows
input: (limitNumber)
Model.prototype.limit(limit: number)

**HAVING: add condition(s) involving aggregate functions to query
input: (aggregateFn(column) x number); example: (COUNT(column) > 5)
Model.prototype.having(...conditions: string[])

**JOIN: join two tables together
input: (type, column1, column2, table2); type = inner, left, right, outer
Model.prototype.join(type: string, column1: string, column2: string, table2: string)

**GROUP BY: group rows with same values into summary rows
input: (column, ...)
Model.prototype.group(...columns: string[])

**ORDER BY: sort column(s) by ascending/descending order
input: for (order: string), order should be either ASC or DESC
Model.prototype.order(order: string, ...column: string[])

**AVG-COUNT-SUM-MIN-MAX: calculate aggregate functions
input: (aggregateFunction, column); aggregateFunction = average, count, sum, min, max
Model.prototype.calculate(type: string, column: string) 

**Execute query in database
Model.prototype.query()

