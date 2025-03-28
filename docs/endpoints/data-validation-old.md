---
sidebar_position: 99
---

# Data Validation (Zod - Deprecated)

This data validation is came built-in with Yelix. It uses [Zod](https://zod.dev/).

## Initial Setup

Data Validation is built-in but by default it is not set. You need to set it in your main file.

```ts title="main.ts"
import { Yelix, requestDataValidationMiddleware } from 'jsr:@murat/yelix';

export async function startServer() {
  const app = new Yelix();

  // highlight-next-line
  app.setMiddleware('dataValidation', requestDataValidationMiddleware);

  app.serve();
}

await startServer();

```

## Query Parameters

```ts title="hello.ts"
import { Ctx, ValidationType } from "jsr:@murat/yelix";
import { z } from "npm:zod@^3.24.1";

export async function GET(ctx: Ctx) {
  // highlight-start
  const requestData = ctx.get('dataValidation').user;
  const query: QueryType = requestData.query;
  // highlight-end

  return await ctx.text('Hello, ' + query.name, 200);
}

export const path = '/api/hello';
// highlight-next-line
export const middlewares = ['dataValidation'];

// highlight-start
export const validation: ValidationType = {
  query: {
    name: z.string(),
  },
};
const querySchema = z.object(validation.query as z.ZodRawShape);
type QueryType = z.infer<typeof querySchema>;
// highlight-end
```

## Body Parameters

```ts title="hello.ts"
import { Ctx, ValidationType } from "jsr:@murat/yelix";
import { z } from "npm:zod@^3.24.1";

export async function POST(ctx: Ctx) {
  // highlight-start
  const requestData = ctx.get('dataValidation').user;
  const { 
    fullname,
    username,
    email,
    password,
  }: BodyType = requestData.body;
  // highlight-end

  return await ctx.text('Hello, ' + fullname, 200);
}

export const path = '/api/hello';
// highlight-next-line
export const middlewares = ['dataValidation'];

// highlight-start
export const validation: ValidationType = {
  body: z.object({
    fullname: z.string().min(3).max(255),
    username: z
      .string()
      .min(3)
      .max(255)
      .refine((value) => !/@/.test(value), {
        message: 'Username should not contain @',
      })
      .refine((value) => !/\s/.test(value), {
        message: 'Username should not contain whitespace',
      })
      .refine((value) => value === value.toLowerCase(), {
        message: 'Username should be lowercase',
      }),
    email: z.string().email(),
    password: z.string().min(8).max(255),
  }),
};
type BodyType = z.infer<typeof validation.body>;
// highlight-end
```