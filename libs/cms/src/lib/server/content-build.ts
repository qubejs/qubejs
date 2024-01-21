import fs from 'fs';
import path from 'path';
import ContentServer from './content-server';

class StaticContentBuilder {
  options: any;
  serverConfig: any;
  contentServer: any;
  constructor({ serverConfig, ...options }: any = {}) {
    this.options = options;
    this.serverConfig = serverConfig;
    this.contentServer = new ContentServer(this.serverConfig);
    this.validate();
  }

  validate() {}

  writeFileSync(targetFolder, filename, data) {
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
    }
    fs.writeFileSync(`${targetFolder}/${filename}`, data);
  }

  readFileSync(source, target) {
    const ops = [];
    let contentPath = '';
    if (source.substr(source.lastIndexOf('/')) === '/index.yaml') {
      contentPath = source.substr(0, source.lastIndexOf('/'));
    } else if (source.substr(source.lastIndexOf('.')) === '.yaml') {
      contentPath = source.substr(0, source.lastIndexOf('.'));
      target = `${target}${contentPath.substr(contentPath.lastIndexOf('/'))}`;
    }
    console.log(`@target:`, target);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }
    contentPath = contentPath.replace(this.serverConfig.contentPath, '');
    contentPath =
      contentPath.charAt(0) === '/' ? contentPath.substring(1) : contentPath;
    ops.push(
      this.contentServer.getPageContent(contentPath).then((data) => {
        this.writeFileSync(`${target}`, 'index.html', data.data);
      })
    );
    ops.push(
      this.contentServer.getPageDataForUi(contentPath).then((data) => {
        this.writeFileSync(
          `${target}`,
          'get.json',
          JSON.stringify({
            status: 'success',
            data: data,
          })
        );
      })
    );
    console.log('--->>>>>>');
    console.log(contentPath);
    console.log('<<<<<<---');
    return Promise.all(ops);
  }
  readFolderRecursiveSync(
    source,
    target,
    ignore = [
      'node_modules',
      'coverage',
      '.storybook',
      '.nyc_output',
      'package-lock.json',
    ],
    ignoreFolder?
  ) {
    const that = this;
    const ops = [];
    if (!fs.existsSync(source)) {
      return false;
    }
    let files = [];
    if (ignore.indexOf(path.basename(source)) > -1) {
      return false;
    }
    console.log('@@base:' + path.basename(source));
    console.log('@@target:' + target);
    // Check if folder needs to be created or integrated
    const targetFolder = path.join(
      target,
      path.basename(source) === ignoreFolder ? '' : path.basename(source)
    );
    console.log('targetFolder:' + targetFolder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
      files = fs.readdirSync(source);
      files.forEach(function (file) {
        const curSource = path.join(source, file);
        if (fs.lstatSync(curSource).isDirectory()) {
          ops.push(that.readFolderRecursiveSync(curSource, targetFolder));
        } else {
          if (ignore.indexOf(path.basename(curSource)) === -1) {
            ops.push(that.readFileSync(curSource, targetFolder));
          }
        }
      });
    }
    return Promise.all(ops);
  }

  buildEnvConfig(target) {
    const buildAppConfig = {
      ...this.serverConfig.appConfig,
      siteMap: this.serverConfig.siteConfig,
      siteMode: 'static',
    };
    const envFolder = `${target}/env`;
    if (!fs.existsSync(envFolder)) {
      fs.mkdirSync(envFolder);
    }
    fs.writeFileSync(
      `${target}/env/app-config.js`,
      `window.APP_CONFIG = ${JSON.stringify(buildAppConfig)};`
    );
  }

  buildNavigation(target) {
    const buildAppConfig = {
      data: {
        navigation:
          this.serverConfig.siteConfig.siteMap.globalNavigationLoggedIn
            .navigation,
      },
      status: 'success',
    };
    const envFolder = `${target}/env`;
    if (!fs.existsSync(envFolder)) {
      fs.mkdirSync(envFolder);
    }
    fs.writeFileSync(
      `${target}/env/sitemap.json`,
      `${JSON.stringify(buildAppConfig)}`
    );
  }

  build() {
    const ops = [];
    console.log('building content');
    console.log(this.serverConfig.contentPath);
    this.buildEnvConfig(this.options.output);
    this.buildNavigation(this.options.output);
    ops.push(
      this.readFolderRecursiveSync(
        this.serverConfig.contentPath,
        this.options.output,
        undefined,
        this.options.ignoreFolder
      )
    );

    return Promise.all(ops);
  }
}

export default StaticContentBuilder;
