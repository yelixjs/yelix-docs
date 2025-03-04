---
sidebar_position: 2
---

# Context

How to use the `Ctx` object in Yelix.

## body()

Return the HTTP response.

You can set headers with `ctx.header()` and set HTTP status code with `ctx.status`. This can also be set in `ctx.text()`, `ctx.json()` and so on.

:::info

When returning Text or HTML, it is recommended to use `ctx.text()` or `ctx.html()`.

:::

```ts title="hello.ts"
export async function GET(ctx: Ctx) {
  // Set headers
  ctx.header('X-Message', 'Hello!')
  ctx.header('Content-Type', 'text/plain')

  // Set HTTP status code
  ctx.status(201)

  // Return the response body
  return await ctx.body('Thank you for coming')
}
```

You can also write the following.

```ts 
export async function GET(ctx: Ctx) {
  // Return the response body
  return await ctx.body('Thank you for coming', 201, {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  })
}
```

## text()

Render text as `Content-Type:text/plain`.

```ts 
export async function GET(ctx: Ctx) {
  return await ctx.text('Hello World!', 200)
}
```

Status code is optional and by default it is `200` but we recommend to set it explicitly for better readability.

## json()

Render JSON as `Content-Type:application/json`.

```ts
export async function GET(ctx: Ctx) {
  return await ctx.json({ message: 'Hello World!' }, 200)
}
```

Status code is optional and by default it is `200` but we recommend to set it explicitly for better readability.

## html()

Render HTML as `Content-Type:text/html`.

```ts 
export async function GET(ctx: Ctx) {
  return await ctx.html('<h1>Hello World!</h1>', 200)
}
```

Status code is optional and by default it is `200` but we recommend to set it explicitly for better readability.

## notFound()

Return the `Not Found` Response.

```ts 
export async function GET(ctx: Ctx) {
  return await ctx.notFound()
}
```

## redirect()

Redirect to another URL. Default status code is `302`.

```ts 
export async function GET(ctx: Ctx) {
  return await 
    ctx.redirect(
      'https://github.com/GroophyLifefor/yelix'
    );
}
```

You can also set the status code.

```ts 
export async function GET(ctx: Ctx) {
  return await 
    ctx.redirect(
      'https://github.com/GroophyLifefor/yelix',
      301
    );
}
```

## param()

Get the URL path parameters.

```ts
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

```ts
import type { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  // highlight-next-line
  const { id, comment_id } = ctx.req.param()

  return await ctx.json({ message: 'Hello World!' }, 200);
}

// highlight-next-line
export const path = '/api/posts/:id/comment/:comment_id';
```

## query()

Get the URL query parameters.

```ts
export async function GET(ctx: Ctx) {
  // /api/hello?q=YELIX
  const query = ctx.req.query('q')

  return await ctx.text('Hello World!', 200)
}
```

or all parameters at once:

```ts
export async function GET(ctx: Ctx) {
  // /api/hello?q=YELIX&limit=10&offset=0
  const { q, limit, offset } = ctx.req.query()

  return await ctx.text('Hello World!', 200)
}
```

## header()

Get the response headers.

```ts
export async function GET(ctx: Ctx) {
  const userAgent = ctx.req.header('User-Agent')

  return await ctx.text('Hello World!', 200)
}
```

:::warning

When `ctx.req.header()` is called with no arguments, all keys in the returned record are lowercase.

If you want to get the value of a header with an uppercase name, use `ctx.req.header("X-Foo")`.

```ts
// ❌ Will not work
const headerRecord = ctx.req.header()
const foo = headerRecord['X-Foo']

// ✅ Will work
const foo = ctx.req.header('X-Foo')
```

:::

## parseBody() 

Parse Request body of type `multipart/form-data` or `application/x-www-form-urlencoded`

```ts
export async function GET(ctx: Ctx) {
  const body = await ctx.req.parseBody();

  return await ctx.text('Hello World!', 200)
}
```

`parseBody()`,  supports the following behaviors.

#### Single file

```ts
export async function GET(ctx: Ctx) {
  const body = await ctx.req.parseBody();
  const data = body['foo'];

  return await ctx.text('Hello World!', 200)
}
```

`body['foo']` is always `(string | File)`.

If multiple files are uploaded, the last one will be used.

### Multiple files

```ts
export async function GET(ctx: Ctx) {
  const body = await ctx.req.parseBody();
  const datas = body['foo[]'];

  return await ctx.text('Hello World!', 200)
}
```

`body['foo[]']` is always `(string | File)[]`.

`[]` postfix is required.

### Multiple files with same name

```ts
export async function GET(ctx: Ctx) {
  const body = await ctx.req.parseBody({ all = true });
  const data = body['foo'];

  return await ctx.text('Hello World!', 200)
}
```

`all` option is disabled by default.

- If `body['foo']` is multiple files, it will be parsed to `(string | File)[]`.
- If `body['foo']` is single file, it will be parsed to `(string | File)`.

### Dot notation

If you set the `dot` option `true`, the return value is structured based on the dot notation.

Imagine receiving the following data:

```ts
const data = new FormData()
data.append('obj.key1', 'value1')
data.append('obj.key2', 'value2')
```

```ts
export async function GET(ctx: Ctx) {
  const body = await ctx.req.parseBody({ dot = true });
  // body is `{ obj: { key1: 'value1', key2: 'value2' } }`

  return await ctx.text('Hello World!', 200)
}
```
