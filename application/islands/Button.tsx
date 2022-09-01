/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

const handleClick = async () => {
  const response = await fetch("/api/handleQuery", { method: "POST" });
  const data = await response.json();
  console.log("data", data);
};

export default function Button() {
  return (
    <button
      className={tw`bg-gray-300 px-5 py-3 text-sm shadow-sm font-medium tracking-wider  text-gray-600 rounded-full hover:shadow-2xl hover:bg-gray-400`}
      onClick={handleClick}
    >
      Run
    </button>
  );
}
