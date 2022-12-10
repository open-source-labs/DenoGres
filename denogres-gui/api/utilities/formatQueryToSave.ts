// format query string to escape quotes to store in external db
export default (queryText: string): string => {
  let result = '';
  for (let i = 0; i < queryText.length; i++) {
    if (queryText[i] === "'" || queryText[i] === '"') {
      result = result.concat("\\'");
    } else {
      result = result.concat(queryText[i]);
    }
  }
  return result;
};
