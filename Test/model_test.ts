import { assertEquals } from '../deps.ts';
import { beforeAll, afterAll, afterEach } from '../deps.ts';
import { Model } from '../src/class/Model.ts';
import { Planet, Species } from './sample_model.ts';
// TODO write unit tests for each method (isolated from db and other methods)

// TODO: Unit testing for Insert
Deno.test('Insert Method', async (t) => {
  // does something need to go in here?
  // example has a client being created to pass to a connection
  await t.step('Returns the model', () => {
    const modelInstance: Model = Planet.insert();
    assertEquals(modelInstance, Planet);
  });
  await t.step('Parses a single argument into a SQL string', () => {
    Planet.insert('name = naboo');
    const expectedSql: string = `INSERT INTO planet (name) VALUES ('naboo')`;
    const sqlString: string = Planet['sql'];
    assertEquals(sqlString, expectedSql);
  });
});

// TODO write integration tests for each method (interaction with db and other methods--using postgresql instance in container)
// TODO establish CI/CD pipeline to run tests on pull request into dev/main branches
