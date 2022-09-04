const runServer = Deno.run({
  cmd: ["deno", "run", "-A", "./application/dev.ts"],
});
const runWebview = Deno.run({
  cmd: ["deno", "run", "-Ar", "--unstable", "./webview/webview.ts"],
});

await runServer.status();
await runWebview.status();
