import FS from 'fs';
import BaseBuild from './base-build';

class IosBuildProcess extends BaseBuild {
  appConfig: any;
  constructor({ appConfig, ...config }: any = {}) {
    super(appConfig, {
      ...config,
      rootClass: 'app-ios',
      target: 'ios',
    });
  }

  processHtml() {
    const scripToPRocess = this.processDefault();

    return new Promise((resolve, reject) => {
      FS.writeFile(this.config.indexHtml, scripToPRocess, 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('done');
        }
      });
    });
  }

  process() {
    return new Promise((resolve) => {
      this.processHtml().then(() => {
        resolve('done');
      });
    });
  }
}

export default IosBuildProcess;
