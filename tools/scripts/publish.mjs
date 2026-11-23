/**
 * This is a minimal script to publish your package to the npm registry (via pnpm).
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import devkit from '@nx/devkit';
const { readCachedProjectGraph } = devkit;

function invariant(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

// Executing publish script: node path/to/publish.mjs {name} {version} [tag] [--dry-run]
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
// --dry-run packs and validates the package without uploading it.
const dryRun = process.argv.includes('--dry-run');
const [, , name, version, tag = 'next'] = process.argv.filter((a) => a !== '--dry-run');

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
invariant(
  version && validVersion.test(version),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`
);

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);

// Executor-based builds (@nx/js:tsc) expose options.outputPath; builds inferred by
// @nx/rollup/plugin (web-react, ui-*-base) only declare it in `outputs`.
const buildTarget = project.data?.targets?.build;
const outputFromOutputs = (buildTarget?.outputs || [])
  .map((o) => o.replace('{workspaceRoot}/', '').replace('{projectRoot}', project.data.root))
  .find((o) => !o.includes('{'));
const outputPath = buildTarget?.options?.outputPath || outputFromOutputs;
invariant(
  outputPath && existsSync(join(outputPath, 'package.json')),
  `Could not find the build output of project "${name}" (looked for "${outputPath}/package.json"). Run "nx run ${name}:dist" first.`
);

process.chdir(outputPath);

// Updating the version in "package.json" before publishing
try {
  const json = JSON.parse(readFileSync(`package.json`).toString());
  json.version = version;
  writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch (e) {
  console.error(`Error reading package.json file from library build output.`);
}

// Execute "pnpm publish" to publish.
// --no-git-checks: dist/ is git-ignored and releases are cut from tags, not a clean main checkout.
execSync(
  `pnpm publish --access public --tag ${tag} --no-git-checks${dryRun ? ' --dry-run' : ''}`,
  { stdio: 'inherit' }
);
