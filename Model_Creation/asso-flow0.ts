import { Model } from '../src/class/Model.ts'
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';

// ===== STARWARS sample classes, 
// testing Person.belongsTo(Species)



interface Species {
  _id: number
  name: string
}

class Species extends Model {
  static table = 'species';
  static columns = {
    _id: {
      type:'number',
      primaryKey: true, //added
      notNull: true,
      defaultVal: 'species__id_seq',
      autoIncrement: true,
    },
    name: {
      type: 'varchar',
      notNull: true,
  }
}
}

interface Person {
  _id: number
  species_id: bigint
}

class Person extends Model {
  static table = 'people';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      defaultVal: 'people__id_seq',
      autoIncrement: true,
    },
    
    species_id: {
      type: 'int8',
    },  
  }
}



// const db = await ConnectDb();
// let result:any;
// try {
//   result = await db.queryObject('select * from people where name = \'Luke Skywalker\'')
// } catch (error) {
//   console.error(error)
// } finally {
//   DisconnectDb(db);
// }
//const luke = result.rows[0]


const test = await Person.where('name = Luke Skywalker').query()
console.log("luke: ",test)
const luke = new Person();
luke._id = 1;
luke.species_id = 1n;
const a = Person.belongsTo(Species, { foreignKey_ColumnName: 'species_id'})
// console.log(Person)

// luke.getSpecies();


