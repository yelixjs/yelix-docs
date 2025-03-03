---
sidebar_position: 1
---

# Tutorial Intro

Let's discover **Yelix in less than 5 minutes**.

## Getting Started

Get started by **creating a new server**.

### What you'll need

- [Deno](https://docs.deno.com/runtime/getting_started/installation/)

## Generate a new server

To generate a new server, we should init before.

```bash
deno init my-app
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

Move into the newly created directory:

```bash
cd my-app
```

### Install Yelix

To install Yelix, run the following command:

```bash
deno add jsr:@murat/yelix
```

This command installs the Yelix package into your project.

### Update your main file

Open the `main.ts` file in your project and add the following code:

`./main.ts`
```typescript
import { Yelix } from "jsr:@murat/yelix";
import * as path from "jsr:@std/path@1.0.8";

async function main() {
  // Port is 3030 by default
  const app = new Yelix();

  // Load endpoints from a 'api' folder
  const currentDir = Deno.cwd();
  const API_Folder = path.join(currentDir, 'api');
  await app.loadEndpointsFromFolder(API_Folder);

  app.serve();
}

await main();
```

This code imports the Yelix package and creates a new server instance. It then loads endpoints from a folder and serves the application.

:::caution

Deno Deploy doesn't support `loadEndpointsFromFolder` method, if you want to deploy your app on Deno Deploy, you should use `loadEndpoints` method.

Deno Deploy doesn't access dynamic importing because of security reasons.

:::

### Create an API folder

Create a new folder named `api` in your project directory. Inside this folder, create a new file named `hello.ts` with the following content:

`./api/hello.ts`
```typescript
import type { Ctx } from "jsr:@murat/yelix";

// API endpoint handler
export async function GET(ctx: Ctx) {
  return await ctx.text('Hello World!', 200);
}

// API endpoint configs
export const path = '/api/hello';
```

- Method: `GET` - Taken from the function name
- Path: `/api/hello` - Defined in the `path` variable
- Response: `Hello World!` - Returned by the `GET` function

## Start your site

Run the development server:

```bash
deno run --watch --allow-net --allow-read --allow*env main.ts
```

- `--watch` - Automatically reloads the server when changes are made
- `--allow-net` - Allows network access for serving the server
- `--allow-read` - Allows file read access for loading endpoints
- `--allow-env` - Checking where is deployed for Deno Deploy
Ready for you to view at http://localhost:3030/ \
For look wroten endpoint, visit http://localhost:3030/api/hello
