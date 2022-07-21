import { Model } from './Model.ts'
import { ConnectDb, DisconnectDb } from '../functions/Db.ts';

abstract class Association {
  source: typeof Model;
  target: typeof Model;
  associationQuery:any;

  constructor(source:typeof Model, target:typeof Model, associationQuery:any) {
    this.source = source;
    this.target = target;
    this.associationQuery = associationQuery
  }
  abstract association_name:string;
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
  constructor(source:typeof Model, target:typeof Model, query:any) {
    super(source, target, query);
    this.attachAssociationMethodsToModel(source)
  }
  association_name = `${this.source.name}_belongsTo_${this.target.name}`
  getAccesorName = `get${this.target.name[0].toUpperCase()}${this.target.name.slice(1)}` 
  
  // add instance methods for create, get, update, delete
  private attachAssociationMethodsToModel(model:typeof Model) {
    const methodName = this.getAccesorName
    Object.defineProperty(model.prototype, methodName, {
      enumerable: false, 
      value() { console.log('this would be the association get method...') }
    }) 
  }
  // define the get method here
}
// e.g.
  // Profile.belongsTo(User) // 
  // created foreign key on Profile(source) model
  // profile1.getUser(); 