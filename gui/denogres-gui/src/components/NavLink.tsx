import { h } from "preact";

function NavLink(
  props: { href: string; active: string; link: string; svg: h.JSX.Element },
) {
  const { href, active, link, svg } = props;

  const divStyle: string =
    (href === active ? "bg-gray-500 text-white" : "bg-gray-200") +
    " mb-3 p-2 rounded group relative";

  return (
    <a href={href}>
      <div
        class={divStyle}
      >
        {svg}
        <div class="absolute text-xs text-white bg-gray-600 opacity-0 transition duration-700 ease-in-out px-1 z-10 rounded 
        group-hover:opacity-80">
          {link}
        </div>
      </div>
    </a>
  );
}
export default NavLink;
