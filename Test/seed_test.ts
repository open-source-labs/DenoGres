import {
  assertAlmostEquals,
  assertEquals,
  assertNotEquals,
  assertStrictEquals,
  assertThrows,
} from 'https://deno.land/std@0.150.0/testing/asserts.ts';
import { Model } from '../src/class/Model.ts';
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import * as denogres from '../models/model.ts';
import { Person } from '../models/model.ts';
import { sqlDataTypes } from '../src/constants/sqlDataTypes.ts';
import { resolve } from 'https://deno.land/std@0.141.0/path/mod.ts';

const sampleData: any[] = [
  {
    name: 'john',
    _id: 10,
    species_id: BigInt(2),
  },
  {
    name: 'david',
    _id: 12,
    species_id: BigInt(2),
  },
  {
    name: 'jessica',
    _id: 13,
    species_id: BigInt(2),
  },
];

const sampleTableName = 'people';

const sampleTextFile = `
const people = [
  {
    name: "Anthony",
    _id: 10,
    species_id: 2,
  },
  {
    name: "Carlos",
    _id: 12,
    species_id: 2,
  },
  {
    name: "Eddie",
    _id: 13,
    species_id: 2,
  },
  {
    name: "Henry",
    _id: 14,
    species_id: 2,
  },
];

const dog = [
  {
    name: "Nico",
    _id: 10,
    species_id: 5,
  },
  {
    name: "Momo",
    _id: 11,
    species_id: 5,
  },
  {
    name: "Kong",
    _id: 12,
    species_id: 5,
  },
  {
    name: "Seven",
    _id: 13,
    species_id: 5,
  },
  {
    name: "Eleven",
    _id: 14,
    species_id: 5,
  },
];

`;

// * Update
Deno.test(
  async function parseSeed2() {
    const expectedOutput = {
      people: [
        {
          name: 'Anthony',
          _id: 10,
          species_id: 2,
        },
        {
          name: 'Carlos',
          _id: 12,
          species_id: 2,
        },
        {
          name: 'Eddie',
          _id: 13,
          species_id: 2,
        },
        {
          name: 'Henry',
          _id: 14,
          species_id: 2,
        },
      ],
      dog: [
        {
          name: 'Nico',
          _id: 10,
          species_id: 5,
        },
        {
          name: 'Momo',
          _id: 11,
          species_id: 5,
        },
        {
          name: 'Kong',
          _id: 12,
          species_id: 5,
        },
        {
          name: 'Seven',
          _id: 13,
          species_id: 5,
        },
        {
          name: 'Eleven',
          _id: 14,
          species_id: 5,
        },
      ],
    };

    const output: any = {};

    let data = sampleTextFile;

    const whitespaces = /\s/g;

    data = data.replace(whitespaces, '');
    data = data.replace(/(const|let|var)/g, '\n');

    const tables: any = data.match(/\n.*/g)?.map((table) => table.slice(1, -1));

    for (const table of tables) {
      const tableName = table.replace(/(\w+).*/, '$1');
      let tableData = table.replace(/.*\=(\[.*\]\.*)/, '$1');

      tableData = tableData.replace(/\,\}/g, '}');
      tableData = tableData.replace(/\,\]/g, ']');
      tableData = tableData.replace(
        /([\w\_]+)\:/g,
        '"$1":',
      );

      tableData = JSON.parse(tableData);
      output[tableName] = tableData;
    }

    assertEquals(String(output), String(expectedOutput));
  },
);

Deno.test(function parseSeedSingle() {
  let data = Deno.readTextFileSync('./Test/seedDataTest.ts');

  // const tableName = data.replace(/\w+ (\w+)[\s\S]*/, "$1");

  // console.log(data.match(/(const|let|var)\s\w+:/g));

  const tableNames: any = data.match(/(const|let|var)\s\w+:/g);

  // console.log(tableNames);

  for (let i = 0; i < tableNames.length; i++) {
    tableNames[i] = tableNames[i].replace(/(const|let|var)\s(\w+)\:/g, '$2');
  }

  // console.log(tableNames);

  data = data.replace(/\s*/g, '');

  const tablesData: any = data.match(/\{.*\,\}/g);

  let tableData = tablesData[0];

  const regex = /[\{\,\}]/g;

  tableData = tableData.replace(regex, ' ').replace(/\s*(.*)\s*/, '$1');

  tableData = tableData.slice(0, tableData.length - 2).split(/\s{2,}/);

  for (let i = 0; i < tableData.length; i++) {
    tableData[i] = tableData[i].split(' ');
    for (let j = 0; j < tableData[i].length; j++) {
      tableData[i][j] = tableData[i][j].split(':');
    }
  }

  const tableEntries = [];
  let columnData: any;

  for (const entry of tableData) {
    columnData = {};
    for (const column of entry) {
      const [columnName, columnValue] = column;
      if (columnValue.includes('BigInt')) {
        columnData[columnName] = BigInt(
          columnValue.replace(/BigInt\((\d+)\).*/, '$1'),
        );
      } else columnData[columnName] = JSON.parse(columnValue);
    }
    tableEntries.push(columnData);
  }

  const output: any = {};

  for (const tableName of tableNames) {
    output[tableName] = tableEntries;
  }

  // console.log(output);

  // console.log(tableEntries);
  // console.log(sampleData);
  // console.log(String(tableEntries) == String(sampleData));

  // assertEquals(String(tableEntries), String(sampleData));
});

Deno.test(async function parseSeedMultiple() {
  let data: any = Deno.readTextFileSync('./Test/seedData2Test.ts');
  const output: any = {};
  const expectedOutput: any = {
    people: [
      {
        name: 'john',
        _id: 10,
        species_id: BigInt(2),
      },
      {
        name: 'david',
        _id: 12,
        species_id: BigInt(2),
      },
      {
        name: 'jessica',
        _id: 13,
        species_id: BigInt(2),
      },
    ],
    people2: [
      {
        name: 'john2',
        _id: 10,
        species_id: BigInt(2),
      },
      {
        name: 'david2',
        _id: 12,
        species_id: BigInt(2),
      },
      {
        name: 'jessica2',
        _id: 13,
        species_id: BigInt(2),
      },
    ],
  };

  const tableNames: any = data.match(/(const|let|var)\s\w+:/g);

  for (let i = 0; i < tableNames.length; i++) {
    tableNames[i] = tableNames[i].replace(/(const|let|var)\s(\w+)\:/g, '$2');
  }

  // console.log(tableNames);

  let tablesData = data.replace(/\s*/g, '');

  tablesData = tablesData.replace(/(const|let|var)/g, ' ').slice(1);

  tablesData = tablesData.split(' ');

  // console.log(data);

  for (let i = 0; i < tablesData.length; i++) {
    tablesData[i] = tablesData[i].match(/\{.*\,\}/)[0];

    let tableData = tablesData[i];

    const regex = /[\{\,\}]/g;

    tableData = tableData.replace(regex, ' ').replace(/\s*(.*)\s*/, '$1');

    tableData = tableData.slice(0, tableData.length - 2).split(/\s{2,}/);

    for (let i = 0; i < tableData.length; i++) {
      tableData[i] = tableData[i].split(' ');
      for (let j = 0; j < tableData[i].length; j++) {
        tableData[i][j] = tableData[i][j].split(':');
      }
    }

    const tableEntries = [];
    let columnData: any;

    for (const entry of tableData) {
      columnData = {};
      for (const column of entry) {
        const [columnName, columnValue] = column;
        if (columnValue.includes('BigInt')) {
          columnData[columnName] = BigInt(
            columnValue.replace(/BigInt\((\d+)\).*/, '$1'),
          );
        } else columnData[columnName] = JSON.parse(columnValue);
      }
      tableEntries.push(columnData);
    }

    for (const tableName of tableNames) {
      output[tableName] = tableEntries;
    }
  }

  // console.log("seed multiple output");
  // console.log(output);
  // console.log(expectedOutput);

  // assertEquals(String(output), String(expectedOutput));

  return output;
});

Deno.test(async function createTableQuery(
  // data: Array<Object> = sampleData,
  // tableName: string = sampleTableName,
): Promise<void> {
  const expectedCreateTableQuery = `
    CREATE TABLE IF NOT EXISTS people
    (
      _id int4 NOT NULL PRIMARY KEY DEFAULT nextval('people__id_seq'::regclass),
      name varchar NOT NULL,
      species_id int8 NOT NULL
    );
  `;

  let createTableQuery =
    `CREATE TABLE IF NOT EXISTS ${denogres.Person.table} (`;

  const people: any[] = [
    {
      name: 'john',
      _id: 10,
      species_id: BigInt(2),
    },
    {
      name: 'david',
      _id: 12,
      species_id: BigInt(2),
    },
    {
      name: 'jessica',
      _id: 13,
      species_id: BigInt(2),
    },
  ];

  let constraints = '';

  const columns: any = denogres.Person.columns;

  const associations = [];

  // type sqlDataTypes = { [key: string]: string };

  for (const column in columns) {
    // console.log(typeof columns[column].type);
    if (columns[column].autoIncrement) columns[column].type = 'SERIAL';

    createTableQuery += `${column} ${columns[column].type}`;
    for (const constraint in columns[column]) {
      switch (constraint) {
        case 'association': {
          associations.push({
            columnName: column,
            table: columns[column].association?.table,
            mappedCol: columns[column].association?.mappedCol,
          });
          break;
        }
        case 'primaryKey': {
          constraints += ' PRIMARY KEY';
          break;
        }
        case 'notNull': {
          constraints += ' NOT NULL';
          break;
        }
        case 'unique': {
          constraints += ' UNIQUE';
          break;
        }
        case 'defaultVal': {
          constraints += ` DEFAULT ${columns[column].defaultVal}`;
          break;
        }
        default: {
          break;
        }
      }
    }
    createTableQuery += `${constraints}, `;
    constraints = '';
  }

  createTableQuery = createTableQuery.slice(0, createTableQuery.length - 2) +
    ');';

  // console.log("EXPECTED QUERY");
  // console.log(expectedCreateTableQuery);

  // console.log("CREATE TABLE QUERY");
  // console.log(createTableQuery);

  // assertEquals(
  //   expectedCreateTableQuery.replace(/\s/gm, ""),
  //   createTableQuery.replace(/\s/gm, ""),
  // );

  // console.log(denogres.Person.columns);
});

Deno.test(
  async function insertQuery(
    data: any = sampleData,
    tableName: string = sampleTableName,
  ): Promise<void> {
    // const db = await ConnectDb(

    // );

    const expectedInsertQuery = `
    INSERT INTO ${sampleTableName} (name, _id, species_id) VALUES ('john', '10', '2'), ('david', '12', '2'), ('jessica', '13', '2');
  `;

    // interface Person2 {
    //   _id: number;
    //   name: string;
    //   species_id: bigint;
    //   current_mood: string;
    // }

    // const people: any[] = [
    //   {
    //     name: "john",
    //     _id: 10,
    //     species_id: BigInt(2),
    //   },
    //   {
    //     name: "david",
    //     _id: 12,
    //     species_id: BigInt(2),
    //   },
    //   {
    //     name: "jessica",
    //     _id: 13,
    //     species_id: BigInt(2),
    //   },
    // ];

    // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
    // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
    // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();
    // denogres.Person.insert(`'name = Deno', 'hair_color = purple'`).query();

    let columns = '';

    for (const column in sampleData[0]) {
      columns += `${column}, `;
    }

    columns = columns.slice(0, columns.length - 2);

    let insertQuery = `INSERT INTO ${sampleTableName} (${columns}) VALUES `;

    let value;
    let values = '';

    for (const datum of sampleData) {
      value = '(';
      for (const key in datum) {
        value += `'${datum[key]}', `;
      }
      value = value.slice(0, value.length - 2) + '), ';
      values += value;
    }

    // console.log(columns, values);

    values = values.slice(0, values.length - 2) + ';';

    // console.log(values);
    //
    insertQuery += values;

    // console.log("final insertQuery");

    // console.log(insertQuery);

    // console.log(insertQuery);

    // console.log("DQuery:", expectedInsertQuery.replace(/\s/gm, ""));

    // console.log("IQuery:", insertQuery.replace(/\s/gm, ""));

    // assertEquals(
    //   expectedInsertQuery.replace(/\s/gm, ""),
    //   insertQuery.replace(/\s/gm, ""),
    // );
    // DisconnectDb(db);
  },
);
