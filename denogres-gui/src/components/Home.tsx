import Layout from './Layout.tsx';
import NavBarGUI from './NavBarGUI.tsx';
import { HandlerContext } from '$fresh/server.ts';
import jwtAuth from '../../utils/jwtAuth.ts';
import React from 'react';
import denogresLogo from '../assets/denogres-logo.png';

export default function home() {
  return (
    <div>
      {/* <NavBarGUI active="/gui/home" /> */}
      <div className="w-full flex flex-row ml-3">
        <div className="flex flex-col w-full">
          <div className="flex flex-col h-full bg-white p-3 rounded">
            <div className="home-overflow">
              <div className="bg-gray-900 w-96 h-96 p-5">
                <img
                  className="denogresLogo"
                  src={denogresLogo}
                ></img>
              </div>
              <br></br>
              <h2 id="headerHome">
                <strong>
                  Welcome to the Denogres App, a GUI for the new, comprehensive
                  ORM for PostgreSQL in Deno runtime.
                </strong>
              </h2>
              <p>
                <h2 className="mt-10 mb-5">Navigation Guide</h2>
                <h2 className="mt-5 mb-5">Home</h2>
                <p>You are here!</p>
                <h2 className="mt-5 mb-5">Connections Manager</h2>
                <p>
                  Here you can manage the database connections associated with
                  your account, with the ability to create, update, and delete
                  entries. When you have selected the desired database instance,
                  click “Connect” to establish a connection.
                </p>
                <h2 className="mt-5 mb-5">Query Explorer</h2>
                <p>
                  Here you can manage the queries associated with the active
                  connection. Click on the active models to view the PostgreSQL
                  database table information, and use the query console to save,
                  update, delete, and run queries. The results of query
                  operations will be listed below the query console.
                </p>
                <h2 className="mt-5 mb-5">Migration Logs</h2>
                <p>
                  <em>Coming soon...</em>
                </p>
                <h2 className="mt-5 mb-5">Log Out</h2>
                <p>Log out of your current session.</p>
                <h2 className="mt-10 mb-5">Documentation</h2>
                <p>
                  More information on DenoGres and the DenoGres GUI can be found
                  on the documentation website at: https://denogres.deno.dev/
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
