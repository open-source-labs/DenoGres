import { Model } from '../src/class/Model.ts'

import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
//import { BelongsTo } from '../src/class/Association.ts'

// sample test
interface User {
  id:string;
  firstName:string;
  lastName?:string;
}
class User extends Model {
  static table = 'users';
  static columns = {
    id: { type:'uuid', primaryKey: true },
    firstName: { type:'string', notNull: true },
    lastName: { type:'string', notNull: false },
    profile_id: { type:'number'}
  }
  static foreignKey = []
}

interface Profile {
  id:number;
  email:string;
  address?:string;
}
class Profile extends Model {
  static table = 'profiles';
  static columns = {
    id: { type:'number', primaryKey: true, autoIncrement:true },
    email: { type:'string', notNull: true },
    address: { type:'string', notNull: false },
    user_id: {type:'number'}
  };
  static foreignKey = []
}

// belongsTo test...
// await Profile.belongsTo(User)
// //console.log("Profile Model:", Profile)
// const p = new Profile();
// p.email = '111@111.com'
// p.user_id = '70b02ed2-c110-40eb-96fe-e0daf8a04132'
// p.getUser()


// hasOne method would go like this:

// foreign key in User Model
let User_hasOne_Profile = await User.hasOne(Profile) // this doesnt assign value to the constant, for it's await
//console.log("User_hasOne_Profile", User_hasOne_Profile) 

//await User_hasOne_Profile.syncAssociation() // syncing DB with ALTER TABLE query

// (for now): this is actually calling User.belongsTo(Profile) and making foreign key 'profile_id' in User table
// (just flipping)  -- need to make separate hasOne method later


const user0 = new User();
user0.profile_id = '1'
user0.getProfile();

// user0.firstName = 'user0-FirstName'
// await user0.where('id', '001').update({ profile_id: 'xx'})
// //User.where('id=1').getProfile();
// User.findInstance('name=user0').getProfile();
// User.findInstance('name=user0').addProfile({ email:'xxx', address:'yyy' }).save()
// User.findInstance('name=user0').update({ profile_id:'1' });
// User.wherexxxx.queryInstance().
// Model method?




