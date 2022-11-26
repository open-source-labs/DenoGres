import { h } from "preact";
import NavBar from "./NavBarGUI.tsx";
import { Head } from "$fresh/runtime.ts";

function Layout({ children }: any, props: { active: string }) {
  const { active } = props;
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300"
    >
      <Head>
        <title>Denogres 2.0</title>
      </Head>
      <div
        className="flex flex-row max-w-screen-lg h-screen p-4 mx-auto"
      >
        {children}
      </div>
    </div>
  );
}
export default Layout;
