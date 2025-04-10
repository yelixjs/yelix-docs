---
sidebar_position: 1
---

# Watching Folder

Yelix allows you to monitor a folder for changes, making it easier to develop applications. With this feature, you can see updates in real-time without manually restarting the server. When changes are detected in the specified folder, Yelix automatically reloads the server.

## How to Enable Watching

To enable folder watching, add the `--watch-hmr` flag to your `deno.json` file. This flag activates the watch mode for the folder.

```json
{
  "tasks": {
    "dev": "deno run --watch-hmr --allow-run --allow-net --allow-read --allow-write --allow-env main.ts"
  }
}
```

## Combining with Static Endpoint Generation (SEG)

Yelix works seamlessly with `Deno`, `Deno Deploy`, and `Hono`. However, since Deno Deploy does not support the `loadEndpointsFromFolder` function (due to its lack of dynamic import support), Yelix offers a feature called Static Endpoint Generation (SEG). This feature generates endpoints during development and is compatible with Hot Module Replacement (HMR).

### SEG Options

| Short Option   | Full Option                                 | Description                      | Default Value    |
| -------------- | ------------------------------------------- | -------------------------------- | ---------------- |
| `--yelix-seg`  | `--yelix-static-endpoint-generation`        | Folder to monitor for changes    | `./api`          |
| `--yelix-sego` | `--yelix-static-endpoint-generation-output` | File to save generated endpoints | `./endpoints.ts` |

### Using SEG

Here’s an example configuration for SEG:

```json
// DO NOT COPY, TASK SCRIPT SHOULD NOT INCLUDE NEWLINE
{
  "tasks": {
    "dev": "
      deno run
      --watch-hmr
      --allow-run --allow-net --allow-read --allow-write --allow-env
      main.ts
      --yelix-static-endpoint-generation ./api
      --yelix-static-endpoint-generation-output ./endpoints.ts"
  }
}
```

If you use the default folder (`./api`) or output file (`./endpoints.ts`), you can omit the `--yelix-static-endpoint-generation` flag, as the defaults will be applied automatically.

### How it looks in Yelix

```ts
import { Yelix, type OptionalAppConfigType } from 'jsr:@murat/yelix';
import endpoints from './endpoints.ts';

export async function main(config?: OptionalAppConfigType) {
  // Port is 3030 by default
  const yelixConfig: OptionalAppConfigType = {
    environment: 'dev',
  };

  const app = new Yelix(config || yelixConfig);

  // Old way to load endpoints from folder
  // await app.loadEndpointsFromFolder('./api');

  // New way to load endpoints from file
  app.loadEndpoints(endpoints);

  await app.serve();
  return app;
}

if (import.meta.main) {
  await main();
}
```

### Important Notes

- **File Watching**: The `--watch-hmr` flag enables file watching, allowing Yelix to detect changes in the specified folder and reload the server automatically.
- **Static Endpoint Generation**: The `--yelix-static-endpoint-generation` flag specifies the folder to monitor for changes, while the `--yelix-static-endpoint-generation-output` flag specifies the file where the generated endpoints will be saved.
- **Compatibility**: This feature is compatible with `Deno`, `Deno Deploy`, and `Hono`. However, the `loadEndpointsFromFolder` function is not supported in Deno Deploy due to its lack of dynamic import support. Instead, use the SEG feature to generate endpoints during development.
