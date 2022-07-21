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
    }
  };
  static checks: string[];
  static unique: string[];
  static primaryKey: string[];
  static sql = '';

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

  save() {
    Model.sql += `INSERT INTO ${Object.getPrototypeOf(this).constructor.table} (${Object.keys(this).toString()}) VALUES (`;
    const values = Object.values(this);
    for (let i = 0; i < values.length; i++) {
      Model.sql += ` '${values[i]}'`
      if (i !== values.length - 1) Model.sql += ' ,';
      else Model.sql += ')';
    }
    return Model.query();
  }

  // INSERT INTO VALUES: add value(s) to column(s) in this table
  // input: (column = value, ...)
  static add(...value: string[]) {
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
  update() {
    console.log(Object.getPrototypeOf(this).constructor.table);
    Model.sql += `UPDATE ${Object.getPrototypeOf(this).constructor.table} SET`;
    const keys = Object.keys(this);
    const values = Object.values(this);
    for (let i = 0; i < values.length; i++) {
      Model.sql += ` ${keys[i]} = '${values[i]}'`
      if (i !== values.length - 1) Model.sql += ' ,';
    }
    // for (let i = 0; i < values.length; i++) {
    //   const words = values[i].toString().split(' = ');
    //   Model.sql += ` ${words[0]} = '${words[1]}'`;
    //   if (i !== values.length - 1) Model.sql += ' ,';
    // }
    return Model.query();
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
  // input: (column = value, AND/OR column = value, ...)
  static where(...condition: string[]) {
    if (this.sql = '') this.sql += `SELECT * FROM ${this.table}`;
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
  // input: (aggregateFunction, column)
  
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
  static async query() {
    const db = await ConnectDb();
    console.log(this.sql);
    // const sqlResult = await db.sqlObject(`SELECT species.name FROM people INNER JOIN species ON people.species_id = species._id WHERE people.name = 'Luke Skywalker'`)
    const queryResult = await db.queryObject(this.sql); //db.sqlObject(Model)
    console.log(queryResult.rows);
    return this;
  }

  //BELONGS TO
  // create foreign key on this model
  static belongsTo(targetModel:typeof Model, options?:unknown) {
    const foreignKey_ColumnName = `${targetModel.name.toLocaleLowerCase()}_id`
    const columnAtt = { 
      type: targetModel.columns.id.type,
      association: { rel_type:'belongsTo', model: targetModel }
     }
    this.columns[foreignKey_ColumnName] = columnAtt 

    let query = `ALTER TABLE ${this.table} ADD ${foreignKey_ColumnName} ${FIELD_TYPE[columnAtt.type]};
    ALTER TABLE ${this.table} ADD CONSTRAINT fk_${foreignKey_ColumnName} FOREIGN KEY (${foreignKey_ColumnName}) REFERENCES ${targetModel.table} ON DELETE SET NULL ON UPDATE CASCADE
    ;`
    return new BelongsTo(this, targetModel, query) // add foreignKey_ColumnName 
  }


  test() {
    console.log(Object.keys(this))
    console.log(Object.getPrototypeOf(this).constructor.table)
  }

} //end of Model class

interface Test {
  id: number;
  name: string;
  hair_color: string
}

class Test extends Model {
  static table = 'people';
  static columns = {
    id: {
      type: 'number',
    },
    name: {
      type: 'string'
    }
  };
}

// const testInstance = new Test();
// testInstance.name = 'kristen';
// testInstance.hair_color = 'black' ;
// testInstance.save();
// testInstance.hair_color = 'brown'
// testInstance.update();
// Test.select('*').where('name = kristen').query();

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
