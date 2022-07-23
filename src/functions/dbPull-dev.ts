import { tableListQuery, tableConstQuery, columnInfoQuery } from '../queries/introspection.ts'
import { sqlDataTypes } from '../constants/sqlDataTypes.ts';

import { createClassName } from '../functions/StringFormat.ts'
import { ConnectDb, DisconnectDb } from '../functions/Db.ts'

import { introspect } from './introspect.ts'


export async function dbPull() {
    const tableListObj = await introspect();

    console.log(tableListObj);

    let autoCreatedModels = `import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'\n// user model definition comes here `;

    
}
