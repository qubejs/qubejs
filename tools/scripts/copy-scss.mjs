import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { resolveApp } from './paths.mjs';

function copyFolderRecursiveSync(source, target = '.scss', targetFolder, ignore = ['node_modules', 'coverage', '.storybook', '.nyc_output', 'package-lock.json'], createFolder = true) {
    if (!fs.existsSync(source)) {
    return;
  }
  let files = [];
  if (ignore.indexOf(path.basename(source)) > -1) {
    return;
  }
  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      let curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, target, targetFolder);
      } else {
        if (path.extname(curSource) === target && ignore.indexOf(path.basename(curSource)) === -1) {
          const targetPath = path.relative(resolveApp(process.argv[2]), curSource);
        //   console.log(curSource)
        //   console.log(`>>`)
        //   console.log(`${targetFolder}/${targetPath}`)
          copyFileSync(curSource, `${targetFolder}/${targetPath}`);
          // `@import "../../${path.relative(paths.appSrc, curSource)}";`;
        }
      }
    });
  }
}

function ensureDirectoryExistence(filePath) {
    // console.log(filePath);
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function copyFileSync(source, target) {
  let targetFile = target;
  ensureDirectoryExistence(target);
  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

let folders = ['components', 'styles', 'containers', 'templates'];

let targetFolder = `${resolveApp(process.argv[3])}/src`;

folders.forEach((folProcess) => {
  copyFolderRecursiveSync(`${resolveApp(process.argv[2])}/${folProcess}`, '.scss', targetFolder);
});
console.log(chalk.cyan('-> copy scss done'))
