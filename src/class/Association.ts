import { Model } from './Model.ts'
import { ConnectDb, DisconnectDb } from '../functions/Db.ts';


interface mappingDetails {
  association_type?: string;
  association_name?: string;
  targetModel?: typeof Model;
  foreignKey_ColumnName?:string;
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

abstract class Association {
  source: typeof Model;
  target: typeof Model;
  associationQuery:string;
  mappingDetails:mappingDetails;

  constructor(source:typeof Model, target:typeof Model, mappingDetails:mappingDetails, associationQuery:string) {
    this.source = source;
    this.target = target;
    this.associationQuery = associationQuery
    this.mappingDetails = mappingDetails
  }
  abstract association_name:string; 

  // args not decided yet, type 'any' for placeholder
  abstract getAssociatedData(...args:any): void
  abstract addAssociatedData(...args:any): void

  // Table altering query
  async syncAssociation() {
    if(!this.associationQuery) {
      console.log('No association query exist. Possibley already existing association.')
    } else {
      const db = await ConnectDb();
      try {      
        await db.queryObject(this.associationQuery)
        console.log('syncing db...')
        console.log(`executing ${this.associationQuery}`)
      } catch (error) {
        console.error(error)
      } finally {
        DisconnectDb(db)
      }
    }    
  }
}//end of abstract class Association

export class HasOne extends Association {
  constructor(source:typeof Model, target:typeof Model, mappingDetails:mappingDetails, query:string) {
    super(source, target, mappingDetails, query);    
    this.attachAssociationMethodsToModel()
  } // end of constructor
  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName   // "user_id"
  targetModel_MappindColumnName = this.mappingDetails?.mapping_ColumnName // "id"
  association_name = `${this.target.name}_hasOne_${this.source.name}`
  getAccesorName = `get${this.source.name[0].toUpperCase()}${this.source.name.slice(1)}`
  addAccesorName = `add${this.source.name[0].toUpperCase()}${this.source.name.slice(1)}`
  // add instance methods for create, get, update, delete

  private attachAssociationMethodsToModel() {
    addMethodToModel(this, this.target, this.getAccesorName)
    addAddMethodToModel(this, this.target, this.addAccesorName)
  }

  async getAssociatedData(instance:any, options?:any) {
    let query = ''
    let queryResult:any
    if(this.targetModel_MappindColumnName) { // type checking 
      query = `SELECT * FROM ${this.source.table} 
        WHERE ${this.foreignKey_ColumnName} ='${instance[this.targetModel_MappindColumnName]}'`
    }
    //console.log(query)
    const db = await ConnectDb()
    try {
      queryResult = await db.queryObject(query);
    } catch (error) {
      console.log(error)
    } finally {
      DisconnectDb(db)
    }
    return queryResult.rows
  }
  async addAssociatedData(instance:any, values:any){
    let query = ''
    let queryResult:any
    // case1. value is an object (e.g. {id:1})
    // case2. value is an instance of source table
    if(values.id) {
      // <<<<<< instance id hard coded for now
      query = `UPDATE ${this.source.table} SET ${this.foreignKey_ColumnName}='${instance.id || instance._id}' WHERE ${this.targetModel_MappindColumnName}=${values.id}`
    }
    else if(values instanceof this.source) {

      // if this instance has no id, assuem it's not yet created in the database and create the record
      // if this instance has id, assume it's in the database and just update the foreign key column
      const toObj = Object.assign({}, values)
      const objKeys = Object.keys(toObj).join(',')
      const objVals = Object.values(toObj).map(el => `'${el}'`).join(',')
      const instanceId = instance.id || instance._id // <<<<<<<<< HARD CODED for now

      query = `INSERT INTO ${this.source.table} (${objKeys}, ${this.foreignKey_ColumnName}) VALUES (${objVals}, '${instanceId}');`
      // postres auto converting string to numbers
    }

    const db = await ConnectDb()
    try {
      await db.queryObject(query);
    } catch (error) {
      console.log(error)
    } finally {
      DisconnectDb(db)
    }
  }
} // end of HasOne class

export class BelongsTo extends Association {
  constructor(source:typeof Model, target:typeof Model, mappingDetails:mappingDetails, query:string) {
    super(source, target, mappingDetails, query);    
    //this.mappingDetails = mappingDetails
    this.attachAssociationMethodsToModel()
  }
  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName  
  targetModel_MappindColumnName = this.mappingDetails?.mapping_ColumnName
  association_name = `${this.source.name}_belongsTo_${this.target.name}`
  getAccesorName = `get${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}`
  addAccesorName = `add${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}`
  
  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModel() {
    //console.log("getAccesorName: ", this.getAccesorName)
    addMethodToModel(this, this.source, this.getAccesorName)
    addAddMethodToModel(this, this.target, this.addAccesorName)
  }

   // this is instance method e.g. profile1.getUser(), person.getSpecies()
  async getAssociatedData(instance:any, options?:any) { // 
    let query = ''
    let queryResult:any
    if(this.foreignKey_ColumnName) { // type checking
      query = `SELECT * FROM ${this.target.table} 
      WHERE ${this.targetModel_MappindColumnName} ='${instance[this.foreignKey_ColumnName]}'`
    }
    //console.log(query)
    const db = await ConnectDb()
    try {
      queryResult = await db.queryObject(query);
    } catch (error) {
      console.log(error)
    } finally {
      DisconnectDb(db)
    }
    return queryResult.rows
  }
  async addAssociatedData(){
    console.log("BelongsTo's addAssociatedData")
  }
}// end of BelonsTo class


// e.g. Species.hasMany(Person)
export class HasMany extends Association {
  constructor(source:typeof Model, target:typeof Model, mappingDetails:mappingDetails, query:string) {
    super(source, target, mappingDetails, query);
    this.attachAssociationMethodsToModel(source)
    //console.log("mapping Details",mappingDetails)
  }//end of constructor

  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName
  mapping_ColumnName = this.mappingDetails?.mapping_ColumnName
  association_name = `${this.source.name}_hasMany_${this.target.name}`
  getAccesorName = `get${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}s`
  addAccesorName = `add${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}s`

  // add instance methods for create, get, update, delete
  // but currently only has get
  private attachAssociationMethodsToModel(model:typeof Model) {
    const methodName = this.getAccesorName
    //console.log("methodName? ",methodName)
    
    addMethodToModel(this, model, methodName)
    addAddMethodToModel(this, this.target, this.addAccesorName)
  }

  // this is instance method e.g. species1.getPeople()
  async getAssociatedData(instance:any, options?:any) {
    let query = ''
    if(this.mapping_ColumnName) {
      query = `
        SELECT * FROM ${this.target.table} 
        WHERE ${this.foreignKey_ColumnName} ='${instance[this.mapping_ColumnName]}'`
    }
    //console.log("association query:", query)

    const db = await ConnectDb()
    let queryResult:any
    try {
      queryResult = await db.queryObject(query);
    } catch (error) {
      console.log(error)
    } finally {
      DisconnectDb(db)
    }
    return queryResult.rows
  }
  async addAssociatedData(){
    console.log("HasMany's addAssociatedData")
  }
  
}//end of hasMany



export class ManyToMany extends Association {
  constructor(source:typeof Model, target:typeof Model, mappingDetails:mappingDetails, query:string) {
    super(source, target, mappingDetails, query);    
    this.attachAssociationMethodsToModels()
  } // end of constructor
  modelA = this.source
  modelB = this.target
  throughModel = this.mappingDetails.throughModel
  modelA_foreignKey_inThroughModel = this.mappingDetails.modelA_foreignKey_inThroughModel
  modelB_foreignKey_inThroughModel = this.mappingDetails.modelB_foreignKey_inThroughModel
  modelA_mappingKey = this.mappingDetails.modelA_mappingKey
  modelB_mappingKey = this.mappingDetails.modelB_mappingKey
  association_name = `${this.modelA.name}_ManyToMany_${this.modelB.name}`
  getAccesorName_A = `get${this.modelB.name[0].toUpperCase()}${this.modelB.name.slice(1)}s`
  getAccesorName_B = `get${this.modelA.name[0].toUpperCase()}${this.modelA.name.slice(1)}s`
  addAccesorName_A = `add${this.modelB.name[0].toUpperCase()}${this.modelB.name.slice(1)}s`
  addAccesorName_B = `add${this.modelA.name[0].toUpperCase()}${this.modelA.name.slice(1)}s`
  // console.log("getAccesorName_A & B: ", getAccesorName_A, getAccesorName_B)
  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModels() {
    //console.log("getAccesorName_A & B: ", this.getAccesorName_A, this.getAccesorName_B)

    addMethodToModel(this, this.modelA, this.getAccesorName_A)
    addMethodToModel(this, this.modelB, this.getAccesorName_B)
    //addAddMethodToModel(this, this.target, this.addAccesorName_A)
    //addAddMethodToModel(this, this.target, this.addAccesorName_B)
  }

  async getAssociatedData<T extends {}>(instance:T, options?:any) {
    //console.log("instance? ", instance)
    //console.log("OPTIONS: ", options)
    //console.log("THIS: ", this)
    let query = ''
    let queryResult:any
    if(instance.constructor === this.modelA) {
      if(this.throughModel && this.modelA_mappingKey) {
        query = `SELECT ${this.modelB.table}.* FROM ${this.modelB.table}
        INNER JOIN ${this.throughModel.table} 
        ON ${this.modelB.table}.${this.modelB_mappingKey} = ${this.throughModel.table}.${this.modelB_foreignKey_inThroughModel}
        INNER JOIN ${this.modelA.table} ON ${this.throughModel.table}.${this.modelA_foreignKey_inThroughModel} = ${this.modelA.table}.${this.modelA_mappingKey} 
        WHERE ${this.modelA.table}.${this.modelA_mappingKey} = '${instance[this.modelA_mappingKey]}' ORDER BY ${this.modelB.table}.${this.modelB_mappingKey}`
      }      
    } else if(instance.constructor === this.modelB) {
      if(this.throughModel && this.modelB_mappingKey) {
        query = `SELECT ${this.modelA.table}.* FROM ${this.modelA.table}
        INNER JOIN ${this.throughModel.table} 
        ON ${this.modelA.table}.${this.modelA_mappingKey} = ${this.throughModel.table}.${this.modelA_foreignKey_inThroughModel}
        INNER JOIN ${this.modelB.table} ON ${this.throughModel.table}.${this.modelB_foreignKey_inThroughModel} = ${this.modelB.table}.${this.modelB_mappingKey}
        WHERE ${this.modelB.table}.${this.modelB_mappingKey} = '${instance[this.modelB_mappingKey]}' ORDER BY ${this.modelA.table}.${this.modelA_mappingKey}`
      }
    }  
      const db = await ConnectDb()      
      try {
        queryResult = await db.queryObject(query);
      } catch (error) {
        console.log(error)
      } finally {
        DisconnectDb(db)
    }
    //console.log(queryResult.rows)
    return queryResult.rows
  }
  async addAssociatedData(){
    console.log("ManyToMany's addAssociatedData")
  }
} // end of ManyToMany class



// options are not decided yet, thus type 'any' for placeholder

function addMethodToModel<T extends Association>(association:T, targetModel:typeof Model, ModelMethod:string) {
  //console.log("association.name: ", association.association_name)
  //console.log("targetModel, ModelMethod: ", targetModel.name, ModelMethod)
  Object.defineProperty(targetModel.prototype, ModelMethod, {
    enumerable: false, 
    value(options:any) {
      return association.getAssociatedData(this, options)
    } // 'this' is the instance calling 'ModelMethod' method
  }) 
}

//called by addAddMethodToModel(this, this.target, this.getAccesorName)
function addAddMethodToModel<T extends Association>(association:T, targetModel:typeof Model, ModelMethod:string) {
  //console.log("association.name: ", association.association_name)
  //console.log("targetModel, ModelMethod: ", targetModel.name, ModelMethod)
  Object.defineProperty(targetModel.prototype, ModelMethod, {
    enumerable: false, 
    value(val:any, options:any) {
      return association.addAssociatedData(this, val, options)
    } // 'this' is the instance calling 'ModelMethod' method
  }) 
}


