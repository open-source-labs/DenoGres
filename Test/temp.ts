
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import { Model } from '../src/class/Model.ts'



interface User {
  id:string;
  firstName:string;
  lastName?:string;
  points?: number;
}
class User extends Model {
  static table = 'users';
  static columns = {
    id: { type:'uuid', primaryKey: true },
    firstName: { type:'string', notNull: true },
    lastName: { type:'string', notNull: false },
    points: { type:'number', notNull: false }
  }
}



const db = await ConnectDb(); 

const user0 = new User();
user0.firstName = 'Test'
const saved = await user0.save()
//assertThrows(async () => await user0.save())
console.log("saved?:", saved)
DisconnectDb(db)
