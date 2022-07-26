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
    console.log('syncing db...')
    console.log(`executing ${this.associationQuery}`)
    const db = await ConnectDb();
    try {      
      await db.queryObject(this.associationQuery)  
    } catch (error) {
      console.error(error)
    } finally {
      DisconnectDb(db)
    }
  }
}
/*
const mappingDetails = {
      association_type: 'belongsTo',
      association_name: `${this.name}_belongsTo_${targetModel.name}`,
      targetModel: targetModel,
      foreignKey_ColumnName : foreignKey_ColumnName,
      mappingTarget_ColumnName : mappingTarget_ColumnName,
    }
*/


export class BelongsTo extends Association {
  constructor(source:typeof Model, target:typeof Model, mappingDetails:any, query:any) {
    super(source, target, mappingDetails, query);    
    //this.mappingDetails = mappingDetails
    this.attachAssociationMethodsToModel(source)
  }
  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName  
  targetModel_MappindColumnName = this.mappingDetails?.mapping_ColumnName
  association_name = `${this.source.name}_belongsTo_${this.target.name}`
  getAccesorName = `get${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}`

  
  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModel(model:typeof Model) {
    const methodName = this.getAccesorName
    console.log("methodName? ",methodName)

    addMethodToModel(this, model, methodName)
  }

   // this is instance method e.g. profile1.getUser(), person.getSpecies()
  async getAssociatedData(instance:any) { // 
    console.log("instance? ", instance)
    console.log("THIS: ", this)

    let query = `
    SELECT * FROM ${this.target.table} 
    WHERE ${this.targetModel_MappindColumnName} ='${instance[this.foreignKey_ColumnName]}'`

    console.log(query)
    console.log('targetModel_MappindColumnName: ', this.targetModel_MappindColumnName)

    const db = await ConnectDb()
    const queryResult = await db.queryObject(query);
    console.log(queryResult.rows)
  }
}


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
  async getAssociatedData(instance:any) {
    console.log("instance? ", instance)

    let query = `
    SELECT * FROM ${this.target.table} 
    WHERE ${this.foreignKey_ColumnName} ='${instance[this.mapping_ColumnName]}'`

    console.log("association query:", query)

    const db = await ConnectDb()
    const queryResult = await db.queryObject(query);
    console.log(queryResult.rows)
  }
  
}//end of hasMany

// e.g.
  // Profile.belongsTo(User) // 
  // created foreign key on Profile(source) model
  // profile1.getUser(); 

function addMethodToModel<T extends Association>(association:T, targetModel:typeof Model, ModelMethod:string) {
  //const methodName = this.getAccesorName
  //console.log(methodName)
  Object.defineProperty(targetModel.prototype, ModelMethod, {
    enumerable: false, 
    //writable: true,
    value() {
      return association.getAssociatedData(this)
    } // 'this' is the instance calling 'ModelMethod' method
  }) 
}

