---
sidebar_position: 1
---

# Using Hono Plugins in Yelix

Yelix is a powerful framework for building APIs, and it can be easily extended with plugins. One of the most popular frameworks for building web applications in Deno is Hono. In this guide, we'll explore how to use Hono plugins within Yelix.

## What is Hono?

Hono is a lightweight and fast web framework for Deno, designed for building APIs and web applications. It provides a simple and intuitive API for defining routes, middleware, and handling requests and responses.

## Why Use Hono Plugins in Yelix?

Using Hono plugins in Yelix allows you to leverage the power of Hono's middleware and routing capabilities while still benefiting from Yelix's features. This combination can help you build robust and scalable APIs with ease.

The problem is that Yelix may not support exactly what you need in some cases. That’s actually why I built Yelix on top of Hono. Creating a core HTTP server isn’t a big challenge, I could build one from scratch. But when you run into an issue that you can’t solve just by searching, Hono gives you an advantage: you can often find a solution online or use an existing plugin. That’s why Yelix is designed to be flexible and compatible with Hono plugins.

## How To Reach Hono

Hono is a public field of Yelix and can be accessed via the `app` property of the Yelix instance. This allows you to use Hono's features directly within your Yelix application.

```ts
const yelix = new Yelix();

const hono = yelix.app; // Access Hono instance
```

## Real-Life Example | serveStatic Plugin

Yelix doesn’t natively support static file serving yet — but that’s not a limitation thanks to Hono’s plugin system. You can easily use the serveStatic plugin from Hono to serve static files:

```ts
import { serveStatic } from '@hono/node-server/serve-static';
import { Yelix } from 'jsr:@murat/yelix';

const app = new Yelix();

app.app.use('*', serveStatic({ root: './public' }))

await app.serve();
```

:::caution
### Why is this not recommended?

Since Yelix watches your backend and manages middleware under the hood, using Hono’s middleware directly bypasses Yelix’s control. This means Yelix can’t manage or track the middleware properly. So while it will work, it's technically not a valid Yelix middleware and might cause issues in the future.

:::