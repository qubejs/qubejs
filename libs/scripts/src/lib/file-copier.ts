import fs from 'fs';
import path from 'path';

class FileCopier {
  config: any;
  constructor({ ...config }: any = {}) {
    if (!config.webSrc) {
      throw 'webSrc is required to process';
    }
    this.config = { ...config };
  }

  copyFolderRecursiveSync(
    source,
    target = '.scss',
    preFix,
    ignore = [
      'node_modules',
      'coverage',
      '.storybook',
      '.nyc_output',
      'package-lock.json',
    ],
    createFolder = true
  ) {
    if (!fs.existsSync(source)) {
      return undefined;
    }
    let files = [];
    if (ignore.indexOf(path.basename(source)) > -1) {
      return undefined;
    }
    const imports = [];
    // Copy
    if (fs.lstatSync(source).isDirectory()) {
      files = fs.readdirSync(source);
      files.forEach((file) => {
        const curSource = path.join(source, file);
        if (fs.lstatSync(curSource).isDirectory()) {
          imports.push(this.copyFolderRecursiveSync(curSource, target, preFix));
        } else {
          if (
            path.extname(curSource) === target &&
            ignore.indexOf(path.basename(curSource)) === -1
          ) {
            imports.push(
              `${this.config.importPrefix}${path.relative(
                this.config.webSrc,
                curSource
              )}";`
            );
          }
        }
      });
    }
    return imports.join('\n');
  }
}

export default FileCopier;
