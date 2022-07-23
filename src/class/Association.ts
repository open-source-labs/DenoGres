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

export class BelongsTo extends Association {
  constructor(source:typeof Model, target:typeof Model, query:any, mappingDetails:any) {
    super(source, target, query, mappingDetails);    
    //this.mappingDetails = mappingDetails
    this.attachAssociationMethodsToModel(source)
    console.log("Source & Target?",source.name, target.name)
  }
  foreignKey_ColumnName = this.mappingDetails?.foreignKey_ColumnName
  targetModel_MappindColumnName = this.mappingDetails?.mappingTarget_ColumnName

  association_name = `${this.source.name}_belongsTo_${this.target.name}`

  getAccesorName = `get${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}`

  
  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModel(model:typeof Model) {
    const methodName = this.getAccesorName
    console.log("methodName? ",methodName)

    addMethodToModel(this, model, methodName)

    // // this part does NOT work. only works as separate part, don't know why
    // Object.defineProperty(model.prototype, methodName, {
    //   //when model's instance method is called, this will be returned
    //   value: function() {
    //     return this.getAssociatedData()
    //   }
    // }) 
  }

   // this is instance method e.g. profile1.getUser(), person.getSpecies()
  async getAssociatedData(instance:any) { // 
    console.log("instance? ", instance)
    //console.log("instance:", Object.getPrototypeOf(instance).constructor.table)

    let query = `
    SELECT * FROM ${this.target.table} 
    WHERE ${this.target.primaryKey || '_id'} ='${instance[this.foreignKey_ColumnName]}'`

    console.log(query)

    let wrongQuery = `
    SELECT * FROM ${this.target.table} 
    JOIN ${this.source.table} 
    ON ${this.targetModel_MappindColumnName} = ${this.source.table}.${this.foreignKey_ColumnName}
    WHERE ${this.target.primaryKey || 'id'} ='${instance[this.foreignKey_ColumnName]}'`


    const db = await ConnectDb()
    const queryResult = await db.queryObject(query);
    console.log(queryResult.rows)
  }
}

// e.g.
  // Profile.belongsTo(User) // 
  // created foreign key on Profile(source) model
  // profile1.getUser(); 

function addMethodToModel<T extends BelongsTo>(association:T, targetModel:typeof Model, ModelMethod:string) {
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

