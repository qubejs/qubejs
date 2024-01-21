import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
// import ArgsReader from './args-reader';
import paths from './paths.mjs';
// var packageJson = require('../package.json');
// var args = new ArgsReader().get();
// import { ScssBuilder } from '../../dist/libs/scripts';

function copyFolderRecursiveSync(source, target = '.scss', preFix, ignore = ['node_modules', 'coverage', '.storybook', '.nyc_output', 'package-lock.json'], createFolder = true) {
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
      if (fs.lstatSync(curSource).isDirectory()) {
        imports.push(copyFolderRecursiveSync(curSource, target, preFix));
      } else {
        if (path.extname(curSource) === target && ignore.indexOf(path.basename(curSource)) === -1) {
          imports.push(`@import "../../${path.relative(paths.webreactSrc, curSource)}";`);
        }
      }
    });
  }
  return imports.join('\n');
}

var folders = ['components', 'containers', 'templates'];

var targetFolder = `${paths.webreactSrc}/styles/application`;

folders.forEach((folProcess) => {
  var output = copyFolderRecursiveSync(`${paths.webreactSrc}/${folProcess}`, '.scss', '../../');
  fs.writeFileSync(`${targetFolder}/${folProcess}.scss`, output);
});
console.log(chalk.cyan('-> build scss done'))

// new ScssBuilder({
//   webSrc: paths.webreactSrc,
// }).process();
