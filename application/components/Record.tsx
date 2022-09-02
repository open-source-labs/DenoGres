/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

function Record({ children }: any) {
  return (
    <div
      className={tw`bg-gray-100 m-1 p-2 text-gray-700 text-xs font-mono rounded`}
    >
      {children}
    </div>
  );
}
export default Record;
