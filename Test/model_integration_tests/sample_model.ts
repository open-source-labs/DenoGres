import { Model } from '../../src/class/Model.ts';

export interface User {
  id: string;
  firstname: string;
  lastname?: string;
  points?: number;
  team_id: number;
}

export class User extends Model {
  static table = 'users';
  static columns = {
    id: { type: 'uuid', primaryKey: true },
    firstName: { type: 'string', notNull: true },
    lastName: { type: 'string', notNull: false },
    points: { type: 'number', notNull: false },
    team_id: { type: 'number', noNull: true },
  };
}
export interface Team {
  id: number;
  teamname: string;
  teamrole?: string;
}
export class Team extends Model {
  static table = 'teams';
  static columns = {
    id: { type: 'number', primaryKey: true },
    teamname: { type: 'string', notNull: true },
    teamrole: { type: 'string', notNull: false },
  };
}
