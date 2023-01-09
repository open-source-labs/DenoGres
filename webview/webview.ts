// import { SizeHint, Webview } from "../deps.ts";
import { SizeHint, Webview } from 'https://deno.land/x/webview@0.7.4/mod.ts'; //webview.ts

// creates a new instance of a webview window (i.e. the gui)
const webview = new Webview();

webview.size = {
  width: 1024,
  height: 768,
  hint: SizeHint.FIXED,
};

webview.title = 'Denogres 2.0';
webview.navigate('https://denogres.deno.dev/gui');
webview.run();
