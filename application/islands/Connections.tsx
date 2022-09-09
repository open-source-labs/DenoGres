/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";

import connectionsJson from "../data/connections.json" assert { type: "json" };
import { nanoid } from "nanoid";

export interface IConnectionObject {
  _id: string,
  name: string,
  address: string,
  port: string,
  username: string,
  defaultdb: string,
  password: string
};

// list of saved connections
export default function Connections() {
  const [connectList, setConnectList] = useState<any[]>(connectionsJson);
  const [connectionId, setConnectionId] = useState<number>(-Infinity);
  const [connectionName, setconnectionName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [defaultDB, setDefaultDB] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // <------------ EVENT LISTENERS ------------>

  const handleUriSaveAndRedirect = async (e: MouseEvent) => {
    e.preventDefault();
    const uriText: string = `postgres://${username}:${password}@${address}:${port}/${defaultDB}`;
    await fetch('/api/writeUriToFile', {
      method: "POST",
      body: JSON.stringify(uriText)
    });
    // response should be the models obj 

    const newConnectionObject: IConnectionObject = {
      _id: nanoid(),
      name: connectionName,
      address,
      port,
      username,
      defaultdb: defaultDB,
      password
    };
    setConnectList([...connectList, newConnectionObject]);
    await fetch('/api/handleConnectionSave', {
      method: "POST",
      body: JSON.stringify(newConnectionObject)
    });

    // can add logic to save connection to list on clicking "connect"
    // in future this will be a request to db to save connection assoc. w/ user

    // must be a better way to do this. maybe can get preact router working?
    // need to pass uri & models into explorer route
    window.location.href = 'http://localhost:8000/explorer';
  }

  // <------------ LIST OF CONNECTIONS ------------>
  function connectionsList() {
    const connections = connectList.map((ele, idx) => {
      return (
        <button
          key={idx}
          className={tw`bg-deno-blue-100 text-sm shadow-sm p-3 my-1 font-medium tracking-wider text-gray-600 rounded text-left`}
          type="button"
          onClick={() => {
            setConnectionId(ele._id);
            setconnectionName(ele.name);
            setAddress(ele.address);
            setPort(ele.port);
            setDefaultDB(ele.defaultdb);
            setUsername(ele.username);
            setPassword(ele.password);
          }}
        >
          {ele.name}
        </button>
      );
    });

    // ADD NEW CONNECTION
    const createConnection = async (): Promise<void> => {
      const emptyObj = {
        _id: connectionsJson.length + 1,
        name: "",
        address: "",
        port: "",
        username: "",
        defaultdb: "",
        password: "",
      };

      const emptyObjString = JSON.stringify(emptyObj);

      const response = await fetch("/api/getConnections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);
    };

    return (
      <div className={tw`flex flex-col`}>
        {connections}
        <div className={tw`flex flex-row justify-end`}>
          <button
            onClick={createConnection}
            type="button"
            className={tw`flex-0 bg-gray-300 py-1 px-2 text-sm shadow-sm font-medium text-gray-600 hover:shadow-2xl hover:bg-gray-400 rounded`}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  // <------------ CONNECTION FORM ------------>
  function connectionForm(): h.JSX.Element {
    const handleClick = (): void => {
    };

    const labelStyle: string = tw`py-1`;
    const inputStyle: string =
      tw`my-1 py-2 px-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12`;

    return (
      <form className={tw`flex flex-col my-5 py-5`}>
        <label className={labelStyle}>Connection Name:</label>
        <input
          className={inputStyle}
          value={connectionName}
        >
        </input>
        <label className={labelStyle}>HostName/Address :</label>
        <input className={inputStyle} value={address}></input>
        <label className={labelStyle}>Port Number:</label>
        <input className={inputStyle} value={port}></input>
        <label className={labelStyle}>Default DB:</label>
        <input className={inputStyle} value={defaultDB}></input>
        <label className={labelStyle}>UserName:</label>
        <input className={inputStyle} value={username}></input>
        <label className={labelStyle}>Password:</label>
        <input className={inputStyle} value={password} type="password"></input>
        <div className={tw`flex flex-row py-5`}>
          <button
            type="button"
            className={tw`bg-gray-300 px-5 mx-1 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-600 rounded-full hover:shadow-2xl hover:bg-gray-400`}
          >
            Test Connection
          </button>
          <button
            onClick={handleClick}
            type="button"
            className={tw`bg-deno-pink-100 px-5 mx-1 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-600 rounded-full hover:shadow-2xl hover:bg-deno-pink-200`}
          >
            Save
          </button>
          <button
            type="button"
            className={tw`bg-deno-blue-100 px-5 mx-1 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-600 rounded-full hover:shadow-2xl hover:bg-deno-blue-200`}
            onClick={handleUriSaveAndRedirect}
          >
            Connect
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={tw`w-full flex flex-row`}>
      <div className={tw`w-5/12 bg-white rounded mx-3 p-3 items-center`}>
        <h2 className={tw`mb-3 text-center`}>Connections List</h2>
        {connectionsList()}
      </div>
      <div className={tw`flex flex-col w-full`}>
        <div
          className={tw`flex flex-col h-full bg-white p-3 rounded`}
        >
          <div>
            <h2>Connection Details</h2>
            {connectionForm()}
          </div>
        </div>
      </div>
    </div>
  );
}
