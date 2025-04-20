import { parseArgs } from 'jsr:@std/cli/parse-args';
import * as path from 'jsr:@std/path@1.0.8';

console.log('[resolveEndpoints] running at', new Date().toISOString());

async function walkDirectory(
  directoryPath: string,
  fileHandler: (args: { path: string; fileInfo: Deno.FileInfo }) => void
) {
  const fileInfo = await Deno.lstat(directoryPath);
  fileHandler({ fileInfo, path: directoryPath });

  if (fileInfo.isDirectory) {
    const entries = await Deno.readDir(directoryPath);
    for await (const entry of entries) {
      await walkDirectory(path.join(directoryPath, entry.name), fileHandler);
    }
  }
}

function getFolderFromArgs(): string {
  const args = parseArgs(Deno.args);
  const targetFolder = args.folder || args.f;

  if (!targetFolder) {
    console.error('Please provide a folder name using --folder or -f.');
    Deno.exit(1);
  }

  return targetFolder;
}

function getIsWatchFromArgs(): boolean {
  const args = parseArgs(Deno.args);
  return args.watch || args.w || false;
}

function generateImportStatement(filePath: string, basePath: string): string {
  const relativePath =
    '.' +
    filePath.replace(basePath, '').replaceAll('\\', '/').replaceAll('//', '/');
  return `  await import("${relativePath}"),\n`;
}

async function generateEndpointsFile() {
  const currentDir = Deno.cwd();
  const targetFolder = getFolderFromArgs();
  const rootPath = path.join(currentDir, targetFolder);

  let endpointsContent = '// deno-lint-ignore no-explicit-any\n' + 'const endpoints: any[] = [\n';

  await walkDirectory(rootPath, (file) => {
    const extension = path.extname(file.path);
    if (file.fileInfo.isFile && (extension === '.ts' || extension === '.js')) {
      endpointsContent += generateImportStatement(file.path, currentDir);
    }
  });

  endpointsContent += '\n];\nexport default endpoints;\n';
  await Deno.writeTextFile(
    path.join(currentDir, 'endpoints.ts'),
    endpointsContent
  );
}

async function watch() {
  console.log('[resolveEndpoints] watching for changes...');

  const watcher = Deno.watchFs(Deno.cwd());
  for await (const event of watcher) {
    const filePath = event.paths[0];
    const fileName = path.basename(filePath);
    if (event.kind === 'modify' && fileName !== 'endpoints.ts') {
      console.log('[resolveEndpoints] file modified', fileName);
      await generateEndpointsFile();
      console.log('[resolveEndpoints] generated endpoints.ts');
    }
  }
}

async function main() {
  await generateEndpointsFile();
  console.log('[resolveEndpoints] generated endpoints.ts');

  const isWatch = getIsWatchFromArgs();
  console.log('[resolveEndpoints] watch mode:', isWatch ? 'on' : 'off');

  if (isWatch) {
    await watch();
  }
}

main();
