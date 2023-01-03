// accepts a plural noun and returns that noun in the singular form
const singularize = (noun: string): string => {
    noun = noun.toLowerCase();

    const end = noun.length - 1;

    return noun === 'children' ? 'child' :
        noun === 'geese' ? 'goose' :
        noun === 'men' ? 'man' :
        noun === 'teeth' ? 'tooth' :
        noun === 'feet' ? 'foot' :
        noun === 'mice' ? 'mouse' :
        noun === 'people' ? 'person' :
        noun === 'fez' ? 'fezzes' :
        noun === 'oxen' ? 'ox' :
        noun === 'person' ? noun :
        noun.slice(-4) === 'ches' || noun.slice(-4) === 'shes' || 
            noun.slice(-3) === 'xes' || noun.slice(-3) === 'ses' || noun.slice(-3) === 'zes' ? 
            noun.slice(0, -2) :
        noun.slice(-3).match(/[aeiou]ys/) ? noun.slice(-1) :
        noun.slice(-2) === 'on' ? noun.slice(0, end - 1) + 'a' :
        noun[end] === 's' && noun !== 'species' && noun !== 'series' ? noun.slice(0, -1) :
        noun
}

// accepts the name of a db table (snake case and plural by convention)
// returns the appropriate class name for that table (singular, pascal case)
export const createClassName = (tableName: string): string => {
    const tableNameArr = tableName.split('_');

    const lastIndex = tableNameArr.length - 1;

    tableNameArr[lastIndex] = singularize(tableNameArr[lastIndex]);

    tableNameArr.forEach((el, idx) => {
      tableNameArr[idx] = el[0].toLocaleUpperCase() + el.slice(1);
    })

    return tableNameArr.join('');
}