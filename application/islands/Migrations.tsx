/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";

// list of saved Migrations
export default function Migrations() {
  return (
    <div className={tw`w-full flex flex-row`}>
      <div
        className={tw`w-5/12 bg-white rounded mx-3 p-3 items-center`}
      >
        <h2 className={tw`mb-3 text-center`}>Migration History</h2>
      </div>
      <div
        className={tw`flex flex-col w-full`}
      >
        <div
          className={tw`flex flex-col h-full bg-white p-3 rounded`}
        >
          <div>
            <h2>Migration Details</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
