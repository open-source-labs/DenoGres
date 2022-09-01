/** @jsx h */
import { tw } from "@twind";
import { h } from "preact";
import NavBar from "./NavBar.tsx";
import { Head } from "$fresh/runtime.ts";

function Layout({ children }: any) {
  return (
    <div
      className={tw`min-h-screen bg-gradient-to-b from-gray-100 to-gray-300`}
    >
      <Head>
        <title>Denogres 2.0</title>
      </Head>
      <div className={tw`flex flex-row max-w-screen-lg h-screen p-4 mx-auto`}>
        <NavBar />
        {children}
      </div>
    </div>
  );
}
export default Layout;
