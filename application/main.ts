/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { InnerRenderFunction, RenderContext, start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import { config, setup } from "@twind";
import { virtualSheet } from "twind/sheets";

const sheet = virtualSheet();

sheet.reset();

setup({
  ...config,
  sheet,
  theme: {
    extend: {
      colors: {
        "deno-pink-100": "hsl(282, 31%, 80%)",
        "deno-pink-200": "hsl(278, 19%, 57%)",
        "deno-blue-100": "hsl(198, 40%, 72%)",
        "deno-blue-200": "hsl(201, 27%, 58%)",
      },
    },
  },
});

function render(ctx: RenderContext, render: InnerRenderFunction) {
  const snapshot = ctx.state.get("twind") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  ctx.styles.splice(0, ctx.styles.length, ...(sheet).target);
  const newSnapshot = sheet.reset();
  ctx.state.set("twind", newSnapshot);
}

await start(manifest, { render });
