import * as model from '../models/model.ts'

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

model.Person.delete().where('name = Denogres').query();
// const people = await model.Person.select('*').query();



// console.log(people)



