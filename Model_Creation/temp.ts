import { Model } from '../src/class/Model.ts'
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
    //profile_id: { type:'number'}
  }
  //static foreignKey = []
}
interface Team {
  id:number;
  teamName:string;
  teamRole?:string;
}
class Team extends Model {
  static table = 'teams';
  static columns = {
    id: { type:'number', primaryKey: true, autoIncrement:true },
    teamName: { type:'string', notNull: true },
    teamRole: { type:'string', notNull: false },
    //user_id: {type:'number'}
  };
  //static foreignKey = []
}
const userTeamAssociation = await User.belongsTo(Team)
userTeamAssociation.syncAssociation()
await Team.hasMany(User)

/* // BelongsTo
await User.belongsTo(Team)
associationQuery: 
      ALTER TABLE users ADD team_id INT;
      ALTER TABLE users ADD CONSTRAINT fk_team_id FOREIGN KEY (team_id) REFERENCES teams ON DELETE SET NULL ON UPDATE CASCADE
      ;
 
 */