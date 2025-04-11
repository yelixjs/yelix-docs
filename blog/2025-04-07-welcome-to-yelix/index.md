---
slug: introduction-to-yelix
title: Introduction To Yelix
authors: [murat]
tags: [yelix, v0.1.*]
---

# Why I’m Building Yelix — A Backend Framework That Fights for You

Let's meet with Yelix which a powerful backend framework for Deno that automates validation, OpenAPI docs, and observability. Say goodbye to boilerplate—build secure, documented APIs with confidence. Learn why Yelix is the future of backend development...
<!-- truncate -->

Every few years, I find myself writing the same backend boilerplate: 
- Data validation with Zod or some wrapper  
- OpenAPI docs manually or half-generated  
- Debugging middleware  
- Watching request logs  
- Writing some catch-all error handler  
- Tying it all together with express, oak, hono, whatever is trending that year  

After the 100th time, I thought: _It should automatic?!_

So I started building **Yelix**, At first it was just for me.

---

## What is Yelix?

Yelix is a backend web framework built on top of **Hono** for **Deno**. But it’s more than just a wrapper.

Yelix:
- Validates everything (queries, body, FormData, files, responses)
- Generates OpenAPI 3.1 docs automatically
- [WIP](https://github.com/yelixjs/yelix/issues/25) Has strict response validation (yes, that means your API can’t accidentally leak internal data)
- Is built with DX (Developer Experience) in mind — HMR, endpoint tracing, real-time request logs
- Comes with optional **Yelix Cloud** for full backend observability

It’s batteries-included but **unobtrusive**.

<details>
<summary>The meaning,</summary>
> Yelix gives you a lot by default, but it stays out of your way.
</details>

---

## Validation That Has Your Back

Validation is the first place where backend bugs (and leaks) are born. So Yelix bakes it in completely.

You define your schema once. Yelix handles:
- Input validation (query/body/files/FormData)
- File constraints (max size, count, MIME types, required or optional)
- [WIP](https://github.com/yelixjs/yelix/issues/25) **Response validation** — a strict mode that ensures your API _never_ returns fields you didn’t explicitly allow

<details>
<summary>Panera Bread API Leak - Look how dangerous unintended data exposure can be</summary>
> The recent reported data leak at Panera Bread potentially exposed the personal information of anyone who had ever signed up for an account on the company's site.[1] The vulnerability that caused the data leak was related to APIs on the Panera site.[1] **The data exposed included** the full legal name, username, email address, home address, **loyalty card number, credit card number (last four digits)**, dietary preferences, phone number and whether or not the person was part of an organization.[2] The fix should not have been very complicated.[3] At least that many customers were exposed. [2]. The larger issue with these kinds of APIs is that they need to be secured using an approach that covers the entire API. [4]

[1,2,3,4]: https://duo.com/decipher/how-a-researcher-found-the-panera-data-leak \
[1]: Opening paragraph \
[2]: Houlihan’s fifth answer \
[3]: Houlihan’s fourth answer \
[4]: Houlihan’s sixth answer
</details>

---

## 📘 OpenAPI Docs… Without the Pain

Every endpoint in Yelix is introspected, and your validation schemas are translated directly into OpenAPI 3.1.

That means:
- Zero manual doc maintenance
- Instantly view your API in Swagger, Redoc, Scalar, or Stoplight

If you’re tired of keeping docs in sync with your code — Yelix fixes that by design.

---

## 🧰 Dev Tools That Make You Smile

Yelix ships with tools that I wish every framework had:
- **Watch**: Write code → restart program -> serve
- **HMR**: Write code → restart server → serve

<details>
<summary>Why HMR is Better for Yelix</summary>

1. **Faster Development Workflow**  
   HMR significantly speeds up the development process. Instead of restarting the entire server, only the changed modules are updated. This means you don’t have to wait for a full restart each time you make a change, resulting in quicker iteration times.

2. **State Preservation**  
   With HMR, the server and application state are preserved during code changes. This is particularly useful when developing features that require state persistence, reducing the need to reinitialize or reload the app for each change.

3. **Improved Developer Experience**  
   HMR allows developers to see live updates instantly without losing context. This makes debugging and testing more efficient, as you can interact with the app in real time and instantly observe the effects of your code changes.

4. **Less Overhead**  
   Full server restarts (as seen with the Watch feature) come with added overhead, as everything needs to reload. With HMR, only the necessary parts are reloaded, which reduces the computational burden and makes the process more resource-efficient.

5. **Ideal for Large Projects**  
   HMR is especially beneficial for larger projects where full restarts can become a bottleneck. It allows developers to focus on smaller, incremental changes without waiting for the entire environment to reset.

6. **Better Scalability**  
   HMR can scale better with projects that are continuously growing. As the codebase expands, the need to refresh the entire application lessens, making it easier to handle large applications and keep the development speed consistent.

7. **Real-Life Example**  
   Before the HMR feature came, we were using watch and my mongodb connection took 7-16 seconds, the rest of the processes were relatively fast. waiting for a db connection hundreds of times a day can be frustrating. I am currently using hmr and it takes about 12 milliseconds just to refresh the modules. I can’t even feel the difference between a refresh and a save. It’s like magic.

</details>
- **Static endpoint generation**: Perfect for **Deno Deploy** or other edge platforms because _Dynamic Imports are not supported in Deno Deploy._  
  - **Why?**: Deno Deploy is a serverless platform that runs your code in a distributed environment. It doesn't support dynamic imports because they can introduce unpredictability and complexity in a serverless context. Static imports, on the other hand, are resolved at compile time, making them more efficient and predictable for serverless deployments.
  - **How?**: Yelix generates static endpoints by analyzing your code at dev time even HMR, ensuring that all necessary modules are included without relying on dynamic imports.
- **Debug mode**: If a route fails, you get dev-friendly insights before your logger even kicks in

---

## ☁️ Yelix Cloud (Coming Soon)

This is where things get exciting.

Yelix Cloud will plug into your app and give you:
- Request observability: See who’s calling what, and when
- Performance metrics: Route-level breakdowns
- Error monitoring: Tracebacks with context
- OpenAPI conformance analysis: Catch undocumented endpoints or mismatched responses
- Duplicate endpoint detection: Save your team from inconsistent API design

> Basically, think of it like Sentry + Postman + SwaggerHub, but tailor-made for your own app. Also I have power to track better your app since I am the owner of Yelix.

---

## 🚀 Performance Benchmarks

Performance matters, especially at scale. We've benchmarked Yelix against popular frameworks in both Deno and Node.js environments.

### Request Throughput (higher is better)

| Framework    | Environment | Requests/sec   | 
|--------------|-------------|----------------|
| Hono         | Deno        | 39,545         |
| **Yelix**    | **Deno**    | **37,132**     |
| Fastify      | Node.js     | 32,504         |
| Oak          | Deno        | 24,212         |
| Express.js   | Node.js     | 8,683          |

### Response Time (lower is better)

| Framework    | Environment | Avg Response   | Median Response | p95 Response |
|--------------|-------------|----------------|----------------|--------------|
| Hono         | Deno        | 3.08ms         | 2.61ms         | 5.81ms       |
| **Yelix**    | **Deno**    | **3.28ms**     | **2.68ms**     | **6.18ms**   |
| Fastify      | Node.js     | 3.77ms         | 3.40ms         | 9.94ms       |
| Oak          | Deno        | 5.07ms         | 4.34ms         | 9.24ms       |
| Express.js   | Node.js     | 14.33ms        | 12.14ms        | 25.27ms      |

The data shows Yelix performs almost on par with raw Hono (which it's built on) while adding significant functionality. Both significantly outperform Express.js and are competitive with Fastify, a framework known for its speed.

If you think _hey, response time is a bit high_, do not forget that Yelix handled over 4.5M requests in 2.5 minute.

All benchmarks were run with identical scenarios:
- 100 virtual users with constant load for 1 minute
- Stress test scaling from 1 to 200 VUs for 1 minute
- Smooth ramp-down to 0 VUs for 30 seconds
- Simple text response endpoint

---

## Why Yelix?

Because writing backends shouldn’t feel like writing infrastructure.  
Because validation, docs, observability, and DX shouldn’t be afterthoughts.  
Because you deserve to ship secure, documented, and observable APIs without losing momentum.

Yelix is still evolving, but the core idea is solid:  
**Less config, more confidence.**

If that resonates with you, I’d love your feedback or contributions.  

Stay with Yelix, stay happy! \
_and enjoy the comfort of being able to deploy on Friday._
