const runServer = Deno.run({
  cmd: [
    "deno",
    "task",
    // "start",
    "startPROD",
    // "-A",
    // FOR DEVELOPMENT
    // "./application/dev.ts",
    // "https://deno.land/x/denogresdev/application/dev.ts",
    // FOR PRODUCTION
    // "https://deno.land/x/denogres/application/dev.ts",
  ],
});
const runWebview = Deno.run({
  cmd: [
    "deno",
    "task",
    "appPROD",
    // "-Ar",
    //   "--unstable",
    //   // FOR DEVELOPMENT
    //   // "./webview/webview.ts",
    //   "https://deno.land/x/denogresdev/webview/webview.ts",
    //   // FOR PRODUCTION
    //   // "https://deno.land/x/denogres/webview/webview.ts",
  ],
});

await runServer.status();
await runWebview.status();
