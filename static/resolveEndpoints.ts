import { parseArgs } from "jsr:@std/cli/parse-args";
import * as path from "jsr:@std/path@1.0.8";

console.log("[resolveEndpoints] running at", new Date().toISOString());

async function walkDirectory(
  directoryPath: string,
  fileHandler: (args: { path: string; fileInfo: Deno.FileInfo }) => void,
) {
  const fileInfo = await Deno.lstat(directoryPath);
  fileHandler({ fileInfo, path: directoryPath });

  if (fileInfo.isDirectory) {
    const entries = await Deno.readDir(directoryPath);
    for await (const entry of entries) {
      await walkDirectory(`${directoryPath}\\${entry.name}`, fileHandler);
    }
  }
}

function getFolderFromArgs(): string {
  const args = parseArgs(Deno.args);
  const targetFolder = args.folder || args.f;

  if (!targetFolder) {
    console.error("Please provide a folder name using --folder or -f.");
    Deno.exit(1);
  }

  return targetFolder;
}

function getIsWatchFromArgs(): boolean {
  const args = parseArgs(Deno.args);
  return args.watch || args.w || false;
}

function generateImportStatement(filePath: string, basePath: string): string {
  const relativePath = "." + filePath
    .replace(basePath, "")
    .replaceAll("\\", "/")
    .replaceAll("//", "/");
  return `  await import("${relativePath}"),\n`;
}

async function generateEndpointsFile() {
  const currentDir = Deno.cwd();
  const targetFolder = getFolderFromArgs();
  const rootPath = path.join(currentDir, targetFolder);

  let endpointsContent = "const endpoints = [\n";

  await walkDirectory(rootPath, (file) => {
    if (file.fileInfo.isFile) {
      endpointsContent += generateImportStatement(file.path, currentDir);
    }
  });

  endpointsContent += "\n];\nexport default endpoints;\n";
  await Deno.writeTextFile(
    path.join(currentDir, "endpoints.ts"),
    endpointsContent,
  );
}

async function watch() {
  const isWatch = getIsWatchFromArgs();
  if (!isWatch) {
    return;
  }
  console.log("[resolveEndpoints] watching for changes...");

  const watcher = Deno.watchFs(Deno.cwd());
  for await (const event of watcher) {
    const filePath = event.paths[0];
    const fileName = path.basename(filePath);
    if (event.kind === "modify" && fileName !== "endpoints.ts") {
      console.log("[resolveEndpoints] file modified" ,fileName);
      generateEndpointsFile();
    }
  }
}

async function main() {
  await generateEndpointsFile();
  const isWatch = getIsWatchFromArgs();
  console.log("[resolveEndpoints] generated endpoints.ts");
  console.log("[resolveEndpoints] watch mode:", isWatch ? "on" : "off");
  
  if (!isWatch) {
    Deno.exit(0);
  }
  
  await watch();
}

main();
