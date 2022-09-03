/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";

export default function Connections() {
  function connectionsList() {
    return (
      <div className={tw`text-center`}>
        List of Connections
      </div>
    );
  }

  const connections = connectionsList();

  return (
    <div className={tw`w-full flex flex-row`}>
      <div className={tw`w-5/12 bg-white rounded mx-3 p-3 items-center`}>
        <h2 className={tw`mb-3 text-center`}>Connections List</h2>
        {connections}
      </div>
      <div className={tw`flex flex-col w-full`}>
        <div
          className={tw`flex flex-col h-full bg-white p-3 rounded`}
        >
          <div>
            Connection Details
          </div>
        </div>
      </div>
    </div>
  );
}
