import { exists } from "jsr:@std/fs/exists";

const deno_json = `
{
  "tasks": {
    "dev": "deno run --watch --allow-run --allow-net --allow-read --allow-env https://docs.yelix.dev/dev.ts"
  }
}
`.trim();

const main_ts = `
import { Yelix } from "jsr:@murat/yelix";
import endpoints from "./endpoints.ts";

export async function main() {
  // Port is 3030 by default
  const app = new Yelix();

  // Load endpoints from a 'api' folder
  app.loadEndpoints(endpoints);

  await app.serve();

  return app;
}

await main();
`.trim();

const helloAPI_ts = `
import type { Ctx } from "jsr:@murat/yelix";
// API endpoint handler

export async function GET(ctx: Ctx) {
  return await ctx.text('Hello World!', 200);
}

// API endpoint configs
export const path = '/api/hello';
`.trim();

// NEXT_LINE: WRITE_ACCESS
await Deno.writeTextFile("deno.json", deno_json);
// NEXT_LINE: WRITE_ACCESS
await Deno.writeTextFile("main.ts", main_ts);

// NEXT_LINE: READ_ACCESS
const isAPIExist = await exists("./api"); 
if (!isAPIExist) {
  // NEXT_LINE: WRITE_ACCESS
  await Deno.mkdir("api");
}
// NEXT_LINE: WRITE_ACCESS
await Deno.writeTextFile("api/hello.ts", helloAPI_ts);

new Deno.Command("deno", {
  args: [
    "run",
    "--allow-read",
    "--allow-write",
    "https://docs.yelix.dev/resolveEndpoints.ts?noCache=" + Date.now(),
    "--folder",
    "api",
  ],
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
}).spawn();

console.log('');
console.log('- Your Yelix project is generated, let\'s run your project!');
console.log('');
console.log('> deno task dev');
console.log('');