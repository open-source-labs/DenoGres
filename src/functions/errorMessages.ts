export function checkUnsentQuery(
  length: number,
  method: string,
  model: string
): void {
  if (length > 0) {
    console.error(
      `Cannot ${method}. Query is already built. Please complete query with ${model}.query()`
    );
  }
}
