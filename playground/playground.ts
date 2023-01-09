// import { Person } from '../models/model';
// import {tran} frrom '../src/class/Model.ts'
import * as model from '../models/model.ts';

// const Denogres = new model.Person();

// Denogres.mass = 'test mass';
// Denogres.skin_color = 'blue';
// Denogres.birth_year = '1995';
// Denogres.height = 60;
// Denogres.eye_color = 'green';
// Denogres.homeworld_id = 6;
// Denogres.gender = 'male';
// Denogres._id = 100000;
// Denogres.name = 'Denogres';
// Denogres.species_id = 6 ;
// Denogres.hair_color = 'white';

// Denogres.save()

//do some other update, create, delete

// `BEGIN
// INSERT INTO a VALUES...
// DELETE blank WHERE blank
// `

//begin a trasaction
//await transaction

// Transaction();
// user
// await model.Person.insert().where().tran() // Begin transaction if one is not open, run this first queryobject(this.sql) and then clear the this.sql string rollback if fail
// model.species.insert().where().tran() // second invokation checks transaction id, if it matches first invocation then we run db.queryobject(this.sql) rollback if fail
// await model.Person.delete().where('name = Denogres').endTra(); //commit if everything passes and disconnect db
// const person = await new model.Person()
// person.insert('name = Alex').tran();
// person.insert('name = Jacob').tran();

// model.Turtle.insert('name = TESTINGGGG').query();

await model.Turtle.insert('name = rhino1').tran();
await model.Turtle.insert('name = rhino').tran();
await model.Turtle.insert('name = rhino').tran();

await model.Duck.insert('name = seahorse').tran();
await model.Duck.insert('name= cat').tran();
await model.Duck.edit('name = crab').where('name = seahorse').tran();
await model.Duck.delete().where('name = cat').tran();
await model.Duck.insert('name = octopus').endTran();

//  model.Turtle.insert('name = TURTLE').tran();
//  model.Turtle.insert('name = TOirTOise').tran();
//  model.Turtle.insert('name = Jacob the turtle').tran();

// const people = await model.Person.select('name').query();

// console.log(people)

//internal
/**
 * Model.ts private static transactionState = false;
 *
 *
 * 1. user does transaction();
 *  Model.flipTransaction();
 *  add conditional to query() to change behavior for transaction queries and regular autocommit queries
 *
 */
