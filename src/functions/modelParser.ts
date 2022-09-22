import { resolve } from "https://deno.land/std@0.141.0/path/mod.ts";

// * reads the given model.ts file (at ./models/model.ts) and converts it into an object that contains information about a given schema inside model.ts
export default async function modelParser(path: string = "./models/model.ts") {
  path = resolve(path);

  // * format the document for consistent parsing functionality
  await Deno.run({
    cmd: ["deno", "fmt", path],
  }).status();

  const output: any = {};

  const whitespaces = /\s/g;
  let data = Deno.readTextFileSync(path);

  data = data.replace(whitespaces, "");
  data = data.replace(/export/g, "\n");

  // * since each class in model.ts represents a table in PSQL, each element in the 'classes'(constant) represents a table in PSQL
  const classes: any = data.match(/class\w+extendsModel.*\s?/g);

  const lastClass = classes[classes.length - 1];

  // * edge case: needed to ensure that every element in 'classes' ends with a line break
  if (lastClass[lastClass.length - 1] !== "\n") {
    classes[classes.length - 1] += "\n";
  }

  // * loop thru each element in 'classes' (i.e. each table in PSQL)
  for (const currentClass of classes) {
    // * make data readable by JSON.parse
    const tableName = currentClass.replace(
      /.*statictable=\"(\w+)\".*\n/,
      "$1",
    );
    let tableColumns = currentClass
      .replace(/.*staticcolumns=(\{.*\}\,\}\;).*/, "$1")
      .replace(/\,\}/g, "}")
      .replace(/\,\]/g, "]");
    tableColumns = tableColumns
      .slice(0, tableColumns.length - 2)
      .replace(/([\w\_]+)\:/g, '"$1":');

    // * JSON parse informations about the columns
    tableColumns = JSON.parse(tableColumns);

    output[tableName] = tableColumns;
  }

  return output;
}
