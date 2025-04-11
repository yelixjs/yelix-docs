---
sidebar_position: 1
---

# OWASP OFFAT

#### About Supportify

Yelix is fully supports [OWASP OFFAT](https://github.com/OWASP/OFFAT) (OFFensive Api Tester) which was created to automatically test API for common vulnerabilities after generating tests from openapi specification file. It provides feature to automatically fuzz inputs and use user provided inputs during tests specified via YAML config file.

> OWASP OFFAT is highly recommended from Yelix team to use for security testing of your APIs. 

## Security Checks

- Restricted HTTP Methods
- SQLi
- BOLA
- Data Exposure
- BOPLA / Mass Assignment
- Broken Access Control
- Basic Command Injection
- Basic XSS/HTML Injection test

## Features

- Few Security Checks from OWASP API Top 10
- Automated Testing
- User Config Based Testing
- API for Automating tests and Integrating Tool with other platforms/tools
- CLI tool
- Dockerized Project for Easy Usage
- Open Source Tool with MIT License

## Usage

You should install Python to run this tool. You can install it from [here](https://www.python.org/downloads/).

Then put this script to your `deno.json` file:

```json
{
  "tasks": {
    "offat:dev": "pip install --quiet offat || true && python -m offat -f http://localhost:3030/yelix-openapi-raw",
    "offat:prod": "pip install --quiet offat || true && python -m offat -f <YOUR_DOMAIN>/yelix-openapi-raw"
  }
}
```

If you use Yelix with defaults and working in localhost, your `<YOUR_DOMAIN>` &nbsp;is &nbsp;`http://localhost:3030`.

```python
# to run in development mode
deno task offat:dev

# to run in production mode
deno task offat:prod
```