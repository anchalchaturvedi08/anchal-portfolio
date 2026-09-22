/**
 * Builds a self-contained folder for cPanel "Setup Node.js App":   npm run build:cpanel
 *
 *   deploy/
 *     server.js      the whole API compiled into one CommonJS file
 *     package.json   only the libraries server.js actually imports
 *     dist/          the built website
 *
 * Upload the contents of deploy/ to the Node app's folder, then "Run NPM Install".
 */
import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "deploy");
const require = createRequire(path.join(root, "package.json"));

if (!existsSync(path.join(root, "dist", "index.html"))) {
  console.error('No built site found. Run "npm run build" first (build:cpanel does this for you).');
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Bundle our own code; leave npm packages external so cPanel installs them normally.
const result = await build({
  entryPoints: [path.join(root, "server/src/standalone.ts")],
  outfile: path.join(out, "server.js"),
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  packages: "external",
  metafile: true,
  logLevel: "warning",
});

// Work out which packages the bundle really imports, and pin the installed versions.
const imported = new Set();
for (const input of Object.values(result.metafile.inputs)) {
  for (const imp of input.imports) {
    if (!imp.external || imp.path.startsWith("node:")) continue;
    const name = imp.path.startsWith("@") ? imp.path.split("/").slice(0, 2).join("/") : imp.path.split("/")[0];
    imported.add(name);
  }
}
const builtins = new Set(require("node:module").builtinModules);
const dependencies = {};
for (const name of [...imported].sort()) {
  if (builtins.has(name)) continue;
  // Read package.json from disk: some packages' "exports" forbid require("x/package.json").
  const pkgFile = ["", "server", "client"]
    .map((dir) => path.join(root, dir, "node_modules", name, "package.json"))
    .find((file) => existsSync(file));
  if (!pkgFile) {
    console.error(`Cannot find installed package "${name}". Run "npm install" and try again.`);
    process.exit(1);
  }
  dependencies[name] = JSON.parse(readFileSync(pkgFile, "utf8")).version;
}

writeFileSync(
  path.join(out, "package.json"),
  JSON.stringify(
    {
      name: "anchal-portfolio",
      private: true,
      main: "server.js",
      engines: { node: ">=20" },
      dependencies,
    },
    null,
    2
  ) + "\n"
);

cpSync(path.join(root, "dist"), path.join(out, "dist"), { recursive: true });

console.log(`\ncPanel build ready in deploy/`);
console.log(`  server.js    ${(readFileSync(path.join(out, "server.js")).length / 1024).toFixed(0)} KB`);
console.log(`  package.json ${Object.keys(dependencies).length} dependencies: ${Object.keys(dependencies).join(", ")}`);
console.log(`  dist/        built website`);