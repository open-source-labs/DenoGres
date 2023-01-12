class IncorrectData extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'IncorrectData';
  }
}

// Checks if the sql query has a length already. i.e. the user already started building the query string but never executed it.
export function checkQueryString(
  length: number,
  method: string,
  model: string,
  startOrChain: 'start' | 'chain'
): boolean {
  if (startOrChain === 'start' && length > 0) {
    throw new Error(
      `Cannot ${method}. Query is already built. Please complete query with ${model}.query()`
    );
  } else if (startOrChain === 'chain' && !length) {
    throw new Error(`${method} must be chained with other methods.`);
  } else {
    return true;
  }
}

interface Columns {
  [key: string]: {
    type: string;
    primaryKey?: boolean;
    notNull?: boolean;
    unique?: boolean;
    checks?: any;
    defaultVal?: string | number | boolean | Date;
    autoIncrement?: boolean;
    association?: {
      rel_type?: string;
      name: string;
      mappedTable: string;
      mappedColumn: string;
    };
    length?: number;
    enumName?: string;
  };
}
// checks that the user is accessing a column that already exists in the model
export function checkColumns(
  columns: Columns,
  input: string | string[],
  model: any
): boolean {
  const columnsArr: string[] = Object.keys(columns);
  // checks for if input is an array of columns
  if (Array.isArray(input)) {
    input.forEach((c) => {
      if (!columnsArr.includes(c) && !c.includes('.')) {
        throw new IncorrectData(`Column: ${c} does not exist on this model.`);
      }
    });
  } else {
    // checks value of a single column
    if (!columnsArr.includes(input) && !input.includes('.')) {
      throw new IncorrectData(`Column: ${input} does not exist on this model.`);
    }
  }
  return true;
}
