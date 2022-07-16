import pool from '../../db/db.ts'

export class Model {
  table!: string;

  // Create records
  // Delete records
  // UPDATE records

// table1.select(column1).where(column=x)
  // SELECT

  // let query = '';
  // table.filter(column, condition)
  filter(columnName: string, condition?: any, limit?: number) {
    let query = `SELECT ${columnName} FROM ${this.table};`
    if (condition) query += ` WHERE ${columnName} = ${condition}`
    if (limit) query += ` LIMIT ${limit}`
    return query;
  }

  // LIMIT (control number of records returned)
  // limit(limit: number) {
  //   query += `LIMIT ${limit}`
  // }

  // RELATIONSHIPS BETWEEN TABLES DEFINED

  // types: inner, left, right, outer
  // table1.join('inner', column1, column2, table2)
  join(type: string, column1: string, column2: string, table2: string, condition?: any){
    let query = `SELECT ${column1} FROM ${this.table}`
    switch(type) {
      case 'inner':
        query += ` INNER JOIN ${table2}`;
        break;
      case 'left':
        query += ` LEFT JOIN ${table2}`;
        break;
      case 'right':
        query += ` RIGHT JOIN ${table2}`;
        break;
      case 'outer':
        query += ` FULL OUTER JOIN ${table2}`;
        break;
      default: return 'Error';
    }
    query += `ON ${this.table}.${column1} = ${table2}.${column2};`
    if (condition) query += ` WHERE ${condition}` 
    return query;
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
  sort(type: string, columnName: string, condition?: any, order?: string){
    if (type !== 'group' && type !== 'order') return 'Error';
    let query = `SELECT ${columnName} FROM ${this.table}`    
    if(type === 'group'){
      query += ` WHERE ${condition} GROUP BY ${columnName};`
    }
    if(order){
      query += ` ORDER BY ${columnName} ${order};` // order: ASC/DESC
    }
    return query;
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
  average(columnName: string, condition: any){
    `SELECT AVG(${columnName})
    FROM ${this.table}
    WHERE ${condition};`
  }
  // Count
  count(columnName: string, condition: any){
    `SELECT COUNT (${columnName})
    FROM ${this.table}
    WHERE ${condition};`
  }
  // SUM
  sum(columnName: string, condition: any) {
    `SELECT SUM(${columnName})
    FROM ${this.table}
    WHERE ${condition};`
  }
  // Min
  min (columnName: string, condition: any) {
    `SELECT MIN (${columnName})
    FROM ${this.table}
    WHERE ${condition};`
  }
  // MAX
  max(columnName: string, condition: any) {
    `SELECT MAX(${columnName})
    FROM ${this.table}
    WHERE ${condition};`
  }
}
