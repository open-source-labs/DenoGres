/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

function NavLink(
  props: { href: string; active: string; svg: h.JSX.Element },
) {
  const { href, active, svg } = props;
  return (
    <a href={href}>
      <div
        className={tw`${
          href === active ? "bg-gray-500 text-white" : "bg-gray-200"
        } mb-3 p-2 rounded hover:bg-gray-500 hover:text-white transition-300`}
      >
        {svg}
      </div>
    </a>
  );
}
export default NavLink;
