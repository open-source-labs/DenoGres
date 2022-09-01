/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";

export default function Console() {
  const [data, setData] = useState([]);

  const handleClick = async () => {
    const response = await fetch("/api/handleQuery", { method: "POST" });
    const result = await response.json();
    // console.log(ressult);
    setData(result);
  };

  return (
    <div className={tw`flex flex-col w-full`}>
      <div className={tw`flex flex-col h-2/4 bg-white p-3 mb-3 rounded`}>
        <div className={tw`h-full`}>
          Query Console
        </div>
        <div className={tw`flex flex-row justify-end`}>
          <button
            className={tw`bg-gray-300 px-5 py-3 text-sm shadow-sm font-medium tracking-wider  text-gray-600 rounded-full hover:shadow-2xl hover:bg-gray-400`}
            onClick={handleClick}
          >
            Run
          </button>
        </div>
      </div>
      <div className={tw`bg-white h-full rounded p-3 overflow-y-scroll`}>
        <h2>Results</h2>
        <p className={tw`break-words`}>{JSON.stringify(data)}</p>
      </div>
    </div>
  );
}
