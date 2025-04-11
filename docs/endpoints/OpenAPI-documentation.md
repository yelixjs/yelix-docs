---
sidebar_position: 4
---

# OpenAPI Documentation

This page contains the OpenAPI documentation for the Yelix API. The documentation is generated using the OpenAPI specification and is available in JSON format.

## Getting Started

Let's get started by initializing the OpenAPI documentation.

```ts title="main.ts"
import { Yelix } from "jsr:@murat/yelix";
import * as path from "jsr:@std/path@1.0.8";

async function main() {
  // Port is 3030 by default
  const app = new Yelix();

  // Load endpoints from a 'api' folder
  const currentDir = Deno.cwd();
  const API_Folder = path.join(currentDir, 'api');
  await app.loadEndpointsFromFolder(API_Folder);

  // highlight-start
  app.initOpenAPI({
    path: "/docs",
    title: "Yelix Testing API",
    description: "This is a testing API for Yelix",
    servers: [
      {
        url: "http://localhost:3030",
        description: "Local Server",
      },
    ],
  });
  // highlight-end

  app.serve();
}

await main();
```

#### Overview

When you initialize the OpenAPI documentation, endpoints are automatically documented. The documentation is available at the `/docs` endpoint.

```ts title="hello.ts"
// ...imports...

export async function GET(ctx: Ctx) {
  const requestData = ctx.get("dataValidation").user;
  const query: QueryType = requestData.query;

  const data = "Hello, " + query.name;
  return await ctx.text(data, 200);
}

export const path = "/api/hello-no-cache";
export const middlewares = ["dataValidation"];

export const validation = {
  query: {
    name: inp().string(),
  },
};
```

Without extra documentation, the OpenAPI documentation will look like this:

![without configuration](@site/static/img/openapi/1.png)

Yelix automaticly takes some information when serving your endpoints.
- Method: `GET` - Taken from the function name
- Path: `/api/hello-no-cache` - Defined in the `path` variable
- Validation: `query` - Defined in the `validation` variable

## Configuration (openAPI export)

```ts title="hello.ts"
export const openAPI = {
  description: 'Returns a greeting message',
  tags: ['General'],
  responses: {
    200: {
      type: 'application/json',
      zodSchema: inp().object({
        message: inp().string(),
      }),
    },
  },
};
```

With the `openAPI` export, you can provide additional information about the endpoint. This information will be displayed in the OpenAPI documentation.

![with configuration](@site/static/img/openapi/2.png)

#### Automatic Description Generation

If you don't provide a description, Yelix will generate one for you based on the data validation. For example, if you have a query validation like this:

```ts title="hello.ts"
export const validation = {
  query: {
    name: inp().string()
    // highlight-next-line
      .min(3).max(255).email(),
  },
};
```

![Automatic Description Generation](@site/static/img/openapi/4.png)

`query: { [key: string]: { description: string } }` is also supported. If you don't provide a description, I will generate one for you with data validation(If you don't have extra validation, will be empty). Lemme do one example for you to understand better. Don't forget, all descriptions supports CommonMarkdown.



```ts title="hello.ts"
export const openAPI = {
  description: 'Returns a greeting message',
  tags: ['General'],
  // highlight-start
  query: {
    name: {
      description: 'Name of the person',
    }
  },
  // highlight-end
  responses: {
    200: {
      type: 'application/json',
      zodSchema: inp().object({
        message: inp().string(),
      }),
    },
  },
};
```

![with query description](@site/static/img/openapi/3.png)

## Responses 

In openAPI export, you can define responses for the endpoint. The responses are displayed in the OpenAPI documentation.

```ts title="hello.ts"
export const openAPI = {
  description: 'Register a new user',
  tags: ['General'],
  responses: {
    200: {
      type: 'application/json',
      zodSchema: inp().object({
        username: inp().string(),
        email: inp().string().email(),
        age: inp().number().min(18).max(99),
        friendNames: inp().array(inp().string()),
        country: inp().string().enum(['USA', 'UK', 'India']), 
      }),
    },
  },
};
```

![Responses Auto Generation](@site/static/img/openapi/5.png)

## Hide Endpoint

If you want to hide an endpoint from the OpenAPI documentation, you can use the `hide` in openAPI export.

```ts title="hello.ts"
export const openAPI = {
  hide: true,
};
```
