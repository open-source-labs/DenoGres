export const tableListQuery = `
WITH RECURSIVE depTable AS (
  SELECT DISTINCT pg_constraint.conrelid, tc.relname tablename,
    pg_constraint.confrelid foreign_id, ftc.relname, 1 AS level
  
    FROM pg_constraint
    INNER JOIN pg_class tc ON pg_constraint.conrelid = tc.oid
    INNER JOIN pg_class ftc ON pg_constraint.confrelid = ftc.oid
    INNER JOIN pg_tables tables on tc.relname = tables.tablename AND tables.schemaname NOT IN 
    ('pg_catalog', 'information_schema')
  
    WHERE contype = 'f'
  
  UNION ALL
  
  SELECT DISTINCT pgc.conrelid, class1.relname, pgc.confrelid, classf.relname, depTable.level + 1
  FROM depTable
  INNER JOIN pg_class class1 ON depTable.foreign_id = class1.oid
  INNER JOIN pg_constraint pgc ON depTable.foreign_id = pgc.conrelid AND pgc.confrelid != 0
  INNER JOIN pg_class classf ON pgc.confrelid = classf.oid
  )
  
  SELECT relname AS table_name
  FROM (
  SELECT DISTINCT dT.relname, MAX(dT.level) max_level
  FROM depTable dT
  GROUP BY dT.relname
  
  UNION
  
  SELECT class.relname AS table_name, 0 max_level
    FROM pg_class class
    INNER JOIN pg_tables tables on class.relname = tables.tablename
    WHERE tables.schemaname NOT IN ('pg_catalog', 'information_schema')
    AND class.relname NOT IN (SELECT relname FROM depTable)
  
  ORDER BY max_level DESC
  ) AS TableList;
`

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
WITH enum_table as (
  select n.nspname as enum_schema,  
      t.typname as enum_name,
      string_agg(e.enumlabel, ', ') as enum_value
  from pg_type t 
      join pg_enum e on t.oid = e.enumtypid  
      join pg_catalog.pg_namespace n ON n.oid = t.typnamespace
  group by enum_schema, enum_name
  )
  
  SELECT tables.schemaname, 
  class.relname AS table_name,
  attname AS column_name,
  --pg_type.typname AS column_type, 
  CASE WHEN enum_name is not null THEN ('enum: '|| enum_name) ELSE pg_type.typname END
  AS column_type, 
  pg_get_expr(pg_attrdef.adbin, pg_attrdef.adrelid) col_default, --convert from nodeToString rep to SQL expr
  attr.attnotnull AS not_null,
  enum_value,
character_maximum_length                
  
  FROM pg_attribute attr 
  INNER JOIN pg_class class on attr.attrelid = class.oid
  INNER JOIN pg_tables tables on class.relname = tables.tablename
  INNER JOIN pg_type ON attr.atttypid = pg_type.oid
  LEFT JOIN pg_attrdef ON attr.attrelid = pg_attrdef.adrelid AND attr.attnum = pg_attrdef.adnum -- Column default vaules
  LEFT JOIN enum_table ON pg_type.typname = enum_name
  LEFT JOIN information_schema.columns ISC ON tables.schemaname = ISC.table_schema AND tables.tablename = ISC.table_name AND attr.attname = ISC.column_name 

  WHERE tables.schemaname NOT IN ('pg_catalog', 'information_schema')
  AND attr.attnum > -1
  
  ORDER BY table_name
`

export const primaryKeyQuery = `
SELECT tables.schemaname, class.relname AS table_name, 
  pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
  FROM pg_class class
  INNER JOIN pg_tables tables on class.relname = tables.tablename
  INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid
  WHERE contype = 'p'
  AND class.relname = 
`

export const tableUniqueQuery = `
SELECT tables.schemaname, class.relname AS table_name, 
  pg_get_constraintdef(pg_constraint.oid) AS condef, contype, conname
  FROM pg_class class
  INNER JOIN pg_tables tables on class.relname = tables.tablename
  INNER JOIN pg_constraint ON class.oid = pg_constraint.conrelid
  WHERE contype = 'u'
  AND pg_get_constraintdef(pg_constraint.oid) LIKE '%,%'
`
