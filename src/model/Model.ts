import { ConnectDb, DisconnectDb } from '../../mod.ts';
import { BelongsTo, FIELD_TYPE } from '../../Model_Creation/association'

export class Model {
  static table: string;
  static columns: {
    [key: string]: {
        type: string,
        primaryKey?: boolean,
        notNull?: boolean,
        unique?: boolean,
        checks?: string[],
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
  static update(...values: string[]) {
    this.sql += `UPDATE ${this.table} SET`;
    for (let i = 0; i < values.length; i++) {
      const words = values[i].toString().split(' = ');
      this.sql += ` ${words[0]} = '${words[1]}'`;
      if (i !== values.length - 1) this.sql += ' ,';
    }
    return this;
  }

  // DELETE FROM: delete table
  // input: delete()
  static delete() {
    this.sql += `DELETE FROM ${this.table}`;
    return this;
  }

  // SELECT FROM: select column(s) from this table
  // input: (column)
  static filter(...column: string[]) {
    this.sql += `SELECT ${column.toString()} FROM ${this.table}`;
    return this;
  }

  // WHERE: add condition(s) to query
  // input: (column = value, AND/OR column = value, ...)
  static where(...condition: string[]) {
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

  // INNER-LEFT-RIGHT-FULL OUTER JOIN: join two tables together
  // input: (joinType, column1, column2, table2)
  static join(type: string, column1: string, column2: string, table2: string) {
    if (
      type !== 'inner' &&
      type !== 'left' &&
      type !== 'right' &&
      type !== 'full'
    )
      console.log(
        `Error in join method: type argument should be 'inner', 'left', 'right', or 'full'`
      );
    if (type === 'inner') this.sql += ` INNER JOIN ${table2}`;
    if (type === 'left') this.sql += ` LEFT JOIN ${table2}`;
    if (type === 'right') this.sql += ` RIGHT JOIN ${table2}`;
    if (type === 'full') this.sql += ` FULL JOIN ${table2}`;
    this.sql += ` ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // GROUP BY-ORDER BY: sort column(s)
  // input: (sortingMethod, ASC/DESC, column(s))
  // static sort(method: string, order: string, ...column: string[]) {
  //   if (method !== 'group' && method !== 'order')
  //     console.log(
  //       `Error in sort method: method argument should be 'group' or 'order'`
  //     );
  //   if (method === 'group') {
  //     this.sql += ` GROUP BY ${column}`;
  //   }
  //   if (method === 'order') {
  //     this.sql += ` ORDER BY ${column.toString()}`;
  //   }
  //   if (order !== 'ASC' && order !== 'DESC')
  //     console.log(
  //       `Error in sort method: order argument should be 'ASC' or 'DESC'`
  //     );
  //   if (order === 'ASC' || order === 'DESC') {
  //     this.sql += ` ${order}`;
  //   }
  //   return this;
  // }

  // GROUP BY: group rows with same values
  static group(...column: string[]) {
    this.sql += ` GROUP BY ${column.toString()}`;
    return this;
  }

  // ORDER BY: 
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
  static calculate(type: string, column: string) {
    if (
      type !== 'count' &&
      type !== 'sum' &&
      type !== 'min' &&
      type !== 'max' &&
      type !== 'average'
    )
      console.log(
        `Error in calculate method: type argument should be 'count', 'sum', 'min', 'max', or 'average'`
      );
    if (type === 'count') this.sql += `SELECT COUNT(${column})`;
    if (type === 'sum') this.sql += `SELECT SUM(${column})`;
    if (type === 'min') this.sql += `SELECT MIN(${column})`;
    if (type === 'max') this.sql += `SELECT MAX(${column})`;
    if (type === 'average') this.sql += `SELECT AVG(${column})`;
    this.sql += ` FROM ${this.table}`;
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

/* BELONGS TO... WIP
  // create foreign key on this model
  static belongsTo(targetModel:Model, options?:unknown) {
    const foreignKey_ColumnName = `${targetModel.name.toLocaleLowerCase()}_id`
    const columnAtt = { 
      type: targetModel.columns.id.type,
      association: { rel_type:'belongsTo', model: targetModel }
     }
    this.columns[foreignKey_ColumnName] = columnAtt 

    let query = `ALTER TABLE ${this.table} ADD ${foreignKey_ColumnName} ${FIELD_TYPE[columnAtt.type]};
    ALTER TABLE ${this.table} ADD CONSTRAINT fk_${foreignKey_ColumnName} FOREIGN KEY (${foreignKey_ColumnName}) REFERENCES ${targetModel.table}
    ;`
    //createForeignKeyQuery(this.table_name, foreignKey_ColumnName, this.columns[foreignKey_ColumnName])
    //console.log('belongsTo createForeignKeyQuery: \n', query) 
    // e.g. createForeignKeyQuery('users', 'profiles_id', users.profile_id)
    return new BelongsTo(this, targetModel, query)
  }
*/

} //end of Model class

interface Test {
  id: number;
  email: string;
}

class Test extends Model {
  static table = 'people';
  static columns = {
    id: {
      type: 'number',
    },
  };
}

const testInstance = new Test();
testInstance.id = 1;
testInstance.email = 'abcde@gmail.com';

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
Test.filter('name').group('people.name').having('SUM(height) > 100').query();
//SELECT height FROM people GROUP BY people.height HAVING COUNT(_id) > 7 // 
// Test.filter('height').query();
// Test.add('name = Tesia', 'hair_color = purple', 'gender = female').query();
// Test.filter('name', 'hair_color', 'height')
//   .where('hair_color = purple')
//   .query();
// Test.update('gender = male').query();
// Test.delete().where('hair_color = purple').query();
// Test.calculate('count', 'name').having('COUNT(name) > 5').query()
// Test.calculate('average', 'height').query()

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
