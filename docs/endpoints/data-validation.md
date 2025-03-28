---
sidebar_position: 3
---

# Data Validation

Yelix comes with a powerful built-in data validation system inspired by Zod but with additional features.

## Initial Setup

Data Validation is built-in but needs to be enabled in your main file.

```ts title="main.ts"
import { Yelix, requestDataValidationYelixMiddleware } from 'jsr:@murat/yelix';

export async function startServer() {
  const app = new Yelix();
  app.setMiddleware('dataValidation', requestDataValidationYelixMiddleware);
  app.serve();
}

await startServer();
```

## Basic Example

```ts title="hello.ts"
import { Ctx, ValidationType, inp } from "jsr:@murat/yelix";

export async function POST(ctx: Ctx) {
  const requestData = ctx.get('dataValidation').user;
  const { username, email } = requestData.body;
  return await ctx.text(`Hello, ${username}!`, 200);
}

export const path = '/api/hello';
export const middlewares = ['dataValidation'];

export const validation: ValidationType = {
  body: inp().object({
    username: inp().string().min(3).max(255),
    email: inp().string().email()
  })
};
```

## Available Validators

### String Validation
```ts
inp().string()
  .min(3)                    // Minimum length
  .max(255)                  // Maximum length
  .length(10)               // Exact length
  .email()                  // Email format
  .url()                    // URL format
  .regex(/pattern/)         // Regular expression
  .includes("text")         // Contains text
  .startsWith("prefix")     // Starts with
  .endsWith("suffix")       // Ends with
  .trim()                   // Trim whitespace
  .toLowerCase()            // Convert to lowercase
  .toUpperCase()           // Convert to uppercase
  .ip()                     // IP address (v4/v6)
  .date()                   // Date string format
  .time()                   // Time string format
  .datetime()              // ISO datetime format
  .base64()                // Base64 string
  .optional()              // Make field optional
```

### Number Validation
```ts
inp().number()
  .min(0)                   // Minimum value
  .max(100)                // Maximum value
  .range(0, 100)           // Value range
  .integer()               // Must be integer
  .positive()              // Must be positive
  .negative()              // Must be negative
  .multipleOf(5)           // Multiple of value
  .finite()                // Must be finite
  .safe()                  // Safe integer
  .optional()              // Make field optional
```

### Array Validation
```ts
inp().array()
  .min(1)                   // Minimum length
  .max(10)                 // Maximum length
  .length(5)               // Exact length
  .notEmpty()              // Must not be empty
  .unique()                // All elements unique
  .includes(value)         // Must include value
  .every(validator)        // All items must match
  .some(validator)         // Some items must match
  .optional()              // Make field optional
```

### Object Validation
```ts
inp().object({
  name: inp().string(),
  age: inp().number(),
  tags: inp().array()
})
  .hasKey("field")         // Must have key
  .minKeys(1)              // Minimum keys
  .maxKeys(10)             // Maximum keys
  .exactKeys(["id", "name"]) // Must have exact keys
  .optional()              // Make field optional
```

### Date Validation
```ts
inp().date()
  .min(new Date("2024-01-01"))  // Minimum date
  .max(new Date("2024-12-31"))  // Maximum date
  .format("yyyy-MM-dd")         // Format date
  .timezone("America/New_York") // Set timezone
  .future()                     // Must be future
  .past()                       // Must be past
  .weekday([1,2,3,4,5])        // Valid weekdays
  .age(18)                      // Minimum age
  .optional()                   // Make field optional
```

### File Validation
```ts
inp().file()
  .multipleFiles()         // Allow multiple files
  .minFilesCount(1)        // Minimum files
  .maxFilesCount(5)        // Maximum files
  .minSize(1024)           // Minimum size (bytes)
  .maxSize(5 * 1024 * 1024) // Maximum size (bytes)
  .mimeType(['image/jpeg', 'image/png']) // Valid mime types
  .optional()              // Make field optional
```

## Complete Example

```ts
export const validation: ValidationTypeBETA = {
  query: {
    page: inp().number().integer().min(1).optional(),
    limit: inp().number().integer().range(1, 100)
  },
  body: inp().object({
    username: inp().string().min(3).max(255),
    email: inp().string().email(),
    age: inp().number().range(18, 99),
    profile: inp().object({
      bio: inp().string().max(1000).optional(),
      interests: inp().array().every(inp().string()).max(10)
    }),
    avatar: inp().file().maxSize(5 * 1024 * 1024).mimeType(['image/jpeg', 'image/png'])
  }),
  formData: {
    files: inp().file()
      .multipleFiles()
      .maxFilesCount(5)
      .maxSize(10 * 1024 * 1024)
      .mimeType(['application/pdf'])
  }
};
```