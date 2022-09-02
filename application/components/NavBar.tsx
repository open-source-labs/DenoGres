/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

function NavBar() {
  return (
    <nav class={tw`flex flex-col p-3 bg-white rounded`}>
      <a href="/connections" className={tw`pb-10`}>Connections</a>
      <a href="/explorer" className={tw`pb-10`}>Query Explorer</a>
      <a href="/migrations" className={tw`pb-10`}>Migrations</a>
    </nav>
  );
}
export default NavBar;
