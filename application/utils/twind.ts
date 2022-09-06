import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, Configuration, setup } from "twind";
import * as colors from "twind/colors";

export * from "twind";
export const config: Configuration = {
  preflight: {
    body: apply`bg-gray-900 font-sans`,
    h2: apply`font-semibold`,
  },
  darkMode: "class",
  mode: "silent",
  theme: {
    extend: {
      colors: {
        "deno-pink-100": "hsl(282, 31%, 80%)",
        "deno-pink-200": "hsl(278, 19%, 57%)",
        "deno-blue-100": "hsl(198, 40%, 72%)",
        "deno-blue-200": "hsl(201, 27%, 58%)",
        ...colors,
      },
    },
  },
};
if (IS_BROWSER) setup(config);
