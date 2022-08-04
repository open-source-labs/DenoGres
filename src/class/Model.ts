import { ConnectDb, DisconnectDb } from '../functions/Db.ts';
import { BelongsTo, HasOne, HasMany, ManyToMany } from './Association.ts';
import { FIELD_TYPE } from '../constants/sqlDataTypes.ts';

interface IrecordPk {
  attname: string;
}
interface IpkObj {
  [key: string]: unknown;
}

// TYPE GUARD FUNCTIONS
const recordPk = (record: object): record is IrecordPk => {
  return 'attname' in record;
};

export class Model {
  [k: string]: any; // index signature
  static table: string;
  static columns: {
    [key: string]: {
      type: string;
      primaryKey?: boolean;
      notNull?: boolean;
      unique?: boolean;
      checks?: string[];
      defaultVal?: string | number | boolean | Date;
      autoIncrement?: boolean;
      association?: { rel_type?: string; table: string; mappedCol: string };
      length?: number;
      enumName?: string;
    };
  };
  static checks: string[];
  static unique: Array<string[]>;
  static primaryKey: string[];
  private static sql = '';
  static foreignKey: {
    columns: string[];
    mappedColumns: string[];
    rel_type?: string;
    table: string;
  }[];

  private record = {};

  private async primaryKey() {
    Model.sql = `SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid
      AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = '${
        Object.getPrototypeOf(this).constructor.table
      }'::regclass
      AND i.indisprimary;`
    const pk = await Model.query();
    let primaryKey = '';

    for (let i = 0; i < pk.length; i++) {
      const a = pk[i] as IpkObj;
      primaryKey += a.attname;
      if (i < pk.length - 1) primaryKey += ', ';
    }
    return primaryKey;
  }

  async save() {
    const table = Object.getPrototypeOf(this).constructor.table;
    const keys = Object.keys(this).filter(keys => keys !== 'record');
    const values = Object.values(this).filter(values => !(typeof values === 'object' && values !== null));

    Model.sql += `INSERT INTO ${table} (${keys.toString()}) VALUES (`;
    for (let i = 0; i < values.length; i++) {
      Model.sql += `'${values[i]}'`;
      if (i !== values.length - 1) Model.sql += ', ';
      else Model.sql += ')';
    }
    Model.sql += ` RETURNING *`
    const results = await Model.query();
    if (typeof results[0] === 'object' && results[0] !== null)
      this.record = results[0];
    return this;
  }

  async update() {
    const newKeys = Object.keys(this).filter(keys => keys !== 'record');
    const newValues = Object.values(this).filter(values => !(typeof values === 'object' && values !== null));
    const keys = Object.keys(this.record); 
    const values = Object.values(this.record);

    Model.sql = '';
    Model.sql += `UPDATE ${Object.getPrototypeOf(this).constructor.table} SET`;
    for (let i = 0; i < newKeys.length; i ++) {
      Model.sql += ` ${newKeys[i]} = '${newValues[i]}'`;
      if (i !== newValues.length - 1) Model.sql += ',';
    }
    Model.sql += ` WHERE`
    for (let i = 0; i < keys.length; i ++) {
      Model.sql += ` ${keys[i]} = '${values[i]}'`;
      if (i !== values.length - 1) Model.sql += ' AND';
    }
    return await Model.query();
  }

  // INSERT INTO VALUES: add value(s) to column(s) in this table
  static insert(...value: string[]) {
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
  static delete() {
    console.log(this.table);
    this.sql += `DELETE FROM ${this.table}`;
    return this;
  }

  // SELECT FROM: select column(s) from this table
  static select(...column: string[]) {
    this.sql += `SELECT ${column.toString()} FROM ${this.table}`;
    return this;
  }

  // WHERE: add condition(s) to query
  static where(...condition: string[]) {
    if (this.sql === '') this.sql += `SELECT * FROM ${this.table}`;
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
  static limit(limit: number) {
    this.sql += ` LIMIT ${limit}`;
    return this;
  }

  // HAVING: add condition(s) involving aggregate functions
  static having(...condition: string[]) {
    this.sql += ` HAVING ${condition[0]}`;
    for (let i = 1; i < condition.length; i++) {
      this.sql += ` ${condition[i]}`;
    }
    //console.log(this.query);
    return this;
  }

  // INNER JOIN: selects records with matching values on both tables
  static innerJoin(column1: string, column2: string, table2: string) {
    this.sql += ` INNER JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // LEFT JOIN: selects records from this table and matching values on table2
  static leftJoin(column1: string, column2: string, table2: string) {
    this.sql += ` LEFT JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // RIGHT JOIN: selects records from table2 and matching values on this table
  static rightJoin(column1: string, column2: string, table2: string) {
    this.sql += ` RIGHT JOIN ${table2} ON ${this.table}.${column1} = ${table2}.${column2}`;
    return this;
  }

  // FULL JOIN: selects all records when a match exists in either table
  static fullJoin(column1: string, column2: string, table2: string) {
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
  static count(column: string) {
    this.sql += `SELECT COUNT(${column}) FROM ${this.table}`;
    return this;
  }

  static sum(column: string) {
    this.sql += `SELECT SUM(${column}) FROM ${this.table}`;
    return this;
  }

  static avg(column: string) {
    this.sql += `SELECT AVG(${column}) FROM ${this.table}`;
    return this;
  }

  static min(column: string) {
    this.sql += `SELECT MIN(${column}) FROM ${this.table}`;
    return this;
  }

  static max(column: string) {
    this.sql += `SELECT MAX(${column}) FROM ${this.table}`;
    return this;
  }

  // execute query in database
  static async query(): Promise<unknown[]> {
    const db = await ConnectDb();
    const queryResult = await db.queryObject(this.sql);
    this.sql = '';
    await DisconnectDb(db);
    return queryResult.rows;
  }

  // same method with query but returning one instance
  // only work with getting
  static async queryInstance(print?: string) {
    const db = await ConnectDb();
    if (!this.sql.includes('SELECT a.attname') && print) console.log(this.sql);
    const queryResult = await db.queryObject(this.sql);
    this.sql = '';
    DisconnectDb(db);
    return Object.assign(new this(), queryResult.rows[0]);
  }

  //BELONGS TO
  // create foreign key on this model (if not exist)
  static async belongsTo(targetModel: typeof Model, options?: belongToOptions) {
    let foreignKey_ColumnName: string;
    let mappingTarget_ColumnName: string;
    let associationQuery = '';
    let rel_type = options?.associationName
      ? options?.associationName
      : 'belongsTo';

    const mappings = await getMappingKeys(this.table, targetModel.table);
    // if undefined --> no relationship exist, need to make new

    // IF Existing relationships
    if (mappings !== undefined && mappings !== null) {
      //console.log('========== EXISTING ASSOCIATION ===========');
      foreignKey_ColumnName = mappings.source_keyname;
      mappingTarget_ColumnName = mappings.target_keyname;
      // const columnAtt = {
      //   type: targetModel.columns[mappingTarget_ColumnName].type,
      //   association: { rel_type: rel_type, table: targetModel.table, mappedCol: mappingTarget_ColumnName }
      //  }
      // console.log("foreignKey_ColumnName: ", foreignKey_ColumnName)
      // Object.assign(this.columns[foreignKey_ColumnName], columnAtt)
    } else {
      // IF forming new relationships // not allowing user option for now (defaulting to target's primary key)
      //console.log('========== FORMING NEW ASSOCIATION ===========');
      foreignKey_ColumnName = `${targetModel.name.toLocaleLowerCase()}_id`;
      const tempPrime = await getprimaryKey(targetModel.table);
      mappingTarget_ColumnName = tempPrime ? tempPrime : 'id' || '_id'; // << hard coded

      const columnAtt = {
        type: targetModel.columns[mappingTarget_ColumnName].type,
        association: {
          rel_type: rel_type,
          table: targetModel.table,
          mappedCol: mappingTarget_ColumnName,
        },
      };

      this.columns[foreignKey_ColumnName] = columnAtt;
      //console.log('columnAtt: ', columnAtt);
      // only if there's NO existing association or existing foreign key
      associationQuery = `
      ALTER TABLE ${this.table} ADD ${foreignKey_ColumnName} ${
        FIELD_TYPE[columnAtt.type]
      };
      ALTER TABLE ${
        this.table
      } ADD CONSTRAINT fk_${foreignKey_ColumnName} FOREIGN KEY (${foreignKey_ColumnName}) REFERENCES ${
        targetModel.table
      } ON DELETE SET NULL ON UPDATE CASCADE
      ;`; // and this will NOT executed unless use explictly execute sync() on association instance created below
      //console.log('associationQuery:', associationQuery);
    }

    // ========= COMPOSITE FOREIGN KEYS ONLY ============
    // Add table constraints to static property 'foreignKay'
    // No need to add if not a composite foreign keys
    // this.foreignKey.push({
    //   columns:[foreignKey_ColumnName],
    //   mappedColumns: [mappingTarget_ColumnName],
    //   rel_type: 'belongsTo',
    //   model: targetModel
    // })

    const mappingDetails = {
      association_type: 'belongsTo',
      association_name: `${this.name}_belongsTo_${targetModel.name}`,
      targetModel: targetModel,
      foreignKey_ColumnName: foreignKey_ColumnName,
      mapping_ColumnName: mappingTarget_ColumnName,
    };

    //console.log('mappingDetails:', mappingDetails)
    if (options?.associationName === 'hasOne') {
      return new HasOne(this, targetModel, mappingDetails, associationQuery);
    } else {
      return new BelongsTo(this, targetModel, mappingDetails, associationQuery);
    }
  } // end of belongsTo

  static async hasOne(targetModel: typeof Model, options?: hasOneOptions) {
    return await targetModel.belongsTo(this, { associationName: 'hasOne' });
  }

  // e.g. Species.hasMany(Person) // making sure or creating foreign key in Person (people table)
  static async hasMany(targetModel: typeof Model, options?: hasManyOptions) {
    let mapping_ColumnName = ''; // mapping key in this model
    let targetModel_foreignKey = ''; // foreign key in targetModel
    let associationQuery = '';

    const mappings = await getMappingKeys(targetModel.table, this.table);
    if (mappings !== undefined && mappings !== null) {
      //console.log('========== EXISTING ASSOCIATION ===========');
      mapping_ColumnName = mappings.target_keyname;
      targetModel_foreignKey = mappings.source_keyname;
      const columnAtt = {
        //type: this.columns[mapping_ColumnName].type,
        association: {
          rel_type: 'belongsTo',
          table: this.table,
          mappedCol: mapping_ColumnName,
        },
      };
      //console.log("columnAtt: ", columnAtt)
      //Object.assign(targetModel.columns[targetModel_foreignKey], columnAtt)
      //console.log(targetModel.columns[targetModel_foreignKey])
    } else {
      // IF forming new relationships // not allowing user option for now (defaulting to target's primary key)
      //console.log('========== FORMING NEW ASSOCIATION ===========');
      //console.log('========== need to execute belongsTo first ===========');
    }
    // ========= WHEN COMPOSITE FOREIGN KEYS ...============

    // ======== BUILDING FOR ASSOCIATION INSTANCE =======
    const mappingDetails = {
      association_type: 'hasMany',
      association_name: `${this.name}_hasMany_${targetModel.name}`,
      targetModel: targetModel,
      foreignKey_ColumnName: targetModel_foreignKey,
      mapping_ColumnName: mapping_ColumnName,
    };
    //console.log(mappingDetails)
    return new HasMany(this, targetModel, mappingDetails, associationQuery);
  }

  test() {
    console.log(Object.keys(this));
    console.log(Object.getPrototypeOf(this).constructor.table);
  }
}
//end of Model class

interface IgetMappingKeysResult {
  [key: string]: string;
}

//helper function to find mapping keys between two tables
export async function getMappingKeys<T>(
  sourcTable: string,
  targetTable: string
): Promise<IgetMappingKeysResult | undefined | null> {
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
  const db = await ConnectDb();
  try {
    result = await db.queryObject(queryText, [sourcTable, targetTable]);
  } catch (error) {
    console.error(error);
  } finally {
    DisconnectDb(db);
  }
  //console.log('getMappingKeys RESULT', result);
  //if('rows' in result)
  if (typeof result === 'object' && 'rows' in result) {
    return result.rows[0] as IgetMappingKeysResult;
  }
} // end of getMappingKeys

//helper function to find existing foreign key related to target table
async function getForeignKey<T>(thisTable: string, targetTable: string) {
  const queryText = `SELECT a.attname
  FROM pg_constraint c 
  JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
  WHERE attrelid = $1::regclass AND c.contype = 'f' AND c.confrelid=$2::regclass`;
  let result;
  const db = await ConnectDb();
  try {
    result = await db.queryObject(queryText, [thisTable, targetTable]);
    //console.log("RESULT: ",result.rows[0].attname)
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

//helper function to find primary key of target table
export async function getprimaryKey<T>(
  tableName: string
): Promise<string | undefined | null> {
  const queryText = `SELECT a.attname 
  FROM pg_index i
  JOIN pg_attribute a ON a.attrelid = i.indrelid
  AND a.attnum = ANY(i.indkey)
  WHERE i.indrelid = $1::regclass
  AND i.indisprimary`;
  let result;
  const db = await ConnectDb();
  try {
    result = await db.queryObject(queryText, [tableName]);
    //console.log("RESULT: ",result.rows[0].attname)
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

interface belongToOptions {
  associationName?:string;
}
interface hasOneOptions {
  associationName?:string;
}
interface hasManyOptions {
  associationName?:string;
}
interface manyToManyOptions {
  through?: typeof Model;
  createThrough?: string;
  createXTable?: string;
}

export async function manyToMany(
  modelA: typeof Model,
  modelB: typeof Model,
  options: manyToManyOptions
) {
  let associationQuery = '';
  // for existing one (x-table also exist)
  if (options?.through) {
    const throughModel = options.through;
    const mapKeysA = await getMappingKeys(throughModel.table, modelA.table);
    const mapKeysB = await getMappingKeys(throughModel.table, modelB.table);
    // console.log("mapKeysA: ",mapKeysA)
    // console.log("mapKeysB: ",mapKeysB)
    if (mapKeysA && mapKeysB) {
      const mappingDetails = {
        association_type: 'ManyToMany',
        association_name: `${modelA.name}_hasMany_${modelB.name}`,
        modelA,
        modelB,
        throughModel,
        modelA_foreignKey_inThroughModel: mapKeysA.source_keyname,
        modelB_foreignKey_inThroughModel: mapKeysB.source_keyname,
        modelA_mappingKey: mapKeysA.target_keyname,
        modelB_mappingKey: mapKeysB.target_keyname,
      };
      //console.log("mappingDetails:", mappingDetails)
      //// return out association instance
      return new ManyToMany(modelA, modelB, mappingDetails, associationQuery);
    } else {
      throw new Error('This association does not exist');
    }
  } else if (options?.createThrough) {
    //// creating new x-table & new x-model
    const modelA_foreignKey_inThroughModel = modelA.primaryKey;
  }
}
