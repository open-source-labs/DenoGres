export const sqlDataTypes = {
    int2: 'number',
    int4: 'number',
    int8: 'bigint',
    numeric: 'number',
    float4: 'number',
    float8: 'bigint',

    varchar: 'string'
}

// temp
export const FIELD_TYPE:{[typename:string]:string} = {
    number: 'INT',
    string: 'VARCHAR (50)',
    uuid: 'UUID'
  }