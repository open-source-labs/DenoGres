import { Model } from '../src/model/Model.ts'
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';


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

class BelongsTo extends Association {
  // Profile.belongsTo(User) // 
  // created foreign key on this(source) model
  constructor(source:typeof Model, target:typeof Model, query:any) {
    super(source, target, query);
  }
  association_name = `${this.source.name}_belongsTo_${this.target.name}`
}



class User extends Model {
  static table_name = 'users';
  static columns = {
    id: { type:'uuid', primaryKey: true },
    firstName: { type:'string', notNull: true },
    lastName: { type:'string', notNull: false }
  }
}
// Database Sync
//User.sync() // create table in the database

class Profile extends Model {
  static table_name = 'profiles';
  static columns = {
    id: { type:'number', primaryKey: true, autoIncrement:true },
    email: { type:'string', notNull: true },
    address: { type:'string', notNull: false }
  }
}
