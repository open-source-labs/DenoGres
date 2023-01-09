import { Model } from './Model.ts';
import { ConnectDb, DisconnectDb } from '../functions/Db.ts';

// each association class below includes a field 'mappingDetails' with this shape
interface mappingDetails {
  association_type?: string; // 'belongsTo', 'hasMany', 'or 'ManyToMany'
  association_name?: string; // 'modelA_hasMany_modelB' or 'modelA_belongsTo_modelB'
  targetModel?: typeof Model;
  foreignKey_ColumnName?: string;
  mapping_ColumnName?: string;

  // for ManyToMany
  modelA?: typeof Model;
  modelB?: typeof Model;
  throughModel?: typeof Model;
  modelA_foreignKey_inThroughModel?: string;
  modelB_foreignKey_inThroughModel?: string;
  modelA_mappingKey?: string;
  modelB_mappingKey?: string;
}

// defines general shape of association class, which each of the four following classes extend
abstract class Association {
  source: typeof Model;
  target: typeof Model;
  associationQuery: string; // query string to be executed in order to establish association in db
  mappingDetails: mappingDetails; // interface defined above

  constructor(source:typeof Model, target:typeof Model, mappingDetails:mappingDetails, associationQuery:string) {
    this.source = source;
    this.target = target;
    this.associationQuery = associationQuery;
    this.mappingDetails = mappingDetails;
  }
  abstract association_name: string;

  // args not decided yet, type 'any' for placeholder
  abstract getAssociatedData(...args: any): void;
  abstract addAssociatedData(...args: any): void;

  // all association classes contain this method, which EXECUTES a query creating an association in the db
  // association classes (ex: 'BelongsTo') are created and returned by the model methods of the same
  // name defined in Model.ts--these methods build the necessary query and pass it to the association instance's
  // constructor--but to establish the desired association in the db itself, a user must invoke this
  // 'syncAssociation' method on the instance of the association returned, ex:
  // STEP 1) const userProfileAssociation = await Profile.belongsTo(User)
  // STEP 2) userProfileAssociation.syncAssociation()
  async syncAssociation(uri?: string) {
    if (!this.associationQuery) {
      console.log(
        'No association query exist. Possibly already existing association.',
      );
    } else {
      const db = await ConnectDb(uri);
      try {
        await db.queryObject(this.associationQuery);
        console.log('syncing db...');
        console.log(`executing ${this.associationQuery}`);
      } catch (error) {
        console.error(error);
      } finally {
        DisconnectDb(db);
      }
    }
  }
} //end of abstract class Association

// when the 'hasOne' method is invoked on modelA, passing in modelB, this invokes the 'belongsTo' method on modelB,
// which returns a new instance of this 'HasOne' class, where the source is modelB and the target is modelA
export class HasOne extends Association {
  constructor(
    source: typeof Model,
    target: typeof Model,
    mappingDetails: mappingDetails,
    query: string,
  ) {
    super(source, target, mappingDetails, query);
    this.attachAssociationMethodsToModel();
  }

  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName;
  targetModel_MappindColumnName = this.mappingDetails?.mapping_ColumnName;
  association_name = `${this.target.name}_hasOne_${this.source.name}`; // ex: 'country_hasOne_capital'
  getAccesorName = `get${this.source.name[0].toUpperCase()}${
    this.source.name.slice(1)
  }`; // ex: 'getCapital'
  addAccesorName = `add${this.source.name[0].toUpperCase()}${
    this.source.name.slice(1)
  }`; // ex: 'addCapital'
  // add instance methods for create, get, update, delete

  // adds two methods to the target model: a getter and a setter
  // ex: if Country.hasOne(Capital), then add 'getCapital' and 'addCapital' to Country model
  private attachAssociationMethodsToModel() {
    addGetterToModel(this, this.target, this.getAccesorName);
    addSetterToModel(this, this.target, this.addAccesorName);
  }

  // invoked by the getter method on the target model to retrieve related row from the source table
  async getAssociatedData(instance: any, uri?: string) {
    let query = '';
    let queryResult: any;
    if (this.targetModel_MappindColumnName) { // type checking
      query = `SELECT * FROM ${this.source.table} 
        WHERE ${this.foreignKey_ColumnName} ='${instance[this.targetModel_MappindColumnName]}'`
    }
    const db = await ConnectDb(uri);
    try {
      queryResult = await db.queryObject(query);
    } catch (error) {
      console.log(error);
    } finally {
      DisconnectDb(db)
    }
    return queryResult.rows
  }

  // invoked by the setter method on the target model to add related row on the source table
  async addAssociatedData(instance: any, values: any, uri?: string) {
    let query = '';
    // case1. value is an object (e.g. {id:1})
    // case2. value is an instance of source table
    if (values.id) {
      // <<<<<< instance id hard coded for now
      query = `UPDATE ${this.source.table} SET ${this.foreignKey_ColumnName}='${
        instance.id || instance._id
      }' WHERE ${this.targetModel_MappindColumnName}=${values.id}`;
    } else if (values instanceof this.source) {
      // if this instance has no id, assuem it's not yet created in the database and create the record
      // if this instance has id, assume it's in the database and just update the foreign key column
      const toObj = Object.assign({}, values);
      const objKeys = Object.keys(toObj).join(',');
      const objVals = Object.values(toObj).map((el) => `'${el}'`).join(',');
      const instanceId = instance.id || instance._id; // <<<<<<<<< HARD CODED for now

      query =
        `INSERT INTO ${this.source.table} (${objKeys}, ${this.foreignKey_ColumnName}) VALUES (${objVals}, '${instanceId}');`;
      // postres auto converting string to numbers
    }

    const db = await ConnectDb(uri);
    try {
      await db.queryObject(query);
    } catch (error) {
      console.log(error);
    } finally {
      DisconnectDb(db);
    }
  }
} // end of HasOne class

export class BelongsTo extends Association {
  constructor(
    source: typeof Model,
    target: typeof Model,
    mappingDetails: mappingDetails,
    query: string,
  ) {
    super(source, target, mappingDetails, query);
    //this.mappingDetails = mappingDetails
    this.attachAssociationMethodsToModel();
  }
  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName; // ex: 'country_id'
  targetModel_MappindColumnName = this.mappingDetails?.mapping_ColumnName; // ex: 'id'
  association_name = `${this.source.name}_belongsTo_${this.target.name}`; // ex: 'capital_belongsTo_country'
  getAccesorName = `get${this.target.name[0].toUpperCase()}${
    this.target.name.slice(1)
  }`; // ex: 'getCountry'
  addAccesorName = `add${this.target.name[0].toUpperCase()}${
    this.target.name.slice(1)
  }`; // ex: 'addCountry'

  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModel() {
    addGetterToModel(this, this.source, this.getAccesorName);
    addSetterToModel(this, this.target, this.addAccesorName);
  }

  // this is instance method e.g. profile1.getUser(), person.getSpecies()
  async getAssociatedData(instance: any, uri?: string) { //
    let query = '';
    let queryResult: any;
    if (this.foreignKey_ColumnName) { // type checking
      query = `SELECT * FROM ${this.target.table} 
      WHERE ${this.targetModel_MappindColumnName} ='${
        instance[this.foreignKey_ColumnName]
      }'`;
    }
    const db = await ConnectDb(uri);
    try {
      queryResult = await db.queryObject(query);
    } catch (error) {
      console.log(error);
    } finally {
      DisconnectDb(db);
    }
    return queryResult.rows;
  }

  // setter method is still a work in progress
  async addAssociatedData() {
    console.log('BelongsTo\'s addAssociatedData');
  }
} // end of BelongsTo class

// e.g. Species.hasMany(Person)
export class HasMany extends Association {
  constructor(
    source: typeof Model,
    target: typeof Model,
    mappingDetails: mappingDetails,
    query: string,
  ) {
    super(source, target, mappingDetails, query);
    this.attachAssociationMethodsToModel(source);
  } //end of constructor

  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName;
  mapping_ColumnName = this.mappingDetails?.mapping_ColumnName;
  association_name = `${this.source.name}_hasMany_${this.target.name}`;
  getAccesorName = `get${this.target.name[0].toUpperCase()}${
    this.target.name.slice(1)
  }s`; // ex: 'getSpecies'
  addAccesorName = `add${this.target.name[0].toUpperCase()}${
    this.target.name.slice(1)
  }s`; // ex: 'addPlanets'

  // add instance methods for create, get, update, delete
  // but currently only has get
  private attachAssociationMethodsToModel(model: typeof Model) {
    const methodName = this.getAccesorName;

    addGetterToModel(this, model, methodName);
    addSetterToModel(this, this.target, this.addAccesorName);
  }

  // this is instance method e.g. species1.getPeople()
  async getAssociatedData(instance: any, uri?: string) {
    let query = '';
    if (this.mapping_ColumnName) {
      query = `
        SELECT * FROM ${this.target.table} 
        WHERE ${this.foreignKey_ColumnName} ='${
        instance[this.mapping_ColumnName]
      }'`;
    }

    const db = await ConnectDb(uri);
    let queryResult: any;
    try {
      queryResult = await db.queryObject(query);
    } catch (error) {
      console.log(error);
    } finally {
      DisconnectDb(db);
    }
    return queryResult.rows;
  }

  // setter method is still a work in progress
  async addAssociatedData() {
    console.log('HasMany\'s addAssociatedData');
  }
} //end of hasMany

export class ManyToMany extends Association {
  constructor(
    source: typeof Model,
    target: typeof Model,
    mappingDetails: mappingDetails,
    query: string,
  ) {
    super(source, target, mappingDetails, query);
    this.attachAssociationMethodsToModels();
  } // end of constructor

  modelA = this.source;
  modelB = this.target;
  throughModel = this.mappingDetails.throughModel;
  modelA_foreignKey_inThroughModel =
    this.mappingDetails.modelA_foreignKey_inThroughModel;
  modelB_foreignKey_inThroughModel =
    this.mappingDetails.modelB_foreignKey_inThroughModel;
  modelA_mappingKey = this.mappingDetails.modelA_mappingKey;
  modelB_mappingKey = this.mappingDetails.modelB_mappingKey;
  association_name = `${this.modelA.name}_ManyToMany_${this.modelB.name}`;
  getAccesorName_A = `get${this.modelB.name[0].toUpperCase()}${
    this.modelB.name.slice(1)
  }s`;
  getAccesorName_B = `get${this.modelA.name[0].toUpperCase()}${
    this.modelA.name.slice(1)
  }s`;
  addAccesorName_A = `add${this.modelB.name[0].toUpperCase()}${
    this.modelB.name.slice(1)
  }s`;
  addAccesorName_B = `add${this.modelA.name[0].toUpperCase()}${
    this.modelA.name.slice(1)
  }s`;

  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModels() {
    addGetterToModel(this, this.modelA, this.getAccesorName_A);
    addGetterToModel(this, this.modelB, this.getAccesorName_B);
    //addSetterToModel(this, this.target, this.addAccesorName_A)
    //addSetterToModel(this, this.target, this.addAccesorName_B)
  }

  async getAssociatedData<T extends {}>(instance: T, uri?: string) {
    let query = '';
    let queryResult: any;
    if (instance.constructor === this.modelA) {
      if (this.throughModel && this.modelA_mappingKey) {
        query = `SELECT ${this.modelB.table}.* FROM ${this.modelB.table}
        INNER JOIN ${this.throughModel.table} 
        ON ${this.modelB.table}.${this.modelB_mappingKey} = ${this.throughModel.table}.${this.modelB_foreignKey_inThroughModel}
        INNER JOIN ${this.modelA.table} ON ${this.throughModel.table}.${this.modelA_foreignKey_inThroughModel} = ${this.modelA.table}.${this.modelA_mappingKey} 
        WHERE ${this.modelA.table}.${this.modelA_mappingKey} = '${
          instance[this.modelA_mappingKey]
        }' ORDER BY ${this.modelB.table}.${this.modelB_mappingKey}`;
      }
    } else if (instance.constructor === this.modelB) {
      if (this.throughModel && this.modelB_mappingKey) {
        query = `SELECT ${this.modelA.table}.* FROM ${this.modelA.table}
        INNER JOIN ${this.throughModel.table} 
        ON ${this.modelA.table}.${this.modelA_mappingKey} = ${this.throughModel.table}.${this.modelA_foreignKey_inThroughModel}
        INNER JOIN ${this.modelB.table} ON ${this.throughModel.table}.${this.modelB_foreignKey_inThroughModel} = ${this.modelB.table}.${this.modelB_mappingKey}
        WHERE ${this.modelB.table}.${this.modelB_mappingKey} = '${
          instance[this.modelB_mappingKey]
        }' ORDER BY ${this.modelA.table}.${this.modelA_mappingKey}`;
      }
    }  
      const db = await ConnectDb(uri)      
      try {
        queryResult = await db.queryObject(query);
      } catch (error) {
        console.log(error)
      } finally {
        DisconnectDb(db)
    }
    return queryResult.rows
  }

  // WIP
  async addAssociatedData(){
    console.log("ManyToMany's addAssociatedData")
  }
} // end of ManyToMany class


// accepts an association class (like 'HasOne'), the target model (like 'Country'), and the ModelMethod (like 'getCapital')
// adds a method with the given name to the target model's prototype, which will act as a getter to retrieve a given model
// instance's associated data (ex: canada.getCapital() will return the Ottawa row from the db)
function addGetterToModel<T extends Association>(
  association: T,
  targetModel: typeof Model,
  ModelMethod: string,
) {
  Object.defineProperty(targetModel.prototype, ModelMethod, {
    enumerable: false, 
    value(options:any) {
      return association.getAssociatedData(this, options)
    } // 'this' is the instance calling 'ModelMethod' method
  }) 
}

// just like 'addGetterToModel' but used to add a setter method, like 'addCapital'
function addSetterToModel<T extends Association>(
  association: T,
  targetModel: typeof Model,
  ModelMethod: string,
) {
  Object.defineProperty(targetModel.prototype, ModelMethod, {
    enumerable: false, 
    value(val:any, options:any) {
      return association.addAssociatedData(this, val, options)
    } // 'this' is the instance calling 'ModelMethod' method
  }) 
}


