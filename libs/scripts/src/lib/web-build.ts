import FS from 'fs';
import BaseBuild from './base-build';
import chalk from 'chalk';

class WebBuildProcess extends BaseBuild {
  appConfig: any;
  constructor({ appConfig = {}, ...config }: any = {}) {
    super(config);
    this.config = Object.assign(
      {
        urlAppConfig: true,
        host: '',
        indexHtml: '',
        scripts: '',
        publicUrl: '',
      },
      config
    );
    this.appConfig = appConfig;

    this.tags = {
      findLink: '<link',
      findScript: '<script',

      metaTags: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,

      scriptToInclude: `
        ${this.getAppConfig()}
       ${this.config.scripts}
      `,
    };
  }

  getAppConfig() {
    if (this.config.inlineAppConfig) {
      return `<script> window.APP_CONFIG = ${JSON.stringify(
        this.appConfig
      )}; </script>`;
    } else if (this.config.urlAppConfig) {
      return `<script src="env/app-config.js?_cb=${this.config.version}" ></script>`;
    }
    return '';
  }

  override insertContent(fullContent, beforeWhat, newContent) {
    // get the position before which newContent has to be added
    const position = fullContent.indexOf(beforeWhat);

    // since splice can be used on arrays only
    const fullContentCopy = fullContent.split('');
    fullContentCopy.splice(position, 0, newContent);

    return fullContentCopy.join('');
  }

  processHtml() {
    console.log(chalk.cyan('> processing html'));
    let data = FS.readFileSync(this.config.indexHtml, 'utf8');
    console.log(chalk.cyan('> removing local configuration'));
    data = this.removeContent(data, this.localTags.start, this.localTags.end);
    data = this.removeContent(data, this.localVars.start, this.localVars.end);
    console.log(chalk.cyan('> inserting meta'));
    const afterAddingMeta = this.insertContent(
      data,
      this.tags.findLink,
      this.tags.metaTags
    );
    console.log(chalk.cyan('> inserting scripts'));
    const afterAddingScript = this.insertContent(
      afterAddingMeta,
      this.tags.findScript,
      this.tags.scriptToInclude
    );

    return new Promise((resolve, reject) => {
      FS.writeFile(this.config.indexHtml, afterAddingScript, 'utf8', (err) => {
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

export default WebBuildProcess;
