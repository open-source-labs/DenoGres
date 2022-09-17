import { SizeHint, Webview } from "../deps.ts";

const webview = new Webview();

webview.size = {
  width: 1024,
  height: 768,
  hint: SizeHint.FIXED,
};

webview.title = "Denogres 2.0";
webview.navigate("https://denogresdev-2.deno.dev/gui");
webview.run();
