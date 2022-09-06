
    import * as denogres from '../user/model.ts';

    const logResults = async (): Promise<void> => {
      const result = await denogres.Person.select('*').limit(5).query('postgres://fzggghbk:yuXc_N9fnsXb-g8HFEH_ujg5JB5O4urH@heffalump.db.elephantsql.com/fzggghbk');
      const stringified = JSON.stringify(
        result, 
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
      console.log(stringified);
    };
    logResults();
  