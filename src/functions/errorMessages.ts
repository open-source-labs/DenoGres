import { Model } from '../class/Model.ts';

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
  model: typeof Model,
  startOrChain: 'start' | 'chain',
): boolean {
  if (startOrChain === 'start' && length > 0) {
    if (model['transactionInProgress']) {
      model[
        'transactionErrorMsg'
      ] =
        `Cannot ${method}. Query is already built. Please complete query with ${model.name}.query()`;
    } else {
      throw new Error(
        `Cannot ${method}. Query is already built. Please complete query with ${model.name}.query()`,
      );
    }
  } else if (startOrChain === 'chain' && !length) {
    if (model['transactionInProgress']) {
      model[
        'transactionErrorMsg'
      ] = `${method} must be chained with other methods.`;
    } else {
      throw new Error(`${method} must be chained with other methods.`);
    }
  }
  return true;
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
  model: typeof Model,
): boolean {
  const columnsArr: string[] = Object.keys(columns);

  // checks for if input is an array of columns
  if (Array.isArray(input)) {
    input.forEach((c) => {
      // break up model.column refences
      if (c.includes('.')) c = c.split('.')[1];
      checkColumnsHelper(columnsArr, c, model);
    });
  } else {
    checkColumnsHelper(columnsArr, input, model);
  }
  return true;
}

function checkColumnsHelper(
  modelColumns: string[],
  column: string,
  // need to fix any Type
  model: typeof Model,
): void {
  const errorMessage = (data: string) => {
    return `Column: ${data} does not exist on this model.`;
  };
  // throws an error on an incorrect column if a transaction is NOT in progress
  if (!modelColumns.includes(column)) {
    if (!model['transactionInProgress']) {
      throw new IncorrectData(errorMessage(column));
    } else {
      model['transactionErrorMsg'] = errorMessage(column);
    }
  }
  return;
}
