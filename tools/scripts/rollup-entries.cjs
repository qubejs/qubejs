/**
 * Helpers for building libraries with one rollup entry per component, so consumers can do
 *   import Input from '@qubejs/ui-material-base/Input';
 * and only pull in that component (plus the shared chunks it depends on).
 */
const fs = require('fs');
const path = require('path');

const INDEX_FILES = ['index.tsx', 'index.ts', 'index.jsx', 'index.js'];
const IGNORE_DIRS = new Set(['__tests__', 'node_modules', 'styles', 'assets']);

/**
 * Collects { Name: absolutePathToIndex } for every sub-folder of `folders` that has an index file.
 * Earlier folders win when the same name exists in more than one folder.
 */
function folderEntries(srcDir, folders, { exclude = [], reserved = [] } = {}) {
  const entries = {};
  const taken = new Set(reserved);
  for (const folder of folders) {
    const dir = path.join(srcDir, folder);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, name);
      if (!fs.statSync(full).isDirectory()) continue;
      if (IGNORE_DIRS.has(name) || exclude.includes(name)) continue;
      const index = INDEX_FILES.map((f) => path.join(full, f)).find((f) =>
        fs.existsSync(f)
      );
      if (!index) continue;
      if (taken.has(name)) {
        console.warn(
          `[rollup-entries] skipping ${folder}/${name}: entry "${name}" already exists`
        );
        continue;
      }
      taken.add(name);
      entries[name] = index;
    }
  }
  return entries;
}

/** Maps { name: 'relative/file.tsx' } to absolute paths. */
function fileEntries(srcDir, map) {
  return Object.fromEntries(
    Object.entries(map).map(([name, file]) => [name, path.join(srcDir, file)])
  );
}

/**
 * Applies the per-entry output layout to a config returned by withNx:
 * entries go to `<name>.esm.js` at the package root, and shared code goes to `chunks/`.
 */
function applyOutputLayout(config) {
  const outputs = Array.isArray(config.output) ? config.output : [config.output];
  for (const output of outputs) {
    const ext = output.format === 'cjs' ? 'cjs' : 'esm';
    output.entryFileNames = `[name].${ext}.js`;
    output.chunkFileNames = `chunks/[name]-[hash].${ext}.js`;
    output.hoistTransitiveImports = false; // keep per-entry import graphs minimal
    output.generatedCode = { preset: 'es2015', constBindings: true };
  }
  return config;
}

/**
 * Rollup plugin that runs after Nx writes dist/package.json:
 *  - adds an `exports` entry for every rollup entry (./Input -> ./Input.esm.js)
 *  - writes `<name>/package.json` stubs so tools that ignore `exports`
 *    (TS moduleResolution "node", Jest, webpack 4) still resolve `pkg/<name>`.
 */
function perEntryExports({ outputPath, sideEffects }) {
  return {
    name: 'qubejs-per-entry-exports',
    writeBundle: {
      sequential: true,
      order: 'post',
      handler(_opts, bundle) {
        const pkgFile = path.join(outputPath, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
        const entries = Object.values(bundle)
          .filter((f) => f.type === 'chunk' && f.isEntry)
          .map((f) => ({ name: f.name, file: f.fileName }))
          .sort((a, b) => a.name.localeCompare(b.name));

        const exportsMap = {};
        const main = entries.find((e) => e.name === 'index');
        if (main) {
          exportsMap['.'] = {
            types: `./${main.file.replace(/\.js$/, '.d.ts')}`,
            import: `./${main.file}`,
            default: `./${main.file}`,
          };
        }
        for (const { name, file } of entries) {
          if (name === 'index') continue;
          const types = file.replace(/\.js$/, '.d.ts');
          exportsMap[`./${name}`] = {
            types: `./${types}`,
            import: `./${file}`,
            default: `./${file}`,
          };
          const stubDir = path.join(outputPath, name);
          fs.mkdirSync(stubDir, { recursive: true });
          fs.writeFileSync(
            path.join(stubDir, 'package.json'),
            JSON.stringify(
              {
                name: `${pkg.name}/${name}`,
                private: true,
                type: 'module',
                main: `../${file}`,
                module: `../${file}`,
                types: `../${types}`,
                ...(sideEffects !== undefined ? { sideEffects } : {}),
              },
              null,
              2
            ) + '\n'
          );
        }
        exportsMap['./package.json'] = './package.json';
        // keep deep imports (scss sources, assets) working as before
        exportsMap['./src/*'] = './src/*';
        exportsMap['./*'] = './*';

        pkg.exports = exportsMap;
        if (sideEffects !== undefined) pkg.sideEffects = sideEffects;
        fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n');
      },
    },
  };
}

module.exports = { folderEntries, fileEntries, applyOutputLayout, perEntryExports };
