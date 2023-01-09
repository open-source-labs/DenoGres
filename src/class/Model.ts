import { ConnectDb, DisconnectDb } from '../functions/Db.ts';
import { BelongsTo, HasMany, HasOne, ManyToMany } from './Association.ts';
import { FIELD_TYPE } from '../constants/sqlDataTypes.ts';
import { checkColumns, checkUnsentQuery } from '../functions/errorMessages.ts';

export class Model {
  [k: string]: any; // index signature
  static table: string;
  static columns: {
    [key: string]: {
      type: string;
      primaryKey?: boolean;
      notNull?: boolean;
      unique?: boolean;
      checks?: any;
      defaultVal?: string | number | boolean | Date;
      autoIncrement?: boolean;
      association?: {
        rel_type?: string;
        name: string;
        mappedTable: string;
        mappedColumn: string;
      };
      length?: number;
      enumName?: string;
    };
  };
  static checks?: any;
  static unique?: Array<string[]>;
  static primaryKey?: string[];
  private static sql = ''; // stores current db query here until done executing
  static foreignKey?: {
    columns: string[];
    mappedColumns: string[];
    rel_type?: string;
    table: string;
  }[];

  // the only non-static property that exists on the user's model classes by default
  // not directly changeable by the user; when a user invokes the 'save' method on a
  // model instance, the result (i.e. the new row/contents of the instance will be stored here)
  private record = {};

  // inserts properties created by user on instance object (representing a single row) into user's db
  async save() {
    const table = Object.getPrototypeOf(this).constructor.table; // ex: class 'Species' would have table set to 'species'
    const keys = Object.keys(this).filter((keys) => keys !== 'record'); // keys added by the user (representing column names)
    const values = Object.values(this).filter(
      (
        values, // values added by the user (to be added at those columns)
      ) => !(typeof values === 'object' && values !== null),
    );

    Model.sql = ''; // ensures that sql-query-in-progress is empty

    // builds query string to insert new key/value pairs onto table in user's db
    Model.sql += `INSERT INTO ${table} (${keys.toString()}) VALUES (`;
    for (let i = 0; i < values.length; i++) {
      Model.sql += `'${values[i]}'`;
      if (i !== values.length - 1) Model.sql += ', ';
      else Model.sql += ')';
    }
    // ensures that the query will return the newly created row
    Model.sql += ` RETURNING *`;
    // sends query to user's database by invoking 'query' method on the model
    const results = await Model.query();
    // stores the newly added row object at the 'record' property of the instance
    if (results && typeof results[0] === 'object' && results[0] !== null) {
      this.record = results[0];
    }
    Model.sql = '';
    return this;
  }

  // updates database with properties (i.e. columns) reassigned by user on instance ALREADY added to db by user
  async update() {
    const table = Object.getPrototypeOf(this).constructor.table;
    const newKeys = Object.keys(this).filter((keys) => keys !== 'record'); // new keys added by user
    const newValues = Object.values(this).filter(
      (
        values, // new values added by user
      ) => !(typeof values === 'object' && values !== null),
    );
    const keys = Object.keys(this.record); // keys previously added by user (and stored in record by 'save' method)
    const values = Object.values(this.record); // values previously added by user

    Model.sql = '';
    // builds query string to update table in user's db, setting newly assigned keys (columns) to their values
    Model.sql += `UPDATE ${table} SET`;
    for (let i = 0; i < newKeys.length; i++) {
      Model.sql += ` ${newKeys[i]} = '${newValues[i]}'`;
      if (i !== newValues.length - 1) Model.sql += ',';
    }

    // adds the condition that the update only be made to the row that this model instance represents
    // i.e. model instance must already have been saved to the db (only includes non-null values in condition)
    Model.sql += ` WHERE`;
    for (let i = 0; i < keys.length; i++) {
      if (values[i]) {
        if (i > 0) Model.sql += ' AND';
        Model.sql += ` ${keys[i]} = '${values[i]}'`;
      }
    }
    Model.sql += ` RETURNING *`;
    // sends query to user's database by invoking 'query' method on the model
    const updatedRows = await Model.query();
    // clears the in-progress-query-string now that the query has been executed
    Model.sql = '';
    // stores the newly updated row object at the 'record' property of the instance
    if (
      updatedRows && typeof updatedRows[0] === 'object' &&
      updatedRows[0] !== null
    ) {
      this.record = updatedRows[0];
    }
    return this;
  }

  // inserts row into the db table associated with the current model
  // accepts as arguments 1 or more strings of the form 'column_name = value'
  // builds query of the form 'INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...)
  // must be chained with invocation of 'query' method in order to execute query
  static insert(...value: string[]) {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'insert', this.name);

    this.sql += `INSERT INTO ${this.table} (`;
    for (let i = 0; i < value.length; i++) {
      // split each argument into column name (before '=') and value (after '=')
      const words = value[i].toString().split(' = ');
      // every words[0] should represent a column name (separated by commas to form query string)
      const inputColumn: string = words[0];
      // check that the input column is one that is in the table
      checkColumns(this.columns, inputColumn);

      this.sql += ` ${inputColumn}`;
      if (i !== value.length - 1) this.sql += ' ,';
      else this.sql += ')';
    }
    this.sql += ' VALUES (';
    for (let i = 0; i < value.length; i++) {
      const words = value[i].toString().split(' = ');
      // every words[1] should represent a value (in same order as column names above)
      this.sql += ` '${words[1]}'`;
      if (i !== value.length - 1) this.sql += ' ,';
      else this.sql += ')';
    }
    return this;
  }

  // this method is like the 'update' method above but without the WHERE clause
  // therefore it updates the value(s) of the given column(s) for all records in the table
  static edit(...condition: string[]) {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'edit', this.name);
    this.sql += `UPDATE ${this.table} SET`;
    for (let i = 0; i < condition.length; i++) {
      const words = condition[i].toString().split(' = ');
      const inputColumn: string = words[0];
      // check that the input column is one that is in the table
      checkColumns(this.columns, inputColumn);
      // words[1] is the input value
      this.sql += ` ${inputColumn} = '${words[1]}'`;
      if (i !== condition.length - 1) this.sql += ' ,';
    }
    return this;
  }

  // executed by itself, this method deletes the entire table associated with the current model
  // can also be chained with 'where' method to delete only rows where condition is met
  // either way, must be chained with 'query' method to execute query
  static delete() {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'delete', this.name);
    this.sql += `DELETE FROM ${this.table}`;
    return this;
  }

  // accepts 1 or more column names to select from table associated with given model
  // can be chained with 'where' method, either way must be chained with 'query' method
  static select(...column: string[]) {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'select', this.name);
    // check for empty arguments and *
    if (arguments.length === 0 || arguments[0] === '*') {
      this.sql += `SELECT * FROM ${this.table}`;
      return this;
    } else {
      // check that the input column is one that is in the table
      checkColumns(this.columns, column);
      this.sql += `SELECT ${column.toString()} FROM ${this.table}`;
      return this;
    }
  }

  // this method can be chained onto other methods to add 1 or more conditions to the existing query
  // executed by itself, this method will select all columns
  // operators 'AND', 'OR', 'NOT', and 'LIKE' can be added to the beginning of any args
  // must be chained with 'query' method to finish executing
  static where(...condition: string[]) {
    if (this.sql === '') this.sql += `SELECT * FROM ${this.table}`;
    this.sql += ' WHERE';
    let words: string[];

    // converts conditions from the form "column_name = value" into "column_name = 'value'"
    for (let i = 0; i < condition.length; i++) {
      // check that the input column is one that is in the table
      if (condition[i].includes(' = ')) {
        words = condition[i].toString().split(' = ');
        checkColumns(this.columns, words[0]);
        this.sql += ` ${words[0]} = '${words[1]}'`;
      } else if (condition[i].includes(' > ')) {
        words = condition[i].toString().split(' > ');
        checkColumns(this.columns, words[0]);
        this.sql += ` ${words[0]} > '${words[1]}'`;
      } else if (condition[i].includes(' < ')) {
        words = condition[i].toString().split(' < ');
        checkColumns(this.columns, words[0]);
        this.sql += ` ${words[0]} < '${words[1]}'`;
      } else if (condition[i].includes(' >= ')) {
        words = condition[i].toString().split(' >= ');
        checkColumns(this.columns, words[0]);
        this.sql += ` ${words[0]} >= '${words[1]}'`;
      } else if (condition[i].includes(' <= ')) {
        words = condition[i].toString().split(' <= ');
        checkColumns(this.columns, words[0]);
        this.sql += ` ${words[0]} <= '${words[1]}'`;
      } else if (condition[i].includes(' LIKE ')) {
        words = condition[i].toString().split(' LIKE ');
        checkColumns(this.columns, words[0]);
        this.sql += ` ${words[0]} LIKE '${words[1]}'`;
      }
    }
    return this;
  }

  // LIMIT: limit number of output rows
  static limit(limit: number) {
    this.sql += ` LIMIT ${limit}`;
    return this;
  }

  // HAVING: add condition(s) involving aggregate functions to the current query
  static having(...condition: string[]) {
    this.sql += ` HAVING ${condition[0]}`;
    for (let i = 1; i < condition.length; i++) {
      this.sql += ` ${condition[i]}`;
    }
    return this;
  }

  // INNER JOIN: selects records with matching values on both tables
  // chained after the 'select' method
  static innerJoin(column1: string, column2: string, table2: string) {
    this.sql +=
      ` INNER JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // LEFT JOIN: selects records from this table and matching values on table2
  static leftJoin(column1: string, column2: string, table2: string) {
    this.sql +=
      ` LEFT JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // RIGHT JOIN: selects records from table2 and matching values on this table
  static rightJoin(column1: string, column2: string, table2: string) {
    this.sql +=
      ` RIGHT JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // FULL JOIN: selects all records when a match exists in either table
  static fullJoin(column1: string, column2: string, table2: string) {
    this.sql +=
      ` FULL JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // puts all rows with same value for passed in column(s) into one 'summary row'
  // often used with aggregate functions (ex: COUNT), chained after 'select' method
  static group(...column: string[]) {
    checkColumns(this.columns, column);
    this.sql += ` GROUP BY ${column.toString()}`;
    return this;
  }

  // ORDER BY: sort column(s) by ascending or descending order
  // accepts either 'ASC' or 'DESC' as first argument and 1 or more columns
  // as remaining argument(s), chained onto 'select' method
  static order(order: 'ASC' | 'DESC', ...column: string[]) {
    checkColumns(this.columns, column);
    this.sql += ` ORDER BY ${column.toString()}`;

    if (order !== 'ASC' && order !== 'DESC') {
      throw new Error(
        `Error in sort method: order argument should be 'ASC' or 'DESC'`,
      );
    }
    if (order === 'ASC' || order === 'DESC') {
      this.sql += ` ${order}`;
    }
    return this;
  }

  // AVG-COUNT-SUM-MIN-MAX: calculate aggregate functions
  static count(column: string) {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'count', this.name);
    checkColumns(this.columns, column);
    this.sql += `SELECT COUNT(${column}) FROM ${this.table}`;
    return this;
  }

  static sum(column: string) {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'sum', this.name);
    checkColumns(this.columns, column);
    this.sql += `SELECT SUM(${column}) FROM ${this.table}`;
    return this;
  }

  static avg(column: string) {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'avg', this.name);
    checkColumns(this.columns, column);
    this.sql += `SELECT AVG(${column}) FROM ${this.table}`;
    return this;
  }

  static min(column: string) {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'min', this.name);
    checkColumns(this.columns, column);
    this.sql += `SELECT MIN(${column}) FROM ${this.table}`;
    return this;
  }

  static max(column: string) {
    // If the sql string already exists, throw an error to the user
    checkUnsentQuery(this.sql.length, 'max', this.name);
    checkColumns(this.columns, column);
    this.sql += `SELECT MAX(${column}) FROM ${this.table}`;
    return this;
  }

  // execute query in database
  static async query(uri?: string): Promise<unknown[] | undefined> {
    const db = await ConnectDb(uri);
    let queryResult;

    // include try catch block to ensure that the SQL string gets cleared, db gets disconnected
    try {
      queryResult = await db.queryObject(this.sql);
    } catch (err) {
      console.log(err);
    }
    // clear the query string and return the resulting rows from the query if any
    this.sql = '';
    await DisconnectDb(db);
    return queryResult ? queryResult.rows : undefined;
  }

  // can chain this method on after the 'select' method to query the db
  // for a single row and return a new instance representing that row
  // ex: const droid = await Species.where('name = Droid').queryInstance()
  static async queryInstance(uri?: string, print?: string) {
    const db = await ConnectDb(uri);
    if (!this.sql.includes('SELECT a.attname') && print) console.log(this.sql);
    const queryResult = await db.queryObject(this.sql);
    this.sql = '';
    DisconnectDb(db);
    return Object.assign(new this(), queryResult.rows[0]);
  }

  // creates a foreign key on the current model referencing the target model passed in as an argument (if it doesn't already exist)
  // returns an instance of an association class (defined in Association.ts) either the 'BelongsTo' class or the 'HasOne' class
  // creates a getter method on the current model which retrieves the associated row from the related table, ex:
  // await Capital.belongsTo(Country);
  // const ottawa = await Capital.where('name = Ottawa').queryInstance();
  // const ottawaCountry = await ottawa.getCountry();
  static async belongsTo(
    targetModel: typeof Model,
    options?: { associationName: string },
  ) {
    let foreignKey_ColumnName: string;
    let mappingTarget_ColumnName: string;
    let associationQuery = '';
    const rel_type = options?.associationName
      ? options?.associationName
      : 'belongsTo';

    // if the current table already has a foreign key from the target table, 'getMappingKeys'
    // returns information about that relationship--otherwise returns undefined
    const mappings = await getMappingKeys(this.table, targetModel.table);

    // If a relationship already exists between the current and target tables
    if (mappings !== undefined && mappings !== null) {
      // store the column name of the foreign key and the column name it maps onto in the target table
      // (usually this is the primary key column name, such as 'id' or '_id')
      foreignKey_ColumnName = mappings.source_keyname;
      mappingTarget_ColumnName = mappings.target_keyname;
    } else {
      // If a relationship doesn't yet exist, we want to create one
      // currently, this method doesn't allow the user to customize the mapped columns
      // instead, the foreign key column name defaults to target_id (ex: 'species_id')
      // the column mapped to in target table is that table's primary key
      foreignKey_ColumnName = `${targetModel.name.toLocaleLowerCase()}_id`;
      const tempPrime = await getprimaryKey(targetModel.table);
      mappingTarget_ColumnName = tempPrime ? tempPrime : 'id' || '_id'; // << hard coded

      // create object representing new foreign key column
      const columnAtt: any = {
        type: targetModel.columns[mappingTarget_ColumnName].type,
        association: {
          rel_type: rel_type,
          table: targetModel.table,
          mappedCol: mappingTarget_ColumnName,
        },
      };

      // add this new column object to the 'columns' property on the current model
      this.columns[foreignKey_ColumnName] = columnAtt;

      // build query to establish this foreign key relationship in the database itself
      // note that this query will NOT be executed unless user explicitly executes
      // 'syncAssociation' method on association instance created below
      associationQuery = `
      ALTER TABLE ${this.table} ADD ${foreignKey_ColumnName} ${
        FIELD_TYPE[columnAtt.type]
      };
      ALTER TABLE ${this.table} ADD CONSTRAINT fk_${foreignKey_ColumnName} FOREIGN KEY (${foreignKey_ColumnName}) REFERENCES ${targetModel.table} ON DELETE SET NULL ON UPDATE CASCADE
      ;`;
    }

    const mappingDetails = {
      association_type: 'belongsTo',
      association_name: `${this.name}_belongsTo_${targetModel.name}`,
      targetModel: targetModel,
      foreignKey_ColumnName: foreignKey_ColumnName,
      mapping_ColumnName: mappingTarget_ColumnName,
    };

    // returns a new instance of an association class (defined in Association.ts)
    // in order to execute the association query in the database, user must then
    // call the 'syncAssociation' method on the returned instance, ex:
    // STEP 1) const userProfileAssociation = await Profile.belongsTo(User)
    // STEP 2) userProfileAssociation.syncAssociation()
    if (options?.associationName === 'hasOne') {
      return new HasOne(this, targetModel, mappingDetails, associationQuery);
    } else {
      return new BelongsTo(this, targetModel, mappingDetails, associationQuery);
    }
  } // end of belongsTo

  // invokes the 'belongsTo' method defined above, passing in the 'hasOne' option
  // should return a new instance of the 'HasOne' class (defined in Association.ts), ex:
  // await Country.hasOne(Capital);
  // const canada = await Country.where('name = Canada').queryInstance();
  // const canadaCapital = await canada.getCapital();
  static async hasOne(targetModel: typeof Model) {
    return await targetModel.belongsTo(this, { associationName: 'hasOne' });
  }

  // does NOT establish a new relationship between tables--returns a new instance of the HasMany class (defined in Association.ts)
  // based on information returned about an existing one-to-many relationship between current and target models
  static async hasMany(targetModel: typeof Model) {
    const mappings = await getMappingKeys(targetModel.table, this.table);
    if (!mappings) {
      throw new Error(
        'No association exists between the current and target models. Use the "belongsTo" method to establish a new relationship. Or use this method to retrieve an existing association between models.',
      );
    }
    const mapping_ColumnName = mappings.target_keyname; // name of the primary key on the current table
    const targetModel_foreignKey = mappings.source_keyname; // name of the foreign key on the target table

    const mappingDetails = {
      association_type: 'hasMany',
      association_name: `${this.name}_hasMany_${targetModel.name}`,
      targetModel: targetModel,
      foreignKey_ColumnName: targetModel_foreignKey,
      mapping_ColumnName: mapping_ColumnName,
    };

    return new HasMany(this, targetModel, mappingDetails, ''); // empty string passed in for association query
  }
}
//end of Model class

// helper function to find mapping keys between two tables
// ex: if source table is 'species' and target table is 'planets,' result would include:
// source_keyname of 'homeworld_id' (i.e. the column name in the source table) and
// target_keyname of '_id' (i.e. the column name in the target table)
// https://reside-ic.github.io/blog/querying-for-foreign-key-constraints/
export async function getMappingKeys<T>(
  sourcTable: string,
  targetTable: string,
  uri?: string,
): Promise<{ [key: string]: string } | undefined | null> {
  const queryText = `SELECT 
  c.conrelid::regclass AS source_table, 
  source_attr.attname AS source_keyname,
  c.confrelid::regclass AS target_table, 
  target_attr.attname AS target_keyname
  FROM pg_constraint c 
  JOIN pg_attribute source_attr ON source_attr.attrelid = c.conrelid 
  AND source_attr.attnum = ANY (c.conkey)
  JOIN pg_attribute target_attr ON target_attr.attrelid = c.confrelid 
  AND target_attr.attnum = ANY (c.confkey)
  WHERE 
  c.conrelid = $1::regclass AND 
  c.contype = 'f' AND c.confrelid = $2::regclass
  ;
  `;
  let result;
  const db = await ConnectDb(uri);
  try {
    result = await db.queryObject(queryText, [sourcTable, targetTable]);
  } catch (error) {
    console.error(error);
  } finally {
    DisconnectDb(db);
  }

  if (typeof result === 'object' && 'rows' in result) {
    return result.rows[0] as { [key: string]: string };
  }
} // end of getMappingKeys

// helper function to find primary key of target table (often '_id' or 'id')
export async function getprimaryKey<T>(
  tableName: string,
  uri?: string,
): Promise<string | undefined | null> {
  const queryText = `SELECT a.attname 
  FROM pg_index i
  JOIN pg_attribute a ON a.attrelid = i.indrelid
  AND a.attnum = ANY(i.indkey)
  WHERE i.indrelid = $1::regclass
  AND i.indisprimary`;
  let result;
  const db = await ConnectDb(uri);
  try {
    result = await db.queryObject(queryText, [tableName]);
  } catch (error) {
    console.error(error);
  } finally {
    DisconnectDb(db);
  }
  if (
    typeof result === 'object' &&
    'rows' in result &&
    result.rows[0] !== null &&
    typeof result.rows[0] === 'object' &&
    recordPk(result.rows[0])
  ) {
    return result.rows[0].attname;
  }
}

// returns new instance of the 'ManyToMany' association class (defined in Assocation.ts)
export async function manyToMany(
  modelA: typeof Model,
  modelB: typeof Model,
  options: { through: typeof Model },
) {
  const throughModel = options.through; // ex: 'people_in_films'
  const mapKeysA = await getMappingKeys(throughModel.table, modelA.table); // keys linking the join table and modelA
  const mapKeysB = await getMappingKeys(throughModel.table, modelB.table); // keys linking the join table and modelB

  if (mapKeysA && mapKeysB) {
    const mappingDetails = {
      association_type: 'ManyToMany',
      association_name: `${modelA.name}_hasMany_${modelB.name}`,
      modelA,
      modelB,
      throughModel,
      modelA_foreignKey_inThroughModel: mapKeysA.source_keyname, // ex: 'person_id'
      modelB_foreignKey_inThroughModel: mapKeysB.source_keyname, // ex: 'film_id'
      modelA_mappingKey: mapKeysA.target_keyname, // ex: '_id' (primary key name on the people table)
      modelB_mappingKey: mapKeysB.target_keyname, // ex: '_id' (primary key name on the films table)
    };

    // return new instance of ManyToMany (with empty associationQuer string since not currently able to create new association)
    return new ManyToMany(modelA, modelB, mappingDetails, '');
  } else {
    throw new Error('This association does not exist');
  }
}
