---
sidebar_position: 6
---

# Cache

Yelix provides a built-in in-memory caching system that helps improve performance by storing and reusing frequently accessed data. The cache system supports TTL (Time-To-Live) and is type-safe.

Yelix cache made for endpoints so focus on that but able to use in other cases. 

## Features

- 🚀 Type-safe generic cache implementation
- ⏰ Flexible TTL (Time-To-Live) support
- 🎯 Built-in cache hit/miss tracking
- 🧹 Automatic cache cleanup

## Basic Usage

Here's a simple example of how to use the cache:

```ts title="basic-cache-example.ts"
import { YelixCache } from "@/src/utils/cache.ts";

// Create a type-safe cache instance
const cache = new YelixCache<string>();

// Store a value for 5 seconds
cache.set(
  null, // if you in a endpoint, pass ctx here otherwise pass null
  "greeting", "Hello World", "5s");

// Retrieve the value
const value = cache.get(null, "greeting");
```

## Complete Example

Here's a complete example showing cache implementation in an endpoint:

```ts title="cache-example.ts" {7,12-15,19}
import type { Ctx, ValidationType } from "@/mod.ts";
import z from "zod";
import type { QueryType } from "@/src/types/types.d.ts";
import { YelixCache } from "@/src/utils/cache.ts";

// Create a cache instance for storing strings
export const cache = new YelixCache<string>();

export async function GET(ctx: Ctx) {
  const requestData = ctx.get("dataValidation").user;
  // Check if data exists in cache
  if (cache.has(ctx, query.name)) {
    const cachedData = cache.get(ctx, query.name)!;
    return await ctx.text(cachedData + " - (cached)", 200);
  }

  // If not in cache, compute and store
  const data = "Hello, " + query.name;
  cache.set(ctx, query.name, data, "5s");  // Cache for 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await ctx.text(data, 200);
}

export const path = "/api/hello";
export const middlewares = ["dataValidation"];

export const validation: ValidationType = {
  query: {
    name: z.string().min(1).required(),
  },
};
```

## Cache Performance

When running the example above, you'll see the cache in action:

```rust title="Terminal"
   𝕐 Yelix  0.1.25
   - Local       :   http://localhost:3030
   - Watching    :   ./testing/api
   - OpenAPI Docs:   /docs

// highlight-next-line
GET  Cache: MISS  /api/hello 200 in 1008ms  // First request - cache miss
GET  Cache: HIT   /api/hello 200 in 133μs   // Subsequent requests - cache hit
GET  Cache: HIT   /api/hello 200 in 485μs
GET  Cache: HIT   /api/hello 200 in 99μs
GET  Cache: HIT   /api/hello 200 in 101μs
// highlight-next-line
GET  Cache: MISS  /api/hello 200 in 1008ms  // After 5s - cache expired
```

## TTL Options

The cache supports various TTL (Time-To-Live) options:

```ts
// Common TTL values
cache.set(ctx, "key", "value", "5s");    // 5 seconds
cache.set(ctx, "key", "value", "1m");    // 1 minute
cache.set(ctx, "key", "value", "1h");    // 1 hour
cache.set(ctx, "key", "value", "1d");    // 1 day

// Custom milliseconds
cache.set(ctx, "key", "value", 7000);    // 7 seconds

// No expiration
cache.set(ctx, "key", "value", -1);      // Never expires
```

## Cache Methods

The `YelixCache` class provides several useful methods:

```ts
const cache = new YelixCache<string>();

// If you in a endpoint, 
//    pass `ctx`, 
//    otherwise pass `null`.

// Basic operations
cache.set(ctx, "key", "value", "5s");    // Store value
cache.get(ctx, "key");                   // Retrieve value
cache.has(ctx, "key");                   // Check existence
cache.delete(ctx, "key");                // Remove item

// Maintenance
cache.clear(ctx);                        // Clear all items
cache.cleanup(ctx);                      // Remove expired items
```

## Error Handling

If you don't implement the cache properly, you'll see:

```rust title="Terminal"
// highlight-next-line
GET  Cache: not implemented  /api/hello-no-cache 200 in 1006ms
```