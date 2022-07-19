

type ModelSchema = typeof BaseModel;

class BaseModel {
  static modelName:string;
  static fields:object|any

  static defineModel(modelName:string, attirbutes?:object|any, option?:object) {
    const model = class extends BaseModel {
      static modelName = modelName;
      static fields = attirbutes;
    }

    // query builder for 'CREATE TABLE...'
    const query = createTableQuery(model.modelName, model.fields)
    console.log("table query: ", query)
    // execute query to the DB and then return?
    // or separate execution logic elsewehere? (e.g. sync()?)
    return model; // return the model at the end
  }

  /* ASSOCIATION METHODS */
  // A.belongTo(B)
  // B.hasOne(A)
  static belongsTo(sourceModel:ModelSchema, options?:object) {
    // create foreign key on this model
    const foreignKey_ColumnName = `${sourceModel.modelName.toLocaleLowerCase()}_id`
    this.fields[foreignKey_ColumnName] = { 
      type:'number',
      association: { rel_type:'belongsTo', model: sourceModel }
     }
    const query = '' // invoke querybuilder function to build tabling altering query
  }

  static hasOne<T extends BaseModel>(targetModel:T, option?:object) {
    // similar to 'belongsTo', but create foreign key field on the target model
  }
} //end of BaseModel class
 

// Creating Model
//syntax like... const User = BaseModel.defineModel('User', { })
const User1 = BaseModel.defineModel('Users', {
  id: { type:'number', primaryKey: true, autoIncrement:true },
  firstName: { type:'string', allowNull: false },
  lastName: { type:'string', allowNull: true }
  // parse this table create table query....
})


// creating SQL statements for 'CREATE TABLE...'
const dataTypeConversion:any = {
  number: 'INT',
  string: 'VARCHAR (50)'
}

const primaryKeyTypes:any = {
  number: 'serial',
  string: 'uuid DEFAULT uuid_generate_v4 ()'
}

function createTableQuery(modelName:string, attributes:any) {
  let primaryKeyStatement = ''
  let query = `CREATE TABLE ${modelName} (`
  const queryStrings = [];

  const fieldNameList = Object.keys(attributes);

  for(let fieldName of fieldNameList) {
    let subQuery = ''
    const fieldAtt = attributes[fieldName]
    subQuery += `${fieldName} `
    // first check to see if this a primary key
    if('primaryKey' in fieldAtt) {
      primaryKeyStatement = `PRIMARY KEY (${fieldName})` // attache this at the end
      if('type' in fieldAtt) {
        subQuery += `${primaryKeyTypes[fieldAtt.type]}`
      }
    } // end of prime key check
    else {
      if('type' in fieldAtt) subQuery += ` ${dataTypeConversion[fieldAtt.type]}`
      if(fieldAtt['allowNull'] === false) subQuery += ` NOT NULL`
    }
    queryStrings.push(subQuery)
  }// for loop
  for(let i=0; i<queryStrings.length; i++) {
    if(i !== queryStrings.length-1) queryStrings[i] += ','
    query += `\n${queryStrings[i]}`
  }
  query += `,\n${primaryKeyStatement}\n);`
  //console.log(query)
}