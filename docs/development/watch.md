---
sidebar_position: 1
---

# Watching Folder

Yelix supports watching a folder for changes. This is useful for development purposes, as it allows you to see changes in real-time without having to restart the server manually.
Yelix will automatically reload the server when it detects changes in the specified folder.

```ts title="main.ts"
import { Yelix } from 'jsr:@murat/yelix';
import * as path from 'jsr:@std/path@1.0.8';

async function main() {
  const currentDir = Deno.cwd();
  const API_Folder = path.join(currentDir, 'api');

  const app = new Yelix({
    // highlight-next-line
    watchDirectory: API_Folder,
    environment: 'dev',
    serverPort: 3030,
  });

  await app.loadEndpointsFromFolder(API_Folder);

  app.serve();
}

await main();
```

### Output

```js title="Terminal"

  Hi there! Welcome to Yelix                                                                    
  I'm the maintainer of this project, and if you use Yelix for an open-source project.          
  I would love to review your codebase and analyze where I can improve it.                      
  Please Submit an issue on the GitHub repository with the title "Used Yelix in my project"     
  To not get this message again, set the `noWelcome` option to true in the Yelix constructor.   
                                                                                                

   𝕐 Yelix  0.1.32
   - Local       :   http://localhost:3030
   - Watching    :   ./api
   - Environment :   dev

⊚ [modify] \hello.ts
╓  Restarting server...
╙  Server restarted successfully in 12 ms (+200ms debounce)
```

### When to Use It

For an example you have an mongodb connection that averagely takes 40 seconds to connect, because that is my problem too, if you wanna reload your endpoints but not other files. You can use the `watchDirectory` option to watch a specific folder. This way, you can reload your endpoints without having to restart the server completely. This is useful for development purposes, as it allows you to see changes in real-time without having to restart the server manually.

But you can't use Deno's `--watch` flag with `watchDirectory`, because it will not work as expected. So you have to use the `watchDirectory` option instead.

```python
# Remove the --watch flag from the command line
# deno run --watch --allow-net --allow-read --allow-env ./main.ts

  deno run --allow-net --allow-read --allow-env ./main.ts

```
