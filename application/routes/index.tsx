/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Layout from "../components/Layout.tsx";

export default function index() {
  return (
    <Layout>
      <div className={tw`w-full flex flex-row ml-3`}>
        <div className={tw`flex flex-col w-full`}>
          <div
            className={tw`flex flex-col h-full bg-white p-3 rounded`}
          >
            <div className={tw`overflow-y-scroll`}>
              <h2 className={tw`mb-5`}>Welcome to Denogres!</h2>
              <img src="/DenoGresWide.png"></img>
              <br></br>
              <p>
                Welcome to DenoGres! A new comprehensive ORM for PostgreSQL and
                Deno.
              </p>
              <p>
                <h2 className={tw`mt-10 mb-5`}>Getting Started</h2>
                <p>
                  To begin, let's download DenoGres! Execute the below in the
                  terminal - this will give you access to DenoGres's CLI
                  functionality.
                  <br></br>
                  >`deno install --allow-read --allow-write --allow-net
                  --allow-env --name denogres
                  https://deno.land/x/denogres/mod.ts`
                  <br></br>
                  After installation is complete, ensure deno is added to PATH.
                </p>
                <h2 className={tw`mt-10 mb-5`}>Using DenoGres</h2>
                <p>
                  Before using DenoGres in a project, run the below. In your
                  project's root directory, a .env file, for your database
                  connection URI, and a models folder, for your model.ts file,
                  will be created. >`denogres --init`
                  <br></br>
                  <br></br>
                  After running the init command, update the .env file to
                  contain your database's connection URI.
                  >`DATABASE_URI=driver://user:password@host:port/database_name`
                  <br></br>
                  <br></br>
                  With all the set-up steps complete, you're ready to introspect
                  your database! Database introspection will automatically
                  create TypeScript models of your database tables in the
                  .models/model.ts file. >`denogres --db-pull`
                </p>
                <h2 className={tw`mt-10 mb-5`}>Under Development</h2>
                <p>
                  DenoGres includes some functionality that is still in
                  development - including database sync functionality. The sync
                  functionality: * Identifies instances within the
                  models/model.ts file where user updates have caused the
                  database and TypeScript models to be out-of-sync * Creates and
                  executes queries to update the database so all points of
                  reference once again align >`denogres --db-sync`
                </p>
                <h2 className={tw`mt-10 mb-5`}>Documentation</h2>
                <p>
                  More information on how to use DenoGres and leverage all its
                  wonderful abstraction functionality can be found here:
                  https://denogres.deno.dev/
                </p>
                <h2 className={tw`mt-10 mb-5`}>Contributors</h2>
                <p>
                  Ben Engelberg | [GitHub](https://github.com/bengelberg) |
                  [LinkedIn](https://linkedin.com/in/benengelberg)
                  <br></br>
                  Moonhee Hur | [GitHub](https://github.com/mhurcs) |
                  [LinkedIn](https://linkedin.com/in/moonheehur)
                  <br></br>
                  Tesia Hwang | [GitHub](https://github.com/tesiahwang) |
                  [LinkedIn](https://linkedin.com/in/tesia-hwang)
                  <br></br>
                  Kristen Lu | [GitHub](https://github.com/kristenlu24) |
                  [LinkedIn](https://linkedin.com/in/kristen-lu)
                  <br></br>
                  Allisons Roderiques | [GitHub](https://github.com/allirod) |
                  [LinkedIn](https://linkedin.com/in/allison-roderiques)
                  <br></br>
                  <br></br>
                  ## License MIT
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
