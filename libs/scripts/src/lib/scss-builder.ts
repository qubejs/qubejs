import fs from 'fs';
import FileCopier from './file-copier';
import chalk from 'chalk';

class ScssBuildProcess extends FileCopier {
  constructor({
    foldersToProcess = ['components', 'containers', 'templates'],
    importPrefix = '@import "../../',
    targetFolder = '/styles/application',
    targetExt = '.scss',
    targetPrefix = '../../',
    webSrc,
    ...config
  }: any = {}) {
    super({
      foldersToProcess,
      importPrefix,
      targetFolder,
      targetPrefix,
      targetExt,
      webSrc,
      ...config,
    });
  }

  process() {
    this.config.foldersToProcess.forEach((folProcess) => {
      const output = this.copyFolderRecursiveSync(
        `${this.config.webSrc}/${folProcess}`,
        this.config.targetExt,
        this.config.targetPrefix
      );
      fs.writeFileSync(
        `${this.config.webSrc}${this.config.targetFolder}/${folProcess}.scss`,
        output || ''
      );
    });
    console.log(chalk.cyan('-> build scss done'));
  }
}

export default ScssBuildProcess;
