
    import * as denogres from '../user/model.ts';

    const logResults = async (): Promise<void> => {
      const result = await denogres.Person.select('*').query();
      const stringified = JSON.stringify(
        result, 
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
      console.log(stringified);
    };
    logResults();
  