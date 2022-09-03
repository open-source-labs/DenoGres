
    import * as denogres from '../../models/model.ts';

    export default async (): Promise<unknown[]> => {
      const result = await denogres.Species.select('*').query('postgres://fzggghbk:yuXc_N9fnsXb-g8HFEH_ujg5JB5O4urH@heffalump.db.elephantsql.com/fzggghbk');
      return result;
    };
  