import { resolve } from "https://deno.land/std@0.141.0/path/mod.ts";

export default async function modelParser2(path: string = "./models/model.ts") {
  path = resolve(path);

  await Deno.run({
    cmd: ["deno", "fmt", path],
  }).status();

  const output: any = {};

  const whitespaces = /\s/g;
  let data = Deno.readTextFileSync(path);

  data = data.replace(whitespaces, "");
  data = data.replace(/export/g, "\n");

  const classes: any = data.match(/class\w+extendsModel.*\s?/g);
  classes[classes.length - 1] += "\n";

  for (const currentClass of classes) {
    const tableName = currentClass.replace(
      /.*statictable=\"(\w+)\".*\n/,
      "$1",
    );
    let tableColumns = currentClass.replace(
      /.*staticcolumns=(\{.*\}\,\}\;).*/,
      "$1",
    ).replace(/\,\}/g, "}");
    tableColumns = tableColumns.slice(0, tableColumns.length - 2).replace(
      /([\w\_]+)\:/g,
      '"$1":',
    );

    tableColumns = JSON.parse(tableColumns);

    output[tableName] = tableColumns;
  }

  return output;
}
