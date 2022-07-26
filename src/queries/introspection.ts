export const tableListQuery = `
SELECT class.relname AS table_name
  FROM pg_class class
  INNER JOIN pg_tables tables on class.relname = tables.tablename
  WHERE tables.schemaname = 'public'`;

export const tableConstQuery = `
SELECT tables.schemaname, class.relname AS table_name, 
  pg_get_constraintdef(pg_constraint.oid) AS condef, contype
  FROM pg_class class
  INNER JOIN pg_tables tables on class.relname = tables.tablename
  INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid
  WHERE tables.schemaname NOT IN ('pg_catalog', 'information_schema')
;
`

export const columnInfoQuery = `
SELECT tables.schemaname, 
class.relname AS table_name,
attname AS column_name,
pg_type.typname AS column_type, 
pg_get_expr(pg_attrdef.adbin, pg_attrdef.adrelid) col_default, --convert from nodeToString rep to SQL expr
attr.attnotnull AS not_null               

FROM pg_attribute attr 
INNER JOIN pg_class class on attr.attrelid = class.oid
INNER JOIN pg_tables tables on class.relname = tables.tablename
INNER JOIN pg_type ON attr.atttypid = pg_type.oid
LEFT JOIN pg_attrdef ON attr.attrelid = pg_attrdef.adrelid AND attr.attnum = pg_attrdef.adnum -- Column default vaules


WHERE tables.schemaname NOT IN ('pg_catalog', 'information_schema')
AND attr.attnum > -1

ORDER BY table_name
`