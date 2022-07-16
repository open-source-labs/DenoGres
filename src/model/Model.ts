import { ConnectDb, DisconnectDb } from '../../mod.ts';

export class Model {
  table!: string;
  query = '';

  // Create records
  // Delete records
  // UPDATE records

  // table1.select(column1).where(column=x)
  // SELECT

  // let query = '';
  // table.filter(column, condition)
  filter(columnName: string, condition?: any, limit?: number) {
    this.query += `SELECT ${columnName} FROM ${this.table}`;
    if (condition) this.query += ` WHERE ${columnName} = ${condition}`;
    if (limit) this.query += ` LIMIT ${limit}`;
    return this.query;
  }

  // LIMIT (control number of records returned)
  // limit(limit: number) {
  //   query += `LIMIT ${limit}`
  // }

  // RELATIONSHIPS BETWEEN TABLES DEFINED

  // types: inner, left, right, outer
  // table1.filter(column, condition).join('inner', column1, column2, table2)
  join(
    type: string,
    column1: string,
    column2: string,
    table2: string,
    condition?: any
  ) {
    if (!this.query.includes('SELECT'))
      this.query += `SELECT ${column1} FROM ${this.table}`;
    switch (type) {
      case 'inner':
        this.query += ` INNER JOIN ${table2}`;
        break;
      case 'left':
        this.query += ` LEFT JOIN ${table2}`;
        break;
      case 'right':
        this.query += ` RIGHT JOIN ${table2}`;
        break;
      case 'outer':
        this.query += ` FULL OUTER JOIN ${table2}`;
        break;
      default:
        return 'Error';
    }
    this.query += `ON ${this.table}.${column1} = ${table2}.${column2};`;
    if (condition) this.query += ` WHERE ${condition}`;
    return this.query;
  }

  // LEFT JOIN
  // leftJoin(column1: string, column2: string, table2: string) {
  //   `SELECT ${column1}
  //   FROM ${this.table}
  //   LEFT JOIN ${table2}
  //   ON ${this.table}.${column1} = ${table2}.${column2};`
  // }
  // RIGHT JOIN
  // rightJoin(column1: string, column2: string, table2: string) {
  //   `SELECT ${column1}
  //   FROM ${this.table}
  //   RIGHT JOIN ${table2}
  //   ON ${this.table}.${column1} = ${table2}.${column2};`
  // }
  // OUTER JOIN
  // outerJoin(column1: string, column2: string, table2: string, condition: any) {
  //   `SELECT ${column1}
  //   FROM ${this.table}
  //   FULL OUTER JOIN ${table2}
  //   ON ${this.table}.${column1} = ${table2}.${column2}
  //   WHERE ${condition};`
  // }
  // group by
  //table.filter(column, condition).sort('group', column, condition, order)
  sort(type: string, columnName: string, condition?: any, order?: string) {
    if (type !== 'group' && type !== 'order') return 'Error';
    if (!this.query.includes('SELECT'))
      this.query += `SELECT ${columnName} FROM ${this.table}`;
    if (type === 'group') {
      this.query += ` WHERE ${condition} GROUP BY ${columnName}`;
    }
    if (order) {
      this.query += ` ORDER BY ${columnName} ${order}`; // order: ASC/DESC
    }
    return this.query;
  }

  // groupBy(columnName: string, condition: any){
  //   `SELECT ${columnName}
  //   FROM ${this.table}
  //   WHERE ${condition}
  //   GROUP BY ${columnName}
  //   ORDER BY ${columnName};`
  // }
  // ORDER BY
  // orderBy(columnName: [string], order: string) {
  //   `SELECT ${columnName}
  //   FROM ${this.table}
  //   ORDER BY ${columnName} ${order};`
  // }
  // Average
  average(columnName: string, condition: any) {
    `SELECT AVG(${columnName})
    FROM ${this.table}
    WHERE ${condition};`;
  }
  // Count
  count(columnName: string, condition: any) {
    `SELECT COUNT (${columnName})
    FROM ${this.table}
    WHERE ${condition};`;
  }
  // SUM
  sum(columnName: string, condition: any) {
    `SELECT SUM(${columnName})
    FROM ${this.table}
    WHERE ${condition};`;
  }
  // Min
  min(columnName: string, condition: any) {
    `SELECT MIN (${columnName})
    FROM ${this.table}
    WHERE ${condition};`;
  }
  // MAX
  max(columnName: string, condition: any) {
    `SELECT MAX(${columnName})
    FROM ${this.table}
    WHERE ${condition};`;
  }
}

class Person extends Model {
  static fields = {
    name: String,
    mass: String,
    hair_color: String,
    skin_color: String,
    eye_color: String,
    birth_year: String,
    gender: String,
    species: String
  }
}
const test = new Person();
test.table = 'people';
test.filter('name');

test.query;
// test.filter(people, test.table);
async function dbqueries() {
  const db = await ConnectDb();
  // const queryResult = await db.queryObject('SELECT * from people limit 5')
  const queryResult = await db.queryObject(test.query); //db.queryObject(Model)
  console.log(queryResult);
}

// test.query = Person.filter('name');
dbqueries();
