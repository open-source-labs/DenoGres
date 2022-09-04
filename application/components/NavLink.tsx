/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

function NavLink({ children }: any) {
  return (
    <div
      className={tw`bg-gray-200 mb-3 p-2 rounded hover:bg-gray-500 hover:text-white`}
    >
      {children}
    </div>
  );
}
export default NavLink;
