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
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<any[]>([]);

  // <------------ EVENT LISTENERS ------------>

  // on clicking connect, save connection details (currently to local file) 
  // and post to handleQueryRun in order to cache that uri string for further queries
  const handleUriSaveAndRedirect = async (e: MouseEvent) => {
    e.preventDefault();
    const uriText: string = `postgres://${username}:${password}@${address}:${port}/${defaultDB}`;
    const bodyObj = {
      uri: uriText
    };
    const response = await fetch('/api/handleQueryRun', {
      method: "POST",
      body: JSON.stringify(bodyObj)
    });
    if (response.status === 400) {
      const error = await response.json();
      console.log(error);
      await setErrorMessage(error);
      await displayErrorModal();
      return;
    }

    const newConnectionObject: IConnectionObject = {
      _id: nanoid(),
      name: connectionName,
      address,
      port,
      username,
      defaultdb: defaultDB,
      password
    };
    // TODO: reenable saving for deployment / once ext db has been set up
    // setConnectList([...connectList, newConnectionObject]);
    // await fetch('/api/handleConnectionSave', {
    //   method: "POST",
    //   body: JSON.stringify(newConnectionObject)
    // });

    // can add logic to save connection to list on clicking "connect"
    // in future this will be a request to db to save connection assoc. w/ user

    // must be a better way to do this. maybe can get preact router working?
    // need to pass uri & models into explorer route
    window.location.href = 'http://localhost:8000/explorer';
  };

  const displayErrorModal = async () => {
    await setShowErrorModal(true);
  };

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
        <input className={inputStyle} value={address} onInput={(e) => setAddress(e.currentTarget.value)}></input>
        <label className={labelStyle}>Port Number:</label>
        <input className={inputStyle} value={port} onInput={(e) => setPort(e.currentTarget.value)}></input>
        <label className={labelStyle}>Default DB:</label>
        <input className={inputStyle} value={defaultDB} onInput={(e) => setDefaultDB(e.currentTarget.value)}></input>
        <label className={labelStyle}>UserName:</label>
        <input className={inputStyle} value={username} onInput={(e) => setUsername(e.currentTarget.value)}></input>
        <label className={labelStyle}>Password:</label>
        <input className={inputStyle} value={password} type="password" onInput={(e) => setPassword(e.currentTarget.value)}></input>
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
      {showErrorModal
            ? (
              <div>
                <div
                  className={tw`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-non`}
                >
                  <div className={tw`relative w-auto my-6 mx-auto max-w-3xl`}>
                    {/*content*/}
                    <div
                      className={tw`border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none`}
                    >
                      {/*header*/}
                      <div
                        className={tw`flex items-start justify-between p-5 rounded-t`}
                      >
                      </div>
                      <p>{errorMessage[0].Error}</p>
                      <div
                        className={tw`flex items-center justify-end p-6 border-solid border-slate-200 rounded-b`}
                      >
                        <button
                          className={tw`bg-gray-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-300`}
                          type="button"
                          onClick={() => {
                            setShowErrorModal(false);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
            : null}
    </div>
  );
}
