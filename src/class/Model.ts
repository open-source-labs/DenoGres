import { ConnectDb, DisconnectDb } from '../functions/Db.ts';
import { BelongsTo } from './Association.ts'
import { FIELD_TYPE } from '../constants/sqlDataTypes.ts'

export class Model {
  static table: string;
  static columns: {
    [key: string]: {
        type: string,
        primaryKey?: boolean,
        notNull?: boolean,
        unique?: boolean,
        checks?: string[],
        defaultVal?: string,
        autoIncrement?: boolean,
        association?: { rel_type?: string, table: string, mappedCol: string}
    }
  };
  static checks: string[];
  static unique: string[];
  static primaryKey: string[];
  private static sql = '';
  static foreignKey: { columns: string[], mappedColumns: string[], rel_type?: string, table: string }[];
  // CREATE TABLE: create table schema in database
  // input: (table, column datatype)
  // static create(table: string, ...column: string[]) {
  //   this.sql += `CREATE TABLE ${table} (`;
  //   for (let i = 0; i < column.length; i++) {
  //     const words = column[i].toString().split(' ');
  //     this.sql += ` ${words[0]} ${words[1]}`;
  //     if (i !== column.length - 1) this.sql += ', ';
  //   }
  //   return this;
  // }
  // static id: string;
  // static finalID: string;

  private async primaryKey() {
    Model.sql =
      `SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid
      AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = '${Object.getPrototypeOf(this).constructor.table}'::regclass
      AND i.indisprimary`;
    const pk = await Model.query();
    return pk[0].attname;
  }

  async save() {
    const table = Object.getPrototypeOf(this).constructor.table
    const keys = Object.keys(this)
    const values = Object.values(this);

    Model.sql += `INSERT INTO ${table} (${keys.toString()}) VALUES (`;
    for (let i = 0; i < values.length; i++) {
      Model.sql += ` '${values[i]}'`;
      if (i !== values.length - 1) Model.sql += ' ,';
      else Model.sql += ')';
    }
    await Model.query();

    const pk = await this.primaryKey();

    Model.sql += `SELECT ${pk} FROM ${table} WHERE`
    for (let i = 0; i < values.length; i++) {
      Model.sql += ` ${keys[i]} = '${values[i]}'`;
      if (i !== values.length - 1) Model.sql += ' AND';
    }
    const pkObj = await Model.query();
    this[pk] = pkObj[0][pk]

    // Model.sql += `INSERT INTO ${Object.getPrototypeOf(this).constructor.table} (${Object.keys(this).toString()}) VALUES (`;
    // const values = Object.values(this);
    // for (let i = 0; i < values.length; i++) {
    //   Model.sql += ` '${values[i]}'`
    //   if (i !== values.length - 1) Model.sql += ' ,';
    //   else Model.sql += ')';
    // }
    // Model.query();
    // Model.sql = '';
    // Model.id = `SELECT id FROM ${Object.getPrototypeOf(this).constructor.table} WHERE ${Object.keys(this)[0]} = ${Object.values(this)[0]}`
    // Model.query();

    return this;
  }

  async update() {
    const pk = await this.primaryKey();

    // console.log(pk[0])
    Model.sql = '';
    Model.sql += `UPDATE ${Object.getPrototypeOf(this).constructor.table} SET`;
    const keys = Object.keys(this);
    // console.log(keys)
    const values = Object.values(this).filter(value => value !== this[pk]);
    // console.log(values)
    for (let i = 0; i < values.length; i++) {
      Model.sql += ` ${keys[i]} = '${values[i]}'`;
      if (i !== values.length - 1) Model.sql += ' ,';
    }
    // console.log(this)
    // console.log(this[pk])
    Model.sql += ` WHERE ${pk} = ${this[pk]}`
    return await Model.query();

    // console.log(Model.id);
    // Model.sql += `UPDATE ${Object.getPrototypeOf(this).constructor.table} SET`;
    // //this {name: 'kristen', hair_color: 'black'}
    // // 
    // const keys = Object.keys(this);
    // const values = Object.values(this);
    // for (let i = 0; i < values.length; i++) {
    //   Model.sql += ` ${keys[i]} = '${values[i]}'`
    //   if (i !== values.length - 1) Model.sql += ' ,';
    }

    // const primaryKey = `SELECT a.attname
    // FROM   pg_index i
    // JOIN   pg_attribute a ON a.attrelid = i.indrelid
    //                      AND a.attnum = ANY(i.indkey)
    // WHERE  i.indrelid = '${Object.getPrototypeOf(this).constructor.table}'::regclass
    // AND    i.indisprimary`;

    // return Model;
  

  // INSERT INTO VALUES: add value(s) to column(s) in this table
  // input: (column = value, ...)
  static insert(...value: string[]) {
    //['name = Tesia', 'hair_color = purple', 'gender = female']
    this.sql += `INSERT INTO ${this.table} (`;
    for (let i = 0; i < value.length; i++) {
      const words = value[i].toString().split(' = ');
      this.sql += ` ${words[0]}`;
      if (i !== value.length - 1) this.sql += ' ,';
      else this.sql += ')';
    }
    this.sql += ' VALUES (';
    for (let i = 0; i < value.length; i++) {
      const words = value[i].toString().split(' = ');
      console.log(words);
      this.sql += ` '${words[1]}'`;
      if (i !== value.length - 1) this.sql += ' ,';
      else this.sql += ')';
    }
    return this;
  }

  // UPDATE SET: update existing records
  // input: (column = value, ...)
  static edit(...condition: string[]) {
    this.sql += `UPDATE ${this.table} SET`;
    for (let i = 0; i < condition.length; i++) {
      const words = condition[i].toString().split(' = ');
      this.sql += ` ${words[0]} = '${words[1]}'`;
      if (i !== condition.length - 1) this.sql += ' ,';
    }
    return this;
  }

  // DELETE FROM: delete table
  // input: delete()
  static delete() {
    console.log(this.table)
    this.sql += `DELETE FROM ${this.table}`;
    return this;
  }

  // SELECT FROM: select column(s) from this table
  // input: (column)
  static select(...column: string[]) {
    this.sql += `SELECT ${column.toString()} FROM ${this.table}`;
    return this;
  }

  // WHERE: add condition(s) to query
  // input: (NOT column x value, AND/OR NOT column x value, ...)
  // input: (column LIKE value, OR column NOT LIKE value)
  static where(...condition: string[]) {
    //this.sql = '';
    if (this.sql === '') this.sql += `SELECT * FROM ${this.table}`;
    //this.sql += `SELECT * FROM ${this.table} WHERE`;
    this.sql += ' WHERE';
    let words: string[];
    for (let i = 0; i < condition.length; i++) {
      if (condition[i].includes(' = ')) {
        words = condition[i].toString().split(' = ');
        this.sql += ` ${words[0]} = '${words[1]}'`;
      } else if (condition[i].includes(' > ')) {
        words = condition[i].toString().split(' > ');
        this.sql += ` ${words[0]} > '${words[1]}'`;
      } else if (condition[i].includes(' < ')) {
        words = condition[i].toString().split(' < ');
        this.sql += ` ${words[0]} < '${words[1]}'`;
      } else if (condition[i].includes(' >= ')) {
        words = condition[i].toString().split(' >= ');
        this.sql += ` ${words[0]} >= '${words[1]}'`;
      } else if (condition[i].includes(' <= ')) {
        words = condition[i].toString().split(' <= ');
        this.sql += ` ${words[0]} <= '${words[1]}'`;
      } else if (condition[i].includes(' LIKE ')) {
        words = condition[i].toString().split(' LIKE ');
        this.sql += ` ${words[0]} LIKE '${words[1]}'`;
      }
    }
    return this;
  }

  // LIMIT: limit number of output rows
  // input: (limitNumber)
  static limit(limit: number) {
    this.sql += ` LIMIT ${limit}`;
    return this;
  }

  //having('COUNT(column) > 5')
  //table.having('count', column > 5)
  //AVG(columnName) BETWEEN 50 AND 100
  //table.having(type: string, columnName: string, sign: string)
  // sign = '> 5'
  //table.having('count', '_id', ' > 50')
  // this.sql += " HAVING ${type} (${columnName}) ${sign} "
  // having('count(column > 5','sum(column = 2')
  // having('COUNT(column) > 5', 'OR SUM(column) = 2')
  // HAVING COUNT (columnName) > 6
  static having(...condition: string[]) {
    // if (type === 'count') {
    //   for (let i = 0; i < condition.length; i++) {
    //     const words = condition[i].toString().split(' = ');
    //   }
    // }
    this.sql += ` HAVING ${condition[0]}`;
    for (let i = 1; i < condition.length; i ++) {
      this.sql += ` ${condition[i]}`
    }
    console.log(this.query)
    return this;
  }

  // INNER JOIN: selects records with matching values on both tables
  // input: (column1, column2, table2)
  static innerJoin(column1: string, column2: string, table2: string) {
    this.sql += ` INNER JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // LEFT JOIN: selects records from this table and matching values on table2
  // input: (column1, column2, table2)
  static leftJoin(column1: string, column2: string, table2: string){
    this.sql += ` LEFT JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }
  
  // RIGHT JOIN: selects records from table2 and matching values on this table
  // input: (column1, column2, table2)
  static rightJoin(column1: string, column2: string, table2: string) {
    this.sql += ` RIGHT JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // FULL JOIN: selects all records when a match exists in either table
  // input: (column1, column2, table2)
  static fullJoin(column1: string, column2: string, table2: string){
    this.sql += ` FULL JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // GROUP BY: group rows with same values
  static group(...column: string[]) {
    this.sql += ` GROUP BY ${column.toString()}`;
    return this;
  }

  // ORDER BY: sort column(s) by ascending or descending order
  static order(order: string, ...column: string[]) {
      this.sql += ` ORDER BY ${column.toString()}`;
      
    if (order !== 'ASC' && order !== 'DESC')
      console.log(
        `Error in sort method: order argument should be 'ASC' or 'DESC'`
      );
    if (order === 'ASC' || order === 'DESC') {
      this.sql += ` ${order}`;
    }
    return this;
  }

  // AVG-COUNT-SUM-MIN-MAX: calculate aggregate functions
  // input: (column)
  
  static count(column: string) {
   this.sql += `SELECT COUNT(${column}) FROM ${this.table}`;
   return this;
  }

  static sum(column: string){
    this.sql += `SELECT SUM(${column}) FROM ${this.table}`;
    return this;
  }
  
  static avg(column: string) {
    this.sql += `SELECT AVG(${column}) FROM ${this.table}`
    return this;
  }

  static min(column: string){
    this.sql += `SELECT MIN(${column}) FROM ${this.table}`;
    return this;
  }

  static max(column: string) {
    this.sql += `SELECT MAX(${column}) FROM ${this.table}`;
    return this;
  }
  
  // execute query in database
  static async query(print?: string) {
    const db = await ConnectDb();
    // const pk = await this.primaryKey();
    if (!this.sql.includes('SELECT a.attname') && print) console.log(this.sql);
    // const sqlResult = await db.sqlObject(`SELECT species.name FROM people INNER JOIN species ON people.species_id = species._id WHERE people.name = 'Luke Skywalker'`)
    const queryResult = await db.queryObject(this.sql); //db.sqlObject(Model)
    // if (!this.sql.includes('SELECT a.attname') && !this.sql.includes('UPDATE') && !this.sql.includes('INSERT')) console.log(queryResult.rows);
    this.sql = '';
    return queryResult.rows;
  }

  //BELONGS TO
  // create foreign key on this model (if not exist)
  static async belongsTo(targetModel:typeof Model, options?:any) {
    // this table name : this.table
    // target table name : targetModel.table
    let foreignKey_ColumnName:string
    let associationQuery = ''

    // foreign key of the this table for target table (string or null)
    const existingForeignKey = await getForeignKey(this.table, targetModel.table)
    console.log('EXISTING FOREIGN KEY: ', existingForeignKey)

    // primary key of target table
    const targetTablePrimaryKey = await getprimaryKey(targetModel.table)
    console.log('TARGET MODEL PRIME KEY: ', targetTablePrimaryKey)
    // (stretch?) user can have options to choose mapping key other than primary key

    // IF foreign key (constraints already exist in this table)
    if(!existingForeignKey) {
      foreignKey_ColumnName = existingForeignKey
      const columnAtt = { 
        //type: targetModel.columns[targetTablePrimaryKey].type,
        association: { rel_type: 'belongsTo', model: targetModel, mappedCol: targetTablePrimaryKey } 
       }
      Object.assign(this.columns[foreignKey_ColumnName], columnAtt)
      //this.columns[foreignKey_ColumnName] = columnAtt 
      
    } else {
      // creating new foreign key
      //foreignKey_ColumnName = options ? options?.foreignKey_ColumnName : `${targetModel.name.toLocaleLowerCase()}_id`
      // option... later...
      foreignKey_ColumnName = `${targetModel.name.toLocaleLowerCase()}_id`
      const columnAtt = { 
        type: targetModel.columns[targetTablePrimaryKey].type,
        association: { rel_type: 'belongsTo', model: targetModel, mappedCol: targetTablePrimaryKey } 
       }
      this.columns[foreignKey_ColumnName] = columnAtt 

      // only if there's NO existing association or existing foreign key
      associationQuery = `
      ALTER TABLE ${this.table} ADD ${foreignKey_ColumnName} ${FIELD_TYPE[columnAtt.type]};
      ALTER TABLE ${this.table} ADD CONSTRAINT fk_${foreignKey_ColumnName} FOREIGN KEY (${foreignKey_ColumnName}) REFERENCES ${targetModel.table} ON DELETE SET NULL ON UPDATE CASCADE
      ;` // and this will NOT executed unless use explictly execute sync() on association instance created below
      //console.log('associationQuery:', associationQuery)
    }

    // Add table constraints to static property 'foreignKay'
    this.foreignKey.push({
      columns:[foreignKey_ColumnName],
      mappedColumns: [targetTablePrimaryKey],
      rel_type: 'belongsTo',
      model: targetModel
    })

    const mappingDetails = {
      association_type: 'belongsTo',
      association_name: `${this.name}_belongsTo_${targetModel.name}`,
      targetModel: targetModel,
      foreignKey_ColumnName : foreignKey_ColumnName,
      mappingTarget_ColumnName : targetTablePrimaryKey,
    }
    // maybe making associations object in Model class? 
    // e.g.
    // { Person_belongsTo_Species:mappingDetails }

    //console.log('mappingDetails:', mappingDetails)
        
    return new BelongsTo(this, targetModel, mappingDetails, associationQuery) 
  }

  test() {
    console.log(Object.keys(this))
    console.log(Object.getPrototypeOf(this).constructor.table)
  }

} //end of Model class

interface Test {
  _id: number;
  name: string;
  hair_color: string
}

class Test extends Model {
  static table = 'people';
  static columns = {
    _id: {
      type: 'number',
    },
    name: {
      type: 'string'
    }
  };
}

// const testInstance = new Test();
// testInstance.name = 'tesia';
// testInstance.hair_color = 'black' ;
// await testInstance.save();
// // Test {name = 'kristen', hair_color = 'black'}
// // testInstance.hair_color = 'brown'
// testInstance.name = 'kristen';
// // Test {name = 'tesia', hair_color: 'brown'}
// await testInstance.update();

// Test.select('*').where('_id = 143').query();

// testInstance = {
//   id: 1
//   name: 'kristen'
//   save: () =>{
 //  `INSERT ${this.Object.keys} 
//}
// }

//test.table = 'people';
// test.filter('name').limit(5); // sql.limit
// test.filter('name').where('gender','male');
// Test
//   .filter('species.name')
//   .join('outer', 'species_id', '_id', 'species')
//   .where('people.name = Luke Skywalker');
// Test
//   .filter('name', 'gender', 'hair_color')
//   .where('gender = male', 'hair_color = black');
// Test.filter('name', 'gender', 'height').group('people.name', 'people.gender', 'people.height').having('AVG(height) > 100').query();
// Test.filter('name').group('people.name').having('SUM(height) > 100').query();
// running other file prints out this query...?

//SELECT height FROM people GROUP BY people.height HAVING COUNT(_id) > 7 // 
// Test.filter('height').query();
// Test.add('name = Tesia', 'hair_color = purple', 'gender = female').query();
// Test.filter('name', 'hair_color', 'height')
//   .where('hair_color = purple')
//   .query();
// Test.update('gender = male').query();
// Test.delete().where('hair_color = purple').query();
// Test.calculate('count', 'name');
// Test.calculate('average', 'height').query()
// Test.sql = `SELECT UPPER(name) FROM people;`
// Test.query()
// Test.calculate('max', 'height');

// class Person extends Model {
//   static fields = {
//     name: String,
//     mass: String,
//     hair_color: String,
//     skin_color: String,
//     eye_color: String,
//     birth_year: String,
//     gender: String,
//     species: String
//   }
// }


//helper function to find existing foreign key related to target table
async function getForeignKey<T>(thisTable:string, targetTable:string){
  const queryText = `SELECT a.attname
  FROM pg_constraint c 
  JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
  WHERE attrelid = $1::regclass AND c.contype = 'f' AND c.confrelid=$2::regclass`
  let result:any
  const db = await ConnectDb();
    try {      
      result = await db.queryObject(queryText, [thisTable, targetTable])  
      //console.log("RESULT: ",result.rows[0].attname)
    } catch (error) {
      console.error(error)
    } finally {
      DisconnectDb(db)
    }
    return result.rows[0].attname
}

//helper function to find primary key of target table
async function getprimaryKey<T>(tableName:string){
  const queryText = `SELECT a.attname 
  FROM pg_index i
  JOIN pg_attribute a ON a.attrelid = i.indrelid
  AND a.attnum = ANY(i.indkey)
  WHERE i.indrelid = $1::regclass
  AND i.indisprimary`;
  let result:any
  const db = await ConnectDb();
    try {      
      result = await db.queryObject(queryText, [tableName])  
      //console.log("RESULT: ",result.rows[0].attname)
    } catch (error) {
      console.error(error)
    } finally {
      DisconnectDb(db)
    }
    return result.rows[0].attname
}
