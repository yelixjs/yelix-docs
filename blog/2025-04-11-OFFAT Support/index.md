---
slug: offat-support
title: OWASP OFFAT Support in Yelix
authors: [murat]
tags: [yelix, security, offat, owasp]
---

# Yelix Now Supports OWASP OFFAT - Automated API Security Testing Made Easy

Excited to announce that Yelix now fully supports [OWASP OFFAT](https://owasp.org/OFFAT/) (OFFensive Api Tester) for automated API security testing. Let's explore how this integration helps secure your APIs with minimal effort.
<!-- truncate -->

## What is OWASP OFFAT?

OFFAT is an open-source tool designed to automatically test APIs for common vulnerabilities using OpenAPI specifications. It's particularly powerful because it:
- Automatically generates tests from your OpenAPI spec
- Fuzzes inputs intelligently
- Supports custom test configurations via YAML
- Runs comprehensive security checks

## Why OFFAT + Yelix?

Since Yelix already generates OpenAPI specs automatically, adding OFFAT support creates a powerful security testing pipeline:

1. Write your Yelix endpoints
2. OpenAPI specs generate automatically
3. OFFAT tests your API using those specs
4. Discover vulnerabilities before deployment

## Security Checks Out of the Box

OFFAT tests for critical vulnerabilities including:
- SQL Injection
- Broken Object Level Authorization (BOLA)
- Unauthorized Data Exposure
- Mass Assignment Vulnerabilities
- Broken Access Control
- Command Injection
- XSS/HTML Injection

## Getting Started in 1 Minute

Add these tasks to your `deno.json`:

```json
{
  "tasks": {
    "offat:dev": "pip install --quiet offat || true && python -m offat -f http://localhost:3030/yelix-openapi-raw",
    "offat:prod": "pip install --quiet offat || true && python -m offat -f <YOUR_DOMAIN>/yelix-openapi-raw"
  }
}
```

Then run:
```bash
deno task offat:dev  # for development
deno task offat:prod # for production
```

> [Detailed Documentation](/docs/development/security/OFFAT)

## Why Automated Security Testing Matters

Remember the Panera Bread API leak? Sensitive customer data was exposed due to API vulnerabilities. With OFFAT integration, Yelix helps prevent such incidents by automatically testing for common security issues.

Stay secure with Yelix! 🛡️