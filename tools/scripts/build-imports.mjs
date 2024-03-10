import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
// import { ArgsReader } from '@quebjs/scripts';
import paths, { resolveApp } from './paths.mjs';
// var packageJson = require('../package.json');
// var args = new ArgsReader().get();
// import { ScssBuilder } from '../../dist/libs/scripts';

function createImports(
  source,
  ignore = [
    'Loading',
    'node_modules',
    'coverage',
    '.storybook',
    '.nyc_output',
    'package-lock.json',
  ]
) {
  if (!fs.existsSync(source)) {
    return;
  }
  var files = [];
  if (ignore.indexOf(path.basename(source)) > -1) {
    return;
  }
  var imports = [];
  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (
        fs.lstatSync(curSource).isDirectory() &&
        ignore.indexOf(path.basename(curSource)) === -1
      ) {
        const ComponentName = path.relative(resolveApp(source), curSource);
        imports.push(
          `export {default as ${ComponentName} } from './${ComponentName}';`
        );
      }
    });
  }
  return imports.join('\n');
}

function createDynamicImport(
  source,
  ignore = [
    'Loading',
    'node_modules',
    'coverage',
    '.storybook',
    '.nyc_output',
    'package-lock.json',
  ]
) {
  if (!fs.existsSync(source)) {
    return;
  }
  var files = [];
  if (ignore.indexOf(path.basename(source)) > -1) {
    return;
  }
  var imports = [];
  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    if (files.length > 0) {
      imports.push(`import React from 'react';
import Loading from './components/Loading';`);
    }
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (
        fs.lstatSync(curSource).isDirectory() &&
        ignore.indexOf(path.basename(curSource)) === -1
      ) {
        const ComponentName = path.relative(resolveApp(source), curSource);
        imports.push(
          `const ${ComponentName}Comp = React.lazy(() => import('./${path.relative(
            resolveApp(process.argv[2]),
            curSource
          )}'));

const ${ComponentName} = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <${ComponentName}Comp {...props} />
    </React.Suspense>
);
};`
        );
      }
    });
  }
  return imports.join('\n');
}

function createExport(
  source,
  ignore = [
    'node_modules',
    'coverage',
    '.storybook',
    '.nyc_output',
    'package-lock.json',
  ]
) {
  if (!fs.existsSync(source)) {
    return;
  }
  var files = [];
  if (ignore.indexOf(path.basename(source)) > -1) {
    return;
  }
  var imports = [];
  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    if (files.length > 0) {
      imports.push(`const components = {`);
    }
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (
        fs.lstatSync(curSource).isDirectory() &&
        ignore.indexOf(path.basename(curSource)) === -1
      ) {
        const ComponentName = path.relative(resolveApp(source), curSource);
        imports.push(`  ${ComponentName},`);
      }
    });
    if (files.length > 0) {
      imports.push(`};
export { components };`);
    }
  }
  return imports.join('\n');
}

var folders = ['components', 'containers', 'templates'];
if (!process.argv[2]) {
  throw 'Path is required';
} else {
  console.log(`target proccessng: ${resolveApp(process.argv[2])}`);
}
var targetFolder = `${resolveApp(process.argv[2])}`;

folders.forEach((folProcess) => {
  var plainImports = createImports(
    `${resolveApp(process.argv[2])}/${folProcess}`
  );
  var imports = createDynamicImport(
    `${resolveApp(process.argv[2])}/${folProcess}`
  );
  var exports = createExport(`${resolveApp(process.argv[2])}/${folProcess}`);

  const output = imports && exports ? [imports, exports].join('\n') : '';
  plainImports && fs.writeFileSync(`${targetFolder}/${folProcess}/index.tsx`, plainImports);
  output && fs.writeFileSync(`${targetFolder}/${folProcess}.lazy.tsx`, output);
});
console.log(chalk.cyan('-> build import done'));

// new ScssBuilder({
//   webSrc: aprocess.argv[2],
// }).process();
