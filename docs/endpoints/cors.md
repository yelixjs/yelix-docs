---
sidebar_position: 5
---

# CORS

CORS, or Cross-Origin Resource Sharing, is a security feature implemented by web browsers to prevent unauthorized access to resources on a different domain. When a web application makes a request to a different domain, the browser will block the request unless the server responds with the appropriate CORS headers.

## Enabling CORS

The `cors()` method allows you to configure CORS settings for your Yelix application. Here's a basic example:

```ts title="main.ts"
import { Yelix } from 'jsr:@murat/yelix';

export async function startServer() {
  const app = new Yelix();

  // highlight-start
  app.cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type'],
  });
  // highlight-end

  app.serve();
}

await startServer();
```

## Configuration Options

The CORS middleware accepts the following options:

### `origin`
- Type: `string | string[] | ((origin: string, c: Context) => string | undefined | null)`
- Required: Yes
- Description: Configures the `Access-Control-Allow-Origin` CORS header
- Examples:
  ```ts
  // Allow all origins
  origin: '*'
  
  // Allow specific origins
  origin: ['https://example.com', 'https://api.example.com']
  
  // Dynamic origin validation
  origin: (origin, ctx) => {
    return origin.endsWith('.example.com') ? origin : null;
  }
  ```

### `allowMethods`
- Type: `string[]`
- Optional
- Description: Configures the `Access-Control-Allow-Methods` CORS header
- Default: `['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']`

### `allowHeaders`
- Type: `string[]`
- Optional
- Description: Configures the `Access-Control-Allow-Headers` CORS header
- Example: `['Content-Type', 'Authorization']`

### `maxAge`
- Type: `number`
- Optional
- Description: Configures the `Access-Control-Max-Age` CORS header (in seconds)
- Example: `86400` (24 hours)

### `credentials`
- Type: `boolean`
- Optional
- Description: Configures the `Access-Control-Allow-Credentials` CORS header
- Default: `false`

### `exposeHeaders`
- Type: `string[]`
- Optional
- Description: Configures the `Access-Control-Expose-Headers` CORS header
- Example: `['Content-Length', 'X-Custom-Header']`

### `affectRoute`
- Type: `string`
- Optional
- Description: Specifies which routes should be affected by CORS. Uses path pattern matching.
- Default: `"*"` (all routes)
- Example: `"/api/*"` (only routes starting with /api/)

## Advanced Example

Here's a more comprehensive CORS configuration:

```ts
app.cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  maxAge: 86400,
  credentials: true,
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  affectRoute: '/api/*'
});
```