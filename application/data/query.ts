
    import * as denogres from '../../models/model.ts';

    const logResults = async (): void => {
      const result = await denogres.Person.select('*').query('postgres://fzggghbk:yuXc_N9fnsXb-g8HFEH_ujg5JB5O4urH@heffalump.db.elephantsql.com/fzggghbk');
      const stringified = JSON.stringify(
        result, 
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
      console.log(stringified);
    };
    logResults();
  