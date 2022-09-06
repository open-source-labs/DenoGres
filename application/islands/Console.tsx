/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";
import Record from "../components/Record.tsx";
import queriesJson from "../data/queries.json" assert { type: "json" };
import { nanoid } from "nanoid";

export interface IRecord {};

export interface IQueryObject {
  _id: string,
  queryName: string,
  queryText: string
};

export default function Console() {
  //TODO: Currently state here is set as dummy data
  const [showModal, setShowModal] = useState<boolean>(false);
  const [queryName, setQueryName] = useState<string>("");
  const [queryText, setQueryText] = useState<string>("");
  const [modelText, setModelText] = useState<string>("");

  const [records, setRecords] = useState<IRecord[]>([]);
  const [queriesList, setQueriesList] = useState<IQueryObject[]>(queriesJson);

  // ----EVENT LISTENERS -----

  // TODO: some useEffect or similar to fetch prev. saved queriesList on first load
  // since this list might eventually live on a DB instead of locally

  // Saves query object in local JSON file and reset query name/text fields
  const handleSave = async (e: MouseEvent) => {
    //TODO: Put a save function here, fetch data from server
    e.preventDefault();
    const newQuery: IQueryObject = {
      _id: nanoid(),
      queryName,
      queryText
    }
    setQueriesList([...queriesList, newQuery]);
    await fetch('/api/handleQuerySave', {
      method: "POST",
      body: JSON.stringify(newQuery)
    })
    setQueryName('');
    setQueryText('');
  };

  // Runs query and updates state to render result
  const handleRun = async (e: MouseEvent) => {
    //TODO: Put a run function here, fetch data from server
    e.preventDefault();
    const res = await fetch('/api/handleQueryRun', {
      method: "POST",
      body: JSON.stringify(queryText)
    });
    // console.log(res.body);
    // Type of data seems to actually be the interface corresponding to which model
    // we are calling method on! maybe can obtain from user supplied model.ts?
    const data: object[] = await res.json();
    // console.log(queryName);
    // console.log(queryText);
    // console.log(data);
    // console.log(typeof data);
    setRecords(data);
  };

  // save user supplied model.ts locally for reference
  const handleModelSave = async (e: MouseEvent) => {
    e.preventDefault();
    await fetch('/api/handleModelSave', {
      method: "POST",
      body: JSON.stringify(modelText)
    });
    setModelText('');
    // after model.ts has been saved, server can return an array of strings 
    // representing names of models in the file
    // these can be displayed on the left hand side under "availale models"
    // stretch: clicking name of model pulls up its schema
  }

  // map saved queries to display components
  const savedQueries = queriesList.map((ele, idx) => {
    return (
      <button
        key={idx}
        className={tw`bg-deno-blue-100 text-sm shadow-sm p-3 my-1 font-medium tracking-wider text-gray-600 rounded text-left`}
        type="button"
        onClick={(e) => {
          setQueryName(ele.queryName);
          setQueryText(ele.queryText);
        }}
      >
        {ele.queryName}
      </button>
    );
  });

  // map data rows to row components in results
  const queryRows = records.map((ele) => {
    let results = [];

    for (const [key, value] of Object.entries(ele)) {
      const keyStr = key;
      const valStr = value;
      results.push(keyStr + " : " + valStr);
    }

    results = results.map((ele) => <li>{ele}</li>);

    return (
      <Record>
        <ul>{results}</ul>
      </Record>
    );
  });

  // Tailwind CSS styling - for textArea;
  const textArea =
    tw`bg-gray-50 appearance-none border-1 border-gray-200 rounded p-2 my-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-xs font-mono`;

  return (
    <div className={tw`w-full flex flex-row`}>
      <div className={tw`w-5/12 bg-white rounded mx-3`}>
        <div className={tw`h-2/4 p-3 flex flex-col items-center`}>
          <h2 className={tw`mb-3`}>Saved Queries</h2>
          <div className={tw`flex flex-col w-full`}>
            {savedQueries}
          </div>
        </div>
        <div className={tw`flex flex-col items-center p-3 h-2/4`}>
          <h2 className={tw`flex-1`}>Active Models</h2>
          <button
            type="button"
            className={tw`bg-gray-300 px-5 mx-1 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-600 rounded-full hover:shadow-2xl hover:bg-gray-400`}
            onClick={() => setShowModal(true)}
          >
            Import Model File
          </button>
          {/* <--------Import Model File MODAL--------> */}
          {showModal
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
                        <h2 className={tw`text-xl font-semibold`}>
                          Import Model File
                        </h2>
                        <button
                          className={tw`p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none`}
                          onClick={() => setShowModal(false)}
                        >
                        </button>
                      </div>
                      {/*body*/}
                      <div className={tw`relative px-6 flex-auto`}>
                        <textarea
                          className={textArea}
                          onInput={(e) => {
                            setModelText(e.currentTarget.value);
                          }}
                          value={modelText}
                          id="queryInput"
                          name="queryInput"
                          rows={20}
                          cols={70}
                        />
                      </div>
                      {/*footer*/}
                      <div
                        className={tw`flex items-center justify-end p-6 border-solid border-slate-200 rounded-b`}
                      >
                        <button
                          className={tw`bg-gray-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-300`}
                          type="button"
                          onClick={(e) => {
                            handleModelSave(e);
                            setShowModal(false);
                          }}
                        >
                          Save
                        </button>
                        <button
                          className={tw`bg-gray-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-300`}
                          type="button"
                          onClick={() => {
                            setShowModal(false);
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
      </div>
      <div className={tw`flex flex-col w-full`}>
        <div
          className={tw`flex flex-col h-2/4 bg-white p-3 mb-3 rounded`}
        >
          <h2>
            Query Console
          </h2>
          <div className={tw`my-1`}>
            <label className={tw`mr-1`}>
              Query Name:
            </label>
            <input
              className={textArea}
              onInput={(e) => {
                setQueryName(e.currentTarget.value);
              }}
              value={queryName}
            >
            </input>
          </div>
          <textarea
            className={textArea}
            onInput={(e) => {
              setQueryText(e.currentTarget.value);
            }}
            value={queryText}
            id="queryInput"
            name="queryInput"
            rows={8}
            cols={10}
          />
          <div className={tw`flex flex-row justify-end`}>
            <button
              type="button"
              className={tw`bg-deno-pink-100 px-5 mx-1 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-600 rounded-full hover:shadow-2xl hover:bg-deno-pink-200`}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className={tw`bg-deno-blue-100 px-5 mx-1 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-600 rounded-full hover:shadow-2xl hover:bg-deno-blue-200`}
              onClick={handleRun}
            >
              Run
            </button>
          </div>
        </div>
        <div
          className={tw`bg-white h-full rounded p-3 overflow-y-scroll flex flex-col`}
        >
          <h2 className={tw`mb-3`}>Results</h2>
          {queryRows}
        </div>
      </div>
    </div>
  );
}
