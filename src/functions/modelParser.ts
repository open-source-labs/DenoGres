import { resolve } from '../../deps.ts';

// reads the given model.ts file (at ./models/model.ts) and converts it into an object w/ info about db schema
// output ex:
// {
//   table_name1: {
//     column_name1: {
//       type: "varchar"
//     },
//     column_name2: {...}
//   },
//   table_name2: {
//     column_name1: {...},
//     column_name2: {...}
//   }
// };
export default async function modelParser(path = './models/model.ts') {
  path = resolve(path);

  // * format the document for consistent parsing functionality
  const process =  Deno.run({
    cmd: ['deno', 'fmt', path],
  })
  await process.status();
  Deno.close(process.rid);
  
  const data = Deno.readTextFileSync(path);
  return parse(data);
}

// helper function that parses data from path
export const parse = (data: string) => {
  const output: any = {};

  const whitespaces = /\s/g;

  data = data.replace(whitespaces, '');
  data = data.replace(/export/g, '\n');
  data = data.replaceAll('\'', '"');

  // * since each class in model.ts represents a table in PSQL, each element in the 'classes'(constant) represents a table in PSQL
  const classes: any = data.match(/class\w+extendsModel.*\s?/g);

  const lastClass = classes[classes.length - 1];

  // * edge case: needed to ensure that every element in 'classes' ends with a line break
  if (lastClass[lastClass.length - 1] !== '\n') {
    classes[classes.length - 1] += '\n';
  }

  // * loop thru each element in 'classes' (i.e. each table in PSQL)
  for (const currentClass of classes) {
    // * make data readable by JSON.parse
    const tableName = currentClass.replace(
      /.*statictable=\"(\w+)\".*\n/,
      '$1',
    );
    let tableColumns = currentClass
      .replace(/.*staticcolumns=(\{.*\}\,\}\;).*/, '$1')
      .replace(/\,\}/g, '}')
      .replace(/\,\]/g, ']');
    tableColumns = tableColumns
      .slice(0, tableColumns.length - 2)
      .replace(/([\w\_]+)\:/g, '"$1":');

    // * JSON parse informations about the columns
    tableColumns = JSON.parse(tableColumns);

    output[tableName] = tableColumns;
  }

  return output;
};
