![](/public/DenoGresWide.png)
Welcome to DenoGres! A new comprehensive ORM for PostgreSQL and Deno.

## Getting Started
To begin, let's download DenoGres! Execute the below in the terminal - this will give you access to DenoGres's CLI functionality.
>`deno install --allow-read --allow-write --allow-net --allow-env --name denogres https://deno.land/x/denogres/mod.ts`

After installation is complete, ensure deno is added to PATH.


## Using DenoGres
Before using DenoGres in a project, run the below.
In your project's root directory, a .env file, for your database connection URI, and a models folder, for your model.ts file, will be created.
>`denogres --init`

After running the init command, update the .env file to contain your database's connection URI.
>`DATABASE_URI=driver://user:password@host:port/database_name`

With all the set-up steps complete, you're ready to introspect your database! Database introspection will automatically create TypeScript models of your database tables in the .models/model.ts file.
>`denogres --db-pull`

### Under Development
DenoGres includes some functionality that is still in development - including database sync functionality. The sync functionality:
 * Identifies instances within the models/model.ts file where user updates have caused the database and TypeScript models to be out-of-sync
 * Creates and executes queries to update the database so all points of reference once again align
>`denogres --db-sync`

## Documents
More information on how to use DenoGres and leverage all its wonderful abstraction functionality can be found here: https://denogres.deno.dev/

## Contributors
- Ben Engelberg | [GitHub](https://github.com/bengelberg) | [LinkedIn](https://linkedin.com/in/benengelberg)
- Moonhee Hur | [GitHub](https://github.com/mhurcs) | [LinkedIn](https://linkedin.com/in/moonheehur)
- Tesia Hwang | [GitHub](https://github.com/tesiahwang) | [LinkedIn](https://linkedin.com/in/tesia-hwang)
- Kristen Lu | [GitHub](https://github.com/kristenlu24) | [LinkedIn](https://linkedin.com/in/kristen-lu)
- Allison Roderiques | [GitHub](https://github.com/allirod) | [LinkedIn](https://linkedin.com/in/allison-roderiques)

## License
MIT
