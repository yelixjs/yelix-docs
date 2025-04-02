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

<details>
<summary>
  **Failed Response**
</summary>

The response structure is designed to be easily consumable by front-end applications. It presents validation errors in a clear, structured format, grouping errors by field and providing detailed messages for each validation rule that failed.

```json
{
  "errors": {
    "username": [
      {
        "message": "This field must be a string and is required.",
        "key": "username",
        "from": "body"
      },
      {
        "message": "String must be at least 3 characters long",
        "key": "username",
        "from": "body"
      },
      {
        "message": "String must be at most 255 characters long",
        "key": "username",
        "from": "body"
      }
    ],
    "email": [
      {
        "message": "This field must be a string and is required.",
        "key": "email",
        "from": "body"
      },
      {
        "message": "Invalid email address",
        "key": "email",
        "from": "body"
      }
    ]
  }
}
```
</details>

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
  .enum(["admin", "user"])    // Must be one of values
  .toNumber()                // Convert to number (useful for query params)
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
  .enum([1, 2, 3, 5])       // Must be one of values
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

### Boolean Validation
```ts
inp().boolean()
  .true()                  // Must be true
  .false()                 // Must be false
  .equals(true)            // Must equal value
  .notEquals(false)        // Must not equal value
  .transform()             // Transform strings/numbers to boolean
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
  .enum([new Date("2024-01-01"), new Date("2024-12-31")]) // Must be one of dates
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

### Custom Validations
```ts title="validation/superString.ts"
// deno-lint-ignore-file no-explicit-any
import { FailedMessage, StringZod, YelixInput } from '@murat/yelix';

class SuperString extends StringZod {
  override input: YelixInput;

  constructor() {
    const input = new YelixInput();
    super(input);

    this.input = input;
  }

  isUserID(failedMessage?: FailedMessage): this {
    this.addRule(
      'isUserID',
      null,
      (value: any) => ({
        isOk:
          value && typeof value === 'string'
            ? value.startsWith('user_')
            : false,
      }),
      failedMessage
        ? failedMessage
        : 'User ID must start with "user_"',
    );
    return this;
  }
}

const superString = () => new SuperString();

export { SuperString, superString };
```

```ts title="hello.ts"
import { Ctx, ValidationType } from "jsr:@murat/yelix";
import { superString } from "../validation/customValidation.ts";

export async function GET(ctx: Ctx) {
  const requestData = ctx.get('dataValidation').user;
  const { name } = requestData.query;
  return await ctx.text(`Hello, ${name}!`, 200);
}

export const path = '/api/customValidation';
export const middlewares = ['dataValidation'];

export const validation: ValidationType = {
  query: {
    userId: superString().trim().isUserID(),
  }
};
```

## Things To Consider

#### Number validation in query

When validating numbers in query parameters, you can use the `toNumber()` method to convert the string to a number. This is useful for cases where you expect a number but receive it as a string in the query.

```ts
inp()
  .string()
  .toNumber() // Convert string to number but float is allowed
  .integer()  // Only allow integers
  .min(1)     // Minimum value
```

#### Validation Context Differences (query, body, formData)

Understanding how validation works across different contexts is crucial:

- **query**: Uses direct object notation for URL parameters
- **body**: Requires `inp().object()` wrapper since it handles JSON payloads
- **formData**: Uses direct object notation for form data fields

```ts
export const validation: ValidationType = {
  query: {},
  // highlight-next-line
  body: inp().object({ }),
  formData: {}
}
```

## Complete Example

```ts
export const validation: ValidationType = {
  query: {
    page: inp().string().toNumber().integer().min(1).optional(),
    limit: inp().string().toNumber().integer().range(1, 100),
    type: inp().string().enum(["user", "admin", "guest"]),
    userId: inp().string().toNumber().enum([1, 2, 3, 4, 5])
  },
  body: inp().object({
    username: inp().string().min(3).max(255),
    email: inp().string().email(),
    age: inp().number().range(18, 99),
    acceptTerms: inp().boolean().true(), 
    profile: inp().object({
      bio: inp().string().max(1000).optional(),
      interests: inp().array().every(inp().string()).max(10),
      isPublic: inp().boolean().optional()
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