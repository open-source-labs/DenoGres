# A Message for Future DenoGres Developers

## <u>Application Overview</u>

Welcome to Denogres-4.0! Denogres is split into two main parts--the first being
a PostgreSQL ORM for Deno and the second being a database visualization tool.
You are currently in the repository for the Denogres-4.0 ORM. Within this
repository is a sub-repository for the Denogres-3.0 GUI, which is not deployed.
[Here](https://github.com/DenoGres/Website) is the link for the repository for
Denogres's currently deployed GUI, along with the website holding documentation
for how to use the ORM.

We, the Denogres-4.0 team, focused our efforts on improving the ORM. We were
unable to deploy the Denogres-3.0 GUI (written with React) in part because of
compatibility issues between Deno, Vite, and Reactflow. Instead, we took the
route of adding features to the Denogres-2.0 GUI and site (written with Fresh)
taking Denogres 3.0's improvements as inspiration. Future iterators may decide
to continue this work or deploy Denogres 3.0, in which case you'll find a more
detailed readme in the denogres-gui directory in this respository.

## <u>Getting Started</u>

Most of the code for the ORM can be found in the root directory and src
directory. In the root directory, you'll find a `mod.ts` file that defines the
behavior of the Denogres CLI (including denogres --init, --db-pull, etc.), as
well as a `deps.ts` file where, following Deno best practices, we've imported
and exported all dependencies to for the rest of the application.

In the `src` directory, the `class` directory contains a crucial file,
`Model.ts`, which defines the Model class from which all users' models are
extended and therefore the main functionality of the ORM. `Association.ts`
defines classes that establish relationships between tables, instantiated by
methods on the Model class. For more detailed information on how all these
methods work, there is a `Model.md` file in that directory as well.

Within the `src` directory, the `functions` directory contains most of the
functionality for `mod.ts`. Including, most notibly, `Db.ts`, `introspect.ts`,
`dbPull.ts`, and `init.ts`. Comments were left inside of these files to help
future iterators quickly integtrate into the codebase.

Finally, the `Test` directory contains both new and existing unit and
integration tests for the ORM. Running `deno task test` in the terminal will run
all tests. Two of the most useful tests to run when adding features to the ORM
may be `model_test.ts`, which contains unit tests for all Model methods, and
`model_integration_test.ts` (in its own subdirectory).

In order to (locally) test any of the functionality related to database
connection (including model integration tests), you'll need to create a `.env`
file in the root directory with `ENVIRONMENT` (set to `test` for testing) and
`TEST_DB_URI` set to an empty database (running in ElephantSQL or locally). Note
that your test database will be torn down after running tests.

## <u>CI/CD</u>

In order to establish a CI/CD pipeline using Github Actions, there is a
`.github` directory with a `development.yaml` file, which defines steps to be
run automatically by Github anytime a PR is made into the `dev` or `main`
branches. These tests won't pass if `deno fmt` hasn't been run or if any of the
tests in `model_test.ts` or `model_integration_tests.ts` fail. Note that in
order to connect to a test database during CI/CD, a Docker service container is
set up hosting a PostgreSQL instance (no need to connect your own db for this
step).

## <u>Vendor & Import Map</u>

## <u>In-Progress</u>

While testing was a main goal for Denogres-4.0, there is still room for
improvement in fleshing out testing suites. In particular, outside of the unit
and integration tests for the Model itself (see above), most other tests rely on
functionality not being tested (for example, connecting to a database). These
tests could be better isolated or replaced for more confidence.

Other ORM features still in progress include:

- Adding a setter method to related models (see `Association.ts`)
- Adding functionality to the manyToMany function to add a join table to the
  user's database (see the end of `Model.ts`)

## <u>To-Do</u>

Here's a few ideas that could guide future iterators in development:

- Parameterizing queries made by model methods for increased security
- Finding a way to use Reactflow with Fresh, in order to create ERD diagrams for
  the user's database (this was done in Denogres-3.0 GUI at the expense of
  compatibility with Deno and Fresh)
- Theoretically, it would be interesting to incorparate compatibility with other
  popular database management systems such as MySQL, but based on the structure
  of the mdoel class (which uses [Deno Postgres](https://deno-postgres.com/#/)
  under the hood), this would be a large undertaking.

## <u>Deployment</u>

The Denogres-2.0 GUI and documentation website/landing page are already deployed
through Deno Deploy. Any changes made to the main branch of the DenoGres/Website
repo (linked above) are automatically deployed.
