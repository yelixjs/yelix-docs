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
deno run --allow-write --allow-read https://docs.yelix.dev/yelix-template.ts
```

This command will create a new Yelix project with the following structure:

```
 api/
 └── hello.ts
 deno.json
 main.ts
```

### Generated Files

| File | Purpose | Description |
|------|---------|-------------|
| `deno.json` | Project Configuration | Contains development tasks and project settings. Defines the `dev` command used to run the server. |
| `main.ts` | Server Setup | Entry point of the application. Initializes Yelix server and configures endpoint loading from the `api` folder. |
| `api/hello.ts` | Example Endpoint | Demonstrates a basic API endpoint that returns "Hello World!" when accessed at `/api/hello`. Shows the standard endpoint structure. |

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
