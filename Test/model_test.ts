import {
  assert,
  assertEquals,
  assertMatch,
  assertThrows,
  beforeEach,
  describe,
  it,
} from '../deps.ts';
import { Planet } from './sample_model.ts';

describe('model methods', () => {
  beforeEach(() => {
    Planet['sql'] = '';
  });
  describe('insert method', () => {
    it('appends appropriate query string to model when given a single property to insert', () => {
      const actualQuery = Planet.insert('name = testPlanet')['sql'];
      const expectedQuery =
        /INSERT\sINTO\splanets\s\(\s*name\)\sVALUES\s\(\s*'testPlanet'\)/; //regex to account for possibility of spaces in front of columns and values
      assertMatch(actualQuery, expectedQuery);
    });
    it('appends appropriate query string to model when given several properties to insert', () => {
      const actualQuery = Planet.insert(
        'name = testPlanet',
        'climate = arid',
        'terrain = bumpy',
      )['sql'];
      const expectedQuery =
        /INSERT\sINTO\splanets\s\(\s*name\s*,\s*climate\s*,\s*terrain\)\sVALUES\s\(\s*'testPlanet'\s*,\s*'arid'\s*,\s*'bumpy'\)/;
      assertMatch(actualQuery, expectedQuery);
    });
    it('throws an error when invoked with incorrect column name', () => {
      assertThrows(() => Planet.insert('terrrrrain = rocky'), Error);
    });
    it('throws an error when invoked on a model with an already in-progress query', () => {
      Planet['sql'] = 'INSERT INTO planets ( VALUES (';
      assertThrows(() => Planet.insert('name = testPlanet'), Error);
    });
  });
  describe('edit method', () => {
    it('appends appropriate query string to model when invoked with one property', () => {
      const actualQuery = Planet.edit('name = testPlanet')['sql'];
      const expectedQuery = 'UPDATE planets SET name = \'testPlanet\'';
      assertEquals(actualQuery, expectedQuery);
    });
    it('appends appropriate query string to model when invoked with several properties', () => {
      const actualQuery = Planet.edit(
        'name = testPlanet',
        'climate = arid',
        'terrain = bumpy',
      )['sql'];
      const expectedQuery =
        'UPDATE planets SET name = \'testPlanet\' , climate = \'arid\' , terrain = \'bumpy\'';
      assertEquals(actualQuery, expectedQuery);
    });
    it('throws an error when invoked with an incorrect column name', () => {
      assertThrows(() => Planet.edit('terrrrrain = rocky'), Error);
    });
    it('throws an error when invoked on a model with an already in-progress query', () => {
      Planet['sql'] = 'UPDATE planets SET ';
      assertThrows(() => Planet.edit('name = testPlanet'), Error);
    });
  });

  describe('delete method', () => {
    it('appends appropriate query string to model when invoked without arguments', () => {
      const actualQuery = Planet.delete()['sql'];
      const expectedQuery = 'DELETE FROM planets';
      assertEquals(actualQuery, expectedQuery);
    });

    it('throws an error if invoked on a model with an already in-progress sql query', () => {
      Planet['sql'] = 'SELECT climate FROM planets';
      assertThrows(() => Planet.delete(), Error);
    });
  });

  describe('select method', () => {
    it('appends appropriate query string to model when invoked with an asterisk', () => {
      const actualQuery = Planet.select('*')['sql'];
      const expectedQuery = 'SELECT * FROM planets';
      assertEquals(actualQuery, expectedQuery);
    });

    it('appends appropriate query string to model when invoked with one valid column name', () => {
      const actualQuery = Planet.select('climate')['sql'];
      const expectedQuery = 'SELECT climate FROM planets';
      assertEquals(actualQuery, expectedQuery);
    });

    it('appends appropriate query string to model when invoked with multiple valid column names', () => {
      const actualQuery = Planet.select('climate', 'terrain')['sql'];
      const expectedQuery = /SELECT\s+climate,\s*terrain\s+FROM\s+planets/i; // ignore missing or extra spaces where inconsequential
      assertMatch(actualQuery, expectedQuery);
    });

    it('defaults to "SELECT *" when invoked without any arguments', () => {
      const actualQuery = Planet.select()['sql'];
      const expectedQuery = 'SELECT * FROM planets';
      assertEquals(actualQuery, expectedQuery);
    });

    it('throws an error if invoked with any invalid column names', () => {
      assertThrows(() => Planet.select('diaaameter'), Error);
    });

    it('throws an error if invoked on a model with an already in-progress sql query', () => {
      Planet['sql'] = 'SELECT climate FROM planets';
      assertThrows(() => Planet.select('terrain'), Error);
    });
  });

  describe('where method', () => {
    it('appends query beginning with "SELECT *" when not chained onto another method', () => {
      const actualQuery = Planet.where('climate = temperate')['sql'];
      assert(actualQuery.startsWith('SELECT * FROM planets'));
    });

    it('adds a space before the word "WHERE" when chained onto another method', () => {
      Planet['sql'] = 'SELECT * FROM planets';
      const actualQuery = Planet.where('climate = temperate')['sql'];
      assert(actualQuery.startsWith(`SELECT * FROM planets WHERE`));
    });

    it('adds appropriate query string to model when invoked with equality and comparison conditions', () => {
      const equalityQuery = Planet.where('climate = temperate')['sql'];
      assert(equalityQuery.includes(`climate = 'temperate'`));
      Planet['sql'] = '';

      const numComparisonQuery = Planet.where('rotation_period > 12')['sql'];
      assert(numComparisonQuery.includes(`rotation_period > '12'`));
      Planet['sql'] = '';

      const charComparisonQuery = Planet.where('name < Hoth')['sql'];
      assert(charComparisonQuery.includes(`name < 'Hoth'`));
      Planet['sql'] = '';

      const comparisonOrEqualityQuery = Planet.where('rotation_period >= 12')[
        'sql'
      ];
      assert(comparisonOrEqualityQuery.includes(`rotation_period >= '12'`));
    });

    it('adds appropriate query string to model when invoked with the LIKE operator', () => {
      const actualQuery = Planet.where('name LIKE A%')['sql'];
      assert(actualQuery.includes(`name LIKE 'A%'`));
    });

    it('adds appropriate query string to model when invoked with more than one condition', () => {
      const actualQuery = Planet.where(
        'climate = temperate',
        'rotation_period > 12',
      )['sql'];
      const expectedQuery = `climate = 'temperate' rotation_period > '12'`;
      assert(actualQuery.includes(expectedQuery));
    });

    it('throws an error when invoked with column names not on the model', () => {
      assertThrows(() => Planet.where('rotationPeriod = 24'), Error);
    });

    /**
     * no tests for the following problems (for which Postgres will throw its own errors):
     * - user invokes 'where' method without any arguments
     * - user invokes with malformatted arguments or unsupported syntax
     * - user invokes with values of the wrong type for their columns
     * - user chains with incompatible methods
     */
  });

  describe('limit method', () => {
    it('adds appropriate query string to model when invoked with a number', () => {
      Planet['sql'] = 'SELECT * FROM planets';
      const actualQuery = Planet.limit(20)['sql'];
      assert(actualQuery.includes(' LIMIT 20'));
    });

    /**
     * no tests for the following problems (for which Postgres will throw its own errors):
     * - user invokes 'limit' method without an argument
     * - user invokes with the wrong type of argument (i.e. not a number)
     * - user chains with incompatible methods (i.e. not after 'select')
     */
  });

  describe('having method', () => {
    it('adds appropriate query string to model when invoked with a single condition', () => {
      Planet['sql'] =
        'SELECT COUNT(_id), gravity FROM planets GROUP BY gravity';
      const actualQuery = Planet.having('COUNT(_id) > 1')['sql'];
      assert(actualQuery.includes(' HAVING COUNT(_id) > 1'));
    });

    it('adds appropriate query string to model when invoked with more than one condition', () => {
      Planet['sql'] =
        'SELECT COUNT(_id), gravity FROM planets GROUP BY gravity';
      const actualQuery = Planet.having(
        'COUNT(_id) > 1',
        'AND gravity IS NOT NULL',
      )['sql'];
      assert(
        actualQuery.includes(' HAVING COUNT(_id) > 1 AND gravity IS NOT NULL'),
      );
    });

    /**
     * no tests for the following problems (for which Postgres will throw its own errors):
     * - user invokes 'having' method without an argument
     * - user invokes with a malformatted condition or nonexist column name
     * - user chains with incompatible methods (i.e. not after 'select' and 'group')
     */
  });
  describe('joins methods', () => {
    it('adds appropriate query string to model when invoked for innerJoin', () => {
      Planet['sql'] = 'SELECT planets._id, people.homeworld_id FROM planets';
      const actualQuery = Planet.innerJoin('_id', 'homeworld_id', 'people')[
        'sql'
      ];
      assert(
        Planet['sql'].includes(
          'INNER JOIN people ON planets._id = people.homeworld_id',
        ),
      );
    });
    it('adds appropriate query string to model when invoked for leftJoin', () => {
      Planet['sql'] = 'SELECT planets._id, people.homeworld_id FROM planets';
      const actualQuery = Planet.leftJoin('_id', 'homeworld_id', 'people')[
        'sql'
      ];
      assert(
        Planet['sql'].includes(
          'LEFT JOIN people ON planets._id = people.homeworld_id',
        ),
      );
    });

    it('adds appropriate query string to model when invoked with rightJoin', () => {
      Planet['sql'] = 'SELECT planets._id, people.homeworld_id FROM planets';
      const actualQuery = Planet.rightJoin('_id', 'homeworld_id', 'people')[
        'sql'
      ];
      assert(
        Planet['sql'].includes(
          'RIGHT JOIN people ON planets._id = people.homeworld_id',
        ),
      );
    });

    it('adds appropriate query string to model when invoked with fullJoin', () => {
      Planet['sql'] = 'SELECT planets._id, people.homeworld_id FROM planets';
      const actualQuery = Planet.fullJoin('_id', 'homeworld_id', 'people')[
        'sql'
      ];
      assert(
        Planet['sql'].includes(
          'FULL JOIN people ON planets._id = people.homeworld_id',
        ),
      );
    });
    /**
     * no tests for the following problems (for which Postgres will throw its own errors):
     * - user invokes 'join' method without an argument
     * - user invokes with column or table names not in the database
     * - user chains with incompatible methods (i.e. not after 'select' method)
     */
  });

  describe('order method', () => {
    it('adds appropriate query string to model when order is invoked with ASC', () => {
      Planet['sql'] = 'SELECT * FROM planets';
      const actualQuery =
        Planet.order('ASC', 'diameter', 'rotation_period')['sql'];
      assert(Planet['sql'].includes('ORDER BY diameter,rotation_period ASC'));
    });

    it('adds appropriate query string to model when order is invoked with DESC', () => {
      Planet['sql'] = 'SELECT * FROM planets';
      const actualQuery =
        Planet.order('DESC', 'diameter', 'rotation_period')['sql'];
      assert(Planet['sql'].includes('ORDER BY diameter,rotation_period DESC'));
    });

    it('throws an error when invoked without either ASC or DESC', () => {
      assertThrows(
        () => Planet.order('ascending', 'diameter', 'rotation_period'),
        Error,
      );
    });

    it('throws an error when invoked without any arguments', () => {
      assertThrows(() => Planet.order(), Error);
    });

    it('throws an error when invoked with column name that is not in the database', () => {
      assertThrows(() => Planet.order('ASC', 'gravitational_pull'), Error);
    });

    /**
     * no tests for the following problems (for which Postgres will throw its own errors):
     * - user invokes on table name not in the database
     * - user chains with incompatible methods (i.e. not after 'select' method)
     */
  });

  describe('aggregate functions', () => {
    describe('count method', () => {
      it('adds the appropriate query string to model when count is invoked', () => {
        const actualQuery = Planet.count('climate');
        assert(Planet['sql'].includes('SELECT COUNT(climate) FROM planets'));
      });

      it('throws an error when count is invoked without an argument', () => {
        assertThrows(() => Planet.count(), Error);
      });

      it('throws an error when count is invoked with a column name that is not in the database', () => {
        assertThrows(() => Planet.count('gravitational_pull'), Error);
      });
    });

    describe('sum method', () => {
      it('adds the appropriate query string to model when sum is invoked', () => {
        const actualQuery = Planet.sum('climate');
        assert(Planet['sql'].includes('SELECT SUM(climate) FROM planets'));
      });

      it('throws an error when sum is invoked without an argument', () => {
        assertThrows(() => Planet.sum(), Error);
      });

      it('throws an error when sum is invoked with a column name that is not in the database', () => {
        assertThrows(() => Planet.sum('gravitational_pull'), Error);
      });
    });
    describe('avg method', () => {
      it('adds the appropriate query string to model when avg is invoked', () => {
        const actualQuery = Planet.avg('climate');
        assert(Planet['sql'].includes('SELECT AVG(climate) FROM planets'));
      });

      it('throws an error when avg is invoked without an argument', () => {
        assertThrows(() => Planet.avg(), Error);
      });

      it('throws an error when avg is invoked with a column name that is not in the database', () => {
        assertThrows(() => Planet.avg('gravitational_pull'), Error);
      });
    });
    describe('min method', () => {
      it('adds the appropriate query string to model when min is invoked', () => {
        const actualQuery = Planet.min('climate');
        assert(Planet['sql'].includes('SELECT MIN(climate) FROM planets'));
      });

      it('throws an error when min is invoked without an argument', () => {
        assertThrows(() => Planet.min(), Error);
      });

      it('throws an error when min is invoked with a column name that is not in the database', () => {
        assertThrows(() => Planet.min('gravitational_pull'), Error);
      });
    });
    describe('max method', () => {
      it('adds the appropriate query string to model when max is invoked', () => {
        const actualQuery = Planet.max('climate');
        assert(Planet['sql'].includes('SELECT MAX(climate) FROM planets'));
      });

      it('throws an error when max is invoked without an argument', () => {
        assertThrows(() => Planet.max(), Error);
      });

      it('throws an error when max is invoked with a column name that is not in the database', () => {
        assertThrows(() => Planet.max('gravitational_pull'), Error);
      });
    });
    /**
     * no tests for the following problems (for which Postgres will throw its own errors):
     * - user invokes on table name not in the database
     * - user chains with incompatible methods
     */
  });
});
