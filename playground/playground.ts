import { Person } from '../models/model.ts';
try {
  await Person.insert('name = Elvin').transaction();

  await Person.insert('name1 = Beef').transaction();

  await Person.insert('name = Sakura').transaction();

  await Person.insert('name = Shoutout').transaction();

  await Person.endTransaction();
} catch (e) {
  console.error(e);
}
try {
  // await Person.delete().where('name = Sakura').transaction();
  // await Person.delete().where('name = Beef').transaction();

  // await Person.delete().where('name = Elvin').transaction();

  // await Person.delete().where('name = Shoutout').transaction();

  // await Person.endTransaction();
} catch (e) {
  console.error(e);
}
const elvin = await Person.select('name').where('name = Elvin').query();
const sakura = await Person.select('name').where('name = Sakura').query();
const Beef = await Person.select('name').where('name = Beef').query();

console.log(elvin, sakura, Beef);
