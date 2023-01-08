class IncorrectData extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'IncorrectData';
  }
}

// Checks if the sql query has a length already. i.e. the user already started building the query string but never executed it.
export function checkUnsentQuery(
  length: number,
  method: string,
  model: string
): boolean {
  if (length > 0) {
    throw new IncorrectData(
      `Cannot ${method}. Query is already built. Please complete query with ${model}.query()`
    );
  }
  return true;
}

// checks that the user is accessing a column that already exists in the model
export function checkColumns(columns, input: string): boolean {
  const columnsArr: string[] = Object.keys(columns);
  if (!columnsArr.includes(input)) {
    throw new IncorrectData(`Column: ${input} does not exist on this model.`);
  }
  return true;
}
