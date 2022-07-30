
export const sqlDataTypes = {
    int: 'number',
    int2: 'number',
    int4: 'number',
    int8: 'bigint',
    smallint: 'number',
    integer: 'number',
    bigint: 'bigint',
    decimal: 'number',
    numeric: 'number',
    real: 'number',
    float: 'number',
    float4: 'number',
    float8: 'bigint',
    money: 'number',
    varchar: 'string',
    char: 'string',
    text: 'string',
    bit: 'string',
    bitVar: 'string',
    time: 'string',
    timetz: 'string',
    timestamp: 'string',
    timestamptz: 'string',
    interval: 'string',
    boolean: 'boolean',
    enum: 'string',
    uuid: 'string',
    json: 'JSON',
    jsonb: 'JSON'
} 
// as const

// temp
export const FIELD_TYPE:{[typename:string]:string} = {
    number: 'INT',
    string: 'VARCHAR (50)',
    uuid: 'UUID'
  }

