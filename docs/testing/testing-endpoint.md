---
sidebar_position: 1
---

# Testing Endpoints

Yelix provides a built-in testing framework that allows you to test your endpoints easily. This guide will walk you through the process of setting up and running tests for your Yelix endpoints.

## Initial Setup

To start testing your Yelix endpoints, you'll need to set up your test environment. Yelix uses Deno's built-in testing utilities along with its own testing helpers.

```ts title="main.ts"
import { Yelix, type OptionalAppConfigType } from 'jsr:@murat/yelix';

export async function main(config?: OptionalAppConfigType) {
  const app = new Yelix(
    config
      ? config
      : {
          environment: 'dev',
          serverPort: 3030,
        }
  );

  // ... loading endpoints and middlewares

  await app.serve();
  return app;
}

// If imported as a module, don't run the server because it's for testing
// Otherwise, it is the main entry point and we run the server
if (import.meta.main) {
  await main();
}
```

## Basic Example

Let's look at a complete example of testing a simple endpoint.

```ts title="endpoints/hello.ts"
import { Ctx, inp, ValidationType } from 'jsr:@murat/yelix';

export async function GET(ctx: Ctx) {
  const requestData = ctx.get('dataValidation').user;
  const query = requestData.query;

  const data = 'Hello, ' + query.name;
  return await ctx.text(data, 200);
}

export const path = '/api/hello';
export const middlewares = ['dataValidation'];

export const validation: ValidationType = {
  query: {
    name: inp().string().min(3),
  },
};
```

```ts title="test/hello_test.ts"
import { main } from '../main.ts';
import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { request } from 'jsr:@murat/yelix';

async function getServer() {
  return await main({
    // Using 'test' environment for isolated testing
    showWelcomeMessage: false,
    environment: 'test',
    // Note: Server port is not needed for testing purposes, not serving to localhost or any port.
  });
}

describe('Hello endpoint test', () => {
  it('GET /api/hello', async () => {
    const app = await getServer();

    const task = await request(app, '/api/hello?name=world', {
      method: 'GET',
    });

    expect(task.req.status).toBe(200);
    expect(task.res.responseType).toBe('text');
    expect(task.res.text).toBe('Hello, world');
  });
});
```

## Testing Utilities

### request Function

The `request` function is the main utility for testing endpoints. It accepts three parameters:

- `app`: Your Yelix application instance
- `path`: The endpoint path including query parameters
- `options`: Request options (method, headers, body, etc.)

### Response Object

The response object provides several properties for assertions:

- `req.status`: HTTP status code
- `res.responseType`: Response type (text, json, etc.)
- `res.text`: Response text content
- `res.json`: Parsed JSON response (when applicable)

## Best Practices

1. **Isolated Testing Environment**

   - Use `environment: 'test'` in your config
   - Disable welcome messages with `showWelcomeMessage: false`

2. **Test Organization**

   - Group related tests using `describe` blocks
   - Use clear, descriptive test names
   - Test both successful and error cases

3. **Clean Setup**
   - Create a fresh server instance for each test
   - Use helper functions like `getServer()` to reduce boilerplate

## Complete Example

Here's a more comprehensive test suite example:

```ts
describe('Hello API Tests', () => {
  it('should return greeting with valid name', async () => {
    const app = await getServer();
    const task = await request(app, '/api/hello?name=world', {
      method: 'GET',
    });

    expect(task.req.status).toBe(200);
    expect(task.res.text).toBe('Hello, world');
  });

  it('should fail with short name', async () => {
    const app = await getServer();
    const task = await request(app, '/api/hello?name=a', {
      method: 'GET',
    });

    expect(task.req.status).toBe(400);
  });

  it('should fail without name parameter', async () => {
    const app = await getServer();
    const task = await request(app, '/api/hello', {
      method: 'GET',
    });

    expect(task.req.status).toBe(400);
  });
});
```

## Running Tests

To run your tests, use the Deno test command:

```bash
deno test --allow-net --allow-read --allow-env
```

Learn more about Deno testing in the [Deno documentation](https://docs.deno.com/runtime/fundamentals/testing/).
