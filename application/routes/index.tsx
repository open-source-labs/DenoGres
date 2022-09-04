/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Layout from "../components/Layout.tsx";

export default function index() {
  return (
    <Layout>
      <div className={tw`w-full flex flex-row ml-3`}>
        <div className={tw`flex flex-col w-full`}>
          <div
            className={tw`flex flex-col h-full bg-white p-3 rounded`}
          >
            <div>
              <h2>Welcome to Denogres!</h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
