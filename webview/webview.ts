import { SizeHint, Webview } from "https://deno.land/x/webview/mod.ts";

const webview = new Webview();

webview.size = {
  width: 1024,
  height: 768,
  hint: SizeHint.FIXED,
};

webview.title = "Denogres 2.0";
// webview.navigate("http://localhost:8000");
webview.navigate("https://deno.land/");
webview.run();