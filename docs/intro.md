---
sidebar_position: 1
---

# Tutorial Intro

Let's discover **Yelix in less than 1 minutes**.

## Getting Started

Get started by **creating a new server**.

### What you'll need

- [Deno](https://docs.deno.com/runtime/getting_started/installation/)

## Generate a new server

To generate a new server, run the following command:

```bash
deno run --allow-write --allow-read --allow-run https://docs.yelix.dev/yelix-template.ts
```

This command will create a new Yelix project with the following structure:

```
 api/
 └── hello.ts
 deno.json
 main.ts
```

<details>
<summary>Technical Information</summary>


### Generated Files

| File               | Purpose                     | Description                                                                                           |
|--------------------|-----------------------------|-------------------------------------------------------------------------------------------------------|
| `deno.json`        | Project Configuration       | Contains development tasks and project settings, including the `dev` task which starts the server. |
| `remote:dev.ts`           | Development Server Script   | Main script for starting the development server. It orchestrates the execution of other scripts like `resolveEndpoints.ts` and `main.ts`. This scripts loads from remote server. |
| `main.ts`          | Server Setup                | Initializes the Yelix server, loads the generated `endpoints.ts`, and starts the application. |
| `api/hello.ts`     | Example Endpoint            | Demonstrates a simple API endpoint (`/api/hello`) that returns a "Hello World!" message. |


## What Happens Behind the Scenes

When you run this command:

1. **Run dev.ts via Dev task**: When you run `deno task dev`, it executes the `dev.ts` script.
1. 1. **Endpoint Resolution**: The `resolveEndpoints.ts` script scans your `api` directory and generates proper static imports in `endpoints.ts`
1. 2. **Server Startup**: The Yelix server (`main.ts`) loads these endpoints and starts listening for requests
1. 3. **File Watching**: Two watchers run simultaneously:
      - One watches the `api` folder and regenerates `endpoints.ts` when files change
      - Another watches your entire project and restarts the server when needed
1. 4. **Sibling closure**: When your `main.ts` process is terminated, the resolver process is also terminated. This ensures that all processes are properly cleaned up.

## Technical Implementation

The `dev.ts` script orchestrates this process by:
- Spawning the resolver process with file watching enabled
- Running the main server with the `--watch` flag for hot reloading
- Managing process lifecycle and termination

The resolver handles the critical task of transforming your directory structure into Deno Deploy-compatible static imports, creating entries like:

```typescript
// In endpoints.ts (auto-generated)
const endpoints = [
  await import("./api/hello.ts"),
  await import("./api/users.ts"),
  // All your API endpoints are automatically included
];
```

## Why This Matters

Deno Deploy has a strict requirement: imports must be static string literals. This architecture automatically handles this constraint while providing a seamless development experience where you can add new API endpoints without manually updating imports.

You can focus on building your API endpoints while the system handles the deployment compatibility for you.

</details>

### Start your server

Run the development server:

```bash
deno task dev
```

This command will start your server in development mode with all required permissions.

| Description | URL |
|------------|-----|
| URL for your index page | http://localhost:3030/ |
| URL for the specified endpoint | http://localhost:3030/api/hello |
