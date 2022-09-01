/** @jsx h */

import { h } from "preact";
import { tw } from "@twind";
import Layout from "../components/Layout.tsx";
import Button from "../islands/Button.tsx";

export default function explorer() {
  return (
    <Layout>
      <div className={tw`flex flex-col w-full`}>
        <div className={tw`flex flex-col h-2/4 bg-white p-3 mb-3 rounded`}>
          <div className={tw`h-full`}>
            Query Console
          </div>
          <div className={tw`flex flex-row justify-end`}>
            <Button />
          </div>
        </div>
        <div className={tw`bg-white h-full rounded p-3`}>
          Results
        </div>
      </div>
    </Layout>
  );
}
