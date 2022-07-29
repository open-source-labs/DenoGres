import { Model } from './Model.ts'
import { ConnectDb, DisconnectDb } from '../functions/Db.ts';

abstract class Association {
  source: typeof Model;
  target: typeof Model;
  associationQuery:any;
  mappingDetails:any;

  constructor(source:typeof Model, target:typeof Model, mappingDetails:any, associationQuery:string) {
    this.source = source;
    this.target = target;
    this.associationQuery = associationQuery
    this.mappingDetails = mappingDetails
  }
  abstract association_name:string; 
  abstract getAssociatedData(...args:any): void

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
  constructor(source:typeof Model, target:typeof Model, mappingDetails:any, query:any) {
    super(source, target, mappingDetails, query);    
    this.attachAssociationMethodsToModel()
  } // end of constructor
  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName   // "user_id"
  targetModel_MappindColumnName = this.mappingDetails?.mapping_ColumnName // "id"
  association_name = `${this.target.name}_hasOne_${this.source.name}`
  getAccesorName = `get${this.source.name[0].toUpperCase()}${this.source.name.slice(1)}`
  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModel() {
    console.log("target", this.target.name) // User
    console.log("source", this.source.name) // Profile
    console.log("getAccesorName of HasOne: ", this.getAccesorName) //getProfile
    console.log("this.mappingDetails", this.mappingDetails)
    addMethodToModel(this, this.target, this.getAccesorName)
  }
  async getAssociatedData(instance:any, options?:any) {
    console.log("instance? ", instance)
    //console.log("THIS: ", this)
    let query = ''
    let queryResult:any
    query = `SELECT * FROM ${this.source.table} 
        WHERE ${this.foreignKey_ColumnName} ='${instance[this.targetModel_MappindColumnName]}'`
    console.log(query)
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
}

export class BelongsTo extends Association {
  constructor(source:typeof Model, target:typeof Model, mappingDetails:any, query:any) {
    super(source, target, mappingDetails, query);    
    //this.mappingDetails = mappingDetails
    this.attachAssociationMethodsToModel()
  }
  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName  
  targetModel_MappindColumnName = this.mappingDetails?.mapping_ColumnName
  association_name = `${this.source.name}_belongsTo_${this.target.name}`
  getAccesorName = `get${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}`
  
  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModel() {
    console.log("getAccesorName: ", this.getAccesorName)
    addMethodToModel(this, this.source, this.getAccesorName)
  }

   // this is instance method e.g. profile1.getUser(), person.getSpecies()
  async getAssociatedData(instance:any, options?:any) { // 
    console.log("instance? ", instance)
    //console.log("THIS: ", this)
    let query = ''
    let queryResult:any
    query = `SELECT * FROM ${this.target.table} 
      WHERE ${this.targetModel_MappindColumnName} ='${instance[this.foreignKey_ColumnName]}'`

    console.log(query)
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
}// end of BelonsTo class


// e.g. Species.hasMany(Person)
export class HasMany extends Association {
  constructor(source:typeof Model, target:typeof Model, mappingDetails:any, query:any) {
    super(source, target, mappingDetails, query);
    this.attachAssociationMethodsToModel(source)
    //console.log("mapping Details",mappingDetails)
  }//end of constructor

  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName
  mapping_ColumnName = this.mappingDetails?.mapping_ColumnName
  association_name = `${this.source.name}_hasMany_${this.target.name}`
  getAccesorName = `get${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}s`

  // add instance methods for create, get, update, delete
  // but currently only has get
  private attachAssociationMethodsToModel(model:typeof Model) {
    const methodName = this.getAccesorName
    console.log("methodName? ",methodName)
    
    addMethodToModel(this, model, methodName)
  }

  // this is instance method e.g. species1.getPeople()
  async getAssociatedData(instance:any, options?:any) {
    console.log("instance? ", instance)

    let query = `
    SELECT * FROM ${this.target.table} 
    WHERE ${this.foreignKey_ColumnName} ='${instance[this.mapping_ColumnName]}'`

    console.log("association query:", query)

    const db = await ConnectDb()
    let queryResult:any
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
  
}//end of hasMany



export class ManyToMany extends Association {
  constructor(source:typeof Model, target:typeof Model, mappingDetails:any, query:any) {
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
  // console.log("getAccesorName_A & B: ", getAccesorName_A, getAccesorName_B)
  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModels() {
    console.log("getAccesorName_A & B: ", this.getAccesorName_A, this.getAccesorName_B)

    addMethodToModel(this, this.modelA, this.getAccesorName_A)
    addMethodToModel(this, this.modelB, this.getAccesorName_B)
  }

  async getAssociatedData(instance:any, options?:any) {
    //console.log("instance? ", instance)
    //console.log("OPTIONS: ", options)
    //console.log("THIS: ", this)
    let query = ''
    let queryResult:any
    if(instance.constructor === this.modelA) {
      query = `SELECT ${this.modelB.table}.* FROM ${this.modelB.table}
        INNER JOIN ${this.throughModel.table} 
        ON ${this.modelB.table}.${this.modelB_mappingKey} = ${this.throughModel.table}.${this.modelB_foreignKey_inThroughModel}
        INNER JOIN ${this.modelA.table} ON ${this.throughModel.table}.${this.modelA_foreignKey_inThroughModel} = people._id
        WHERE ${this.modelA.table}.${this.modelA_mappingKey} = ${instance[this.modelA_mappingKey]} ORDER BY ${this.modelB.table}.${this.modelB_mappingKey}`
    } else if(instance.constructor === this.modelB) {
      query = `SELECT ${this.modelA.table}.* FROM ${this.modelA.table}
        INNER JOIN ${this.throughModel.table} 
        ON ${this.modelA.table}.${this.modelA_mappingKey} = ${this.throughModel.table}.${this.modelA_foreignKey_inThroughModel}
        INNER JOIN ${this.modelB.table} ON ${this.throughModel.table}.${this.modelB_foreignKey_inThroughModel} = people._id
        WHERE ${this.modelB.table}.${this.modelB_mappingKey} = ${instance[this.modelB_mappingKey]} ORDER BY ${this.modelA.table}.${this.modelA_mappingKey}`
    }  
    console.log(query)
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
} // end of ManyToMany class


function addMethodToModel<T extends Association>(association:T, targetModel:typeof Model, ModelMethod:string) {
  console.log("association.name: ", association.association_name)
  console.log("targetModel, ModelMethod: ", targetModel.name, ModelMethod)
  Object.defineProperty(targetModel.prototype, ModelMethod, {
    enumerable: false, 
    //writable: true,
    value(options:any) {
      return association.getAssociatedData(this, options)
    } // 'this' is the instance calling 'ModelMethod' method
  }) 
}



