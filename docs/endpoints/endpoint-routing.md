---
sidebar_position: 1
---

# Routing

This guide will walk you through creating your first endpoints in Yelix. Endpoints are the building blocks of your API, defining how your application responds to HTTP requests.

## Simple endpoint that returns text

Creating a basic endpoint in Yelix is straightforward. Below is an example of a simple endpoint that returns plain text with a 200 OK status code. The `ctx.text()` method is used to send text responses back to the client.

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
// highlight-next-line
  // highlight-next-line
  return await ctx.text('Hello World!', 200);
}

export const path = '/api/hello';
```

## Return JSON

Most modern APIs communicate using JSON. Yelix makes it easy to return JSON responses using the `ctx.json()` method. This automatically sets the appropriate content type headers for you.

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  // highlight-next-line
  return await ctx.json({ message: 'Hello World!' }, 200);
}

export const path = '/api/hello';
```

## Return HTML

For endpoints that need to return HTML content, use the `ctx.html()` method. This sets the content type to 'text/html' and returns your HTML string to the client.

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  // highlight-next-line
  return await ctx.html('<h1>Hello World!</h1>', 200);
}

export const path = '/api/hello';
```

## HTTP Methods

Yelix supports all standard HTTP methods. You can define handlers for different methods on the same route by exporting functions named after the HTTP method. This allows you to implement RESTful API patterns easily.

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) { return await ctx.text('Hello World!', 200); }
export async function POST(ctx: Ctx) { return await ctx.text('Hello World!', 200); }
export async function PUT(ctx: Ctx) { return await ctx.text('Hello World!', 200); }
export async function DELETE(ctx: Ctx) { return await ctx.text('Hello World!', 200); }

export const path = '/api/hello';
```

## Path Parameter

Dynamic routes are essential for building flexible APIs. Yelix allows you to define path parameters using the `:parameter` syntax in your route definition. You can then access these parameters in your handler using `ctx.req.param()`.

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  // highlight-next-line
  const name = ctx.req.param('name')

  return await ctx.json({ message: 'Hello World!' }, 200);
}

// highlight-next-line 
export const path = '/api/user/:name';
```

or all parameters at once:

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  // highlight-next-line
  const { id, comment_id } = ctx.req.param()

  return await ctx.json({ message: 'Hello World!' }, 200);
}

// highlight-next-line
export const path = '/api/posts/:id/comment/:comment_id';
```

## Optional Parameter

Sometimes you want a parameter to be optional. Yelix supports this by adding a `?` after the parameter name. This means the route will match both with and without the parameter specified.

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  // highlight-next-line
  const name = ctx.req.param('name')

  return await ctx.json({ message: 'Hello World!' }, 200);
}

// Will match /api/user/murat and /api/user
// highlight-next-line
export const path = '/api/user/:name?';
```

## Regular Expressions

For more advanced routing needs, you can use regular expressions to constrain path parameters. This is useful when you need to ensure parameters match a specific format, such as numbers or specific text patterns.

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
   const { date, title } = ctx.req.param()
  
  return await ctx.text('Hello World!', 200);
}

// highlight-next-line
export const path = '/api/post/:date{[0-9]+}/:title{[a-z]+}';
```

## Including slashes

By default, path parameters don't match slashes to prevent accidentally capturing too much of the URL. However, sometimes you need to match paths that include slashes, such as file paths. You can use a custom regex pattern to achieve this.

```ts title="hello.ts"
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  const { filename } = ctx.req.param()

  return await ctx.text('Hello World!', 200);
}

// highlight-next-line
export const path = '/api/posts/:filename{.+\\.png}';
```