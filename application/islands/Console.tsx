/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";
import Record from "../components/Record.tsx";
import recordJson from "../data/records.json" assert { type: "json" };
import queriesJson from "../data/queries.json" assert { type: "json" };

export default function Console() {
  //TODO: Currently state here is set as dummy data
  const [showModal, setShowModal] = useState(false);
  const [queryName, setQueryName] = useState("");
  const [queryText, setQueryText] = useState("");
  const [modelText, setModelText] = useState("");

  const [records, setRecords] = useState(recordJson);
  const [queriesList, setQueriesList] = useState(queriesJson);

  // ----EVENT LISTENERS -----

  const handleSave = () => {
    //TODO: Put a save function here, fetch data from server
  };

  const handleRun = async () => {
    //TODO: Put a run function here, fetch data from server
  };

  // map saved queries to display components
  const savedQueries = queriesList.map((ele, idx) => {
    return (
      <button
        key={idx}
        className={tw`bg-deno-blue-100 text-sm shadow-sm p-3 my-1 font-medium tracking-wider text-gray-600 rounded`}
        type="button"
        onClick={(e) => {
          setQueryName(ele.name);
          setQueryText(ele.queryText);
        }}
      >
        {ele.name}
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
          {savedQueries}
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
          <div>
            Query Console
          </div>
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
          <h2>Results</h2>
          {queryRows}
        </div>
      </div>
    </div>
  );
}
