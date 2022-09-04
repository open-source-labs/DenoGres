/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";
import connectionsJson from "../data/connections.json" assert { type: "json" };

// list of saved connections
export default function Connections() {
  const [connectList, setconnectList] = useState(connectionsJson);
  const [connectionName, setconnectionName] = useState("");
  const [address, setAddress] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [defaultDB, setDefaultDB] = useState("");
  const [password, setPassword] = useState("");

  // <------------ LIST OF CONNECTIONS ------------>
  function connectionsList() {
    const connections = connectList.map((ele, idx) => {
      return (
        <button
          key={idx}
          className={tw`bg-deno-blue-100 text-sm shadow-sm p-3 my-1 font-medium tracking-wider text-gray-600 rounded text-left`}
          type="button"
          onClick={() => {
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
    return (
      <div className={tw`flex flex-col`}>
        {connections}
      </div>
    );
  }

  // <------------ CONNECTION FORM ------------>
  function connectionForm() {
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
            type="button"
            className={tw`bg-deno-blue-100 px-5 mx-1 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-600 rounded-full hover:shadow-2xl hover:bg-deno-blue-200`}
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
