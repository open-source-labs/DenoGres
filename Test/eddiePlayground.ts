// import { Model } from 'https://deno.land/x/denogresdev@v1.0.4/src/class/Model.ts'
import { Model } from '../src/class/Model.ts';
import { introspect } from '../src/functions/introspect.ts';
import { createClassName } from '../src/functions/StringFormat.ts';
import { str } from '../src/functions/dbPull.ts';

// const modelStr: string | undefined = await dbPull('GUI');
// const processedStr = str
//   .replace(/export\sinterface/g, 'interface')
//   .replace(/export\sclass/g, 'class')
//   .replace(/export\senum/g, 'enum')
//   .concat('\nreturn { Person, Species, Mood };\n');
// console.log(processedStr);
// const getModel = new Function(processedStr);

// const FuncMaker = (function () {}).constructor;
// console.log(Function);
// const b = Function('return 1')
// console.log(b())
// const a = Function(`
// const mood = enum Mood {
//   sad,
//   ok,
//   happy,
//   };   
// return { mood };`);
// console.log(a());

// console.log(testFunc());

// const exportStuff = (): object => {
//   class Person extends Model {
//     static table = 'people';
//     static columns = {
//       _id: {
//         type: 'int4',
//         notNull: true,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       species_id: {
//         type: 'int8',
//         notNull: true,
//         association: {
//           table: 'species',
//           mappedCol: '_id',
//         }
//       },
//       name: {
//         type: 'varchar',
//         notNull: true,
//       },
//       current_mood: {
//         type: 'enum',
//         enumName: 'mood'
//       },
//     }
//   };
//   enum Mood {
//     sad,
//     ok,
//     happy,
//     };   
//   return { Person, Mood };
// }
// const stuff = exportStuff();
// console.log(stuff);

const [ tableListObj, enumObj ] = await introspect();
console.log(tableListObj);

const denogres: any = {};

for (const key in tableListObj) {
  const className = createClassName(key);
  denogres[className] = class extends Model{};
  denogres[className].table = key;
  denogres[className].columns = tableListObj[key].columns;
}



console.log(denogres);
// console.log(denogres.People.select);

// denogres.Species = class extends Model{};
// denogres.Species.table = 'species';
// denogres.Species.column = {} // for key in { } ; insert into column {} 
// console.log(denogres);
// console.log(Model);
// console.log(denogres.Person.select);
// console.log(denogres.Species);