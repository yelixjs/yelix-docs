// dev.ts

const resolveProcess = new Deno.Command("deno", {
  args: [
    "run",
    "--allow-read",
    "--allow-write",
    "https://docs.yelix.dev/resolveEndpoints.ts?noCache=" + Date.now(),
    "--folder",
    "api",
    "--watch",
  ],
  stdin: "null",
  stdout: "piped",
  stderr: "piped",
}).spawn();

console.log("[dev] Started resolveEndpoints.ts");

const startProcess = new Deno.Command("deno", {
  args: [
    "run",
    "--watch=*",
    "--allow-net",
    "--allow-read",
    "--allow-env",
    "main.ts",
  ],
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

const { code } = await startProcess.output();

console.log(`[dev] main.ts exited with code ${code}, killing resolveEndpoints...`);

resolveProcess.kill("SIGTERM");

Deno.exit(code);
