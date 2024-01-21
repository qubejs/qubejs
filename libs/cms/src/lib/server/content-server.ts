import express from 'express';
import our_fse from 'fse';
import path from 'path';
import yaml from 'js-yaml';
import groupBy from 'lodash/groupBy';
import { utils, Response } from '@qubejs/core';
import PageBuilder from './builder/page-builder';
import { ContentRepository } from '../repositories/ContentRepository';

import pkgName from '../../../package.json';

class ContentServer {
  config: any;
  app: any;
  contentRepo: any;
  fse: any;
  rootContentPath: any;
  contentFolder: any;
  allSiteMaps: any;
  clientLibs: any;
  constructor(
    {
      fse = our_fse,
      dirname = `${process.cwd()}/node_modules/${pkgName.name}`,
      internalDevPath,
      ...options
    }: any = {},
    app?
  ) {
    if (__dirname) {
      dirname = internalDevPath || path.resolve(`${__dirname}/../../../`);
    }
    let cmsRootServer = dirname;
    cmsRootServer = utils.path.ensureSlashAtEnd(cmsRootServer);
    console.log(`root:${cmsRootServer}`);
    console.log(`root:client::${cmsRootServer}client`);
    this.config = Object.assign(
      {
        rootPath: cmsRootServer,
        rootClientPath: cmsRootServer + 'client',
        rootApp: '',
        appConfig: {},
        db: null,
        mode: 'development',
        srcPath: cmsRootServer,
        serverPath: '/content/*',
        clientServerPath: '/client/*',
        damAssets: '',
        userData: () => ({}),
        middleware: function (req, res, next) {
          next();
        },
      },
      options
    );
    this.app = app;
    this.config.rootPath = utils.path.ensureSlashAtEnd(this.config.rootPath);
    this.config.publicUrl = utils.path.ensureSlashAtEnd(this.config.appConfig.publicUrl) || '/';
    this.config.contentPath = utils.path.ensureSlashAtEnd(
      this.config.contentPath
    );
    if (this.config.db) {
      this.contentRepo = new ContentRepository({ db: this.config.db });
    }
    this.config.srcPath = utils.path.ensureSlashAtEnd(this.config.srcPath);
    this.rootContentPath = `${this.config.rootPath}content/`;
    this.config.rootApp = utils.path.ensureSlashAtEnd(this.config.rootApp);
    console.log(`rootApp:${this.config.rootApp}`);
    this.fse = fse;
    this.contentFolder = this.config.serverPath.substr(
      0,
      this.config.serverPath.lastIndexOf('/')
    );
    this.contentFolder = utils.path.ensureNoSlashAtEnd(this.contentFolder);
    console.log('content-folder' + this.contentFolder);
    this.clientLibs = cmsRootServer + 'client';
    this.allSiteMaps = {};
    this.searchSiteMaps();
  }

  getFileLocation(path) {
    const pathToSeach = [this.config.rootApp, this.config.rootPath];
    let filePath = path;
    path = utils.path.ensureNoSlashAtStart(path);
    let rootPath;
    let isFile = true;
    for (let i = 0; i < pathToSeach.length; i++) {
      const currentPath = pathToSeach[i];
      // console.log('>>checking' + currentPath);
      if (this.fse.existsSync(`${currentPath}${path}.yaml`)) {
        filePath = `${currentPath}${path}.yaml`;
        rootPath = currentPath;
        break;
      } else if (this.fse.existsSync(`${currentPath}${path}/index.yaml`)) {
        filePath = `${currentPath}${path}/index.yaml`;
        isFile = false;
        rootPath = currentPath;
        break;
      }
    }
    return { filePath, rootPath, isFile };
  }

  getFilePath(path) {
    const { filePath } = this.getFileLocation(path);
    return filePath;
  }

  searchSiteMaps() {
    const siteMaps = {};
    [this.rootContentPath, this.config.contentPath].forEach((path) => {
      console.log('searching site maps in:' + path);
      this.fse.readdir(path, (err, list) => {
        if (this.fse.existsSync(path)) {
          if (err) throw err;
          for (let i = 0; i < list.length; i++) {
            if (this.fse.existsSync(`${path}${list[i]}/sitemap.yaml`)) {
              console.log(`${path}${list[i]}/sitemap.yaml`);
              let contents;
              try {
                const fileContents = this.fse.readFileSync(
                  `${path}${list[i]}/sitemap.yaml`,
                  'utf8'
                );
                contents = yaml.loadAll(fileContents);
              } catch (ex) {
                contents = '';
              }
              if (contents) {
                siteMaps[list[i]] = contents[0];
                console.log('added site map:' + list[i]);
              }
            } else if (
              this.fse.existsSync(`${path}${list[i]}/site.config.js`)
            ) {
              console.log(`${path}${list[i]}/site.config.js`);
              let contents;
              try {
                const fileContents = import(`${path}${list[i]}/site.config.js`);
                contents = fileContents;
              } catch (ex) {
                contents = '';
              }
              if (contents) {
                siteMaps[list[i]] = contents;
                console.log('added site map:' + list[i]);
              }
            }
          }
        }
      });
    });
    this.allSiteMaps = siteMaps;
  }

  init() {
    this.app.get(
      this.config.serverPath,
      this.config.middleware,
      this.serveContent.bind(this)
    );
    this.app.post(
      this.config.serverPath,
      this.config.middleware,
      this.serveJson.bind(this)
    );
    console.log('initialing using publicUrl=' + this.config.publicUrl);
    this.app.use('/client', express.static(this.clientLibs));
    if (this.config.damAssets) {
      this.app.use('/dam', express.static(this.config.damAssets));
    }
    if (this.config.clientLibs) {
      this.app.use('/clientlibs', express.static(this.config.clientLibs));
    }
    this.app.use('/env/app-config.js', (req, res) => {
      res.send(` window.APP_CONFIG = ${JSON.stringify(this.config.appConfig)};`);
    });
  }

  mapVanity(config, options: any = {}) {
    Object.keys(config).forEach((key) => {
      let newKey;
      if (typeof config[key] === 'object') {
        newKey = config[key].target;
      } else {
        newKey = config[key];
      }
      if (!newKey.match(this.config.serverPath)) {
        this.app.use(`${newKey}`, (req, res) => {
          this.getPageContent(options.defaultPage).then((response: any) => {
            res.status(response.status).send(response.data);
          });
        });
      }
    });
  }

  getPageNode(node, path) {
    let foundNode;
    if (node && node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const childNode = node.children[i];
        if (
          !childNode.always &&
          childNode.children &&
          childNode.children.length > 0
        ) {
          foundNode = this.getPageNode(childNode, path);
          if (foundNode) {
            if (!foundNode.children) {
              foundNode = childNode;
            }
            break;
          }
        }
        // console.log(childNode.href + "==" + path);
        if (!childNode.always && childNode.href === path) {
          // console.log("matched =");
          // console.log(childNode);
          foundNode = childNode;
          break;
        } else if (
          (!childNode.always && childNode.href?.indexOf(path) > -1) ||
          path.indexOf(childNode.href) > -1
        ) {
          // console.log("matched index");
          foundNode = node;
        }
      }
    }
    // console.log("returning node" + foundNode);
    return foundNode;
  }

  getAllSiblings(path, isFile, url) {
    let folder;
    if (isFile) {
      folder = path.substr(0, path.lastIndexOf('/'));
      url = url.substr(0, url.lastIndexOf('/'));
    } else {
      folder = path;
    }

    const pages = [];
    if (this.fse.lstatSync(folder).isDirectory()) {
      this.fse.readdirSync(folder).forEach((file) => {
        if (
          !this.fse.lstatSync(`${folder}/${file}`).isDirectory() &&
          file !== 'index.yaml'
        ) {
          let contents;
          try {
            const fileContents = this.fse.readFileSync(
              `${folder}/${file}`,
              'utf8'
            );
            contents = yaml.loadAll(fileContents);
          } catch (ex) {
            contents = [];
          }
          if (contents.length > 0) {
            pages.push({
              path: url + '/' + file.replace('.yaml', ''),
              category: contents[0] && contents[0].category,
              title: contents[0] && contents[0].title,
            });
          }
        }
      });
    }
    // return pages;
    return {
      parentPath: url,
      pages: groupBy(pages, 'category'),
    };
  }

  serveJson(req, res) {
    this.getPageDataForUi(req.params['0']).then((data) => {
      res.status(200).send(new Response(data).success());
    });
    // setTimeout(() => {
    // }, 5000);
  }

  async getPageDataForUi(path) {
    const data: any = await this.getPageData(path);
    return Promise.resolve({
      pageData: data.pageData,
      siteMap: data.siteConfig,
      metaData: data.merged,
    });
  }

  getPageContent(path) {
    return new Promise((resolve, reject) => {
      this.getPageData(path).then((data) => {
        new PageBuilder(data, this.config)
          .build()
          .then((page: any) => {
            resolve({
              status: data.status,
              data: page.output,
            });
          })
          .catch((ex) => {
            reject({
              status: 500,
              data: 'Internal Error',
              ex,
            });
          });
      });
    });
  }

  getErrorPage(siteConfig, path) {
    const config = this.config;
    siteConfig = siteConfig || config.siteConfig;
    const siteMap = siteConfig.siteMap;
    let filePath = '';
    let contents;
    filePath = this.getIfMatchPagesOnRoute(siteConfig, path, 500);

    if (!filePath && siteMap.errorRedirects && siteMap.errorRedirects[500]) {
      filePath = this.getFilePath(
        siteMap.errorRedirects && siteMap.errorRedirects[500]
      );
    } else if (!filePath) {
      filePath = this.getFilePath('/content/pages/error');
    }
    if (!this.fse.existsSync(filePath)) {
      filePath = this.get404Page(undefined, path);
    }
    const fileContents = this.fse.readFileSync(`${filePath}`, 'utf8');
    try {
      contents = yaml.loadAll(fileContents);
    } catch (ex) {
      contents = [{}];
    }
    return contents[0];
  }

  getIfMatchPagesOnRoute(siteConfig, path, errorCode) {
    let filePath = '';
    siteConfig.siteMap.errorRedirects &&
      Object.keys(siteConfig.siteMap.errorRedirects).forEach((key) => {
        if (typeof siteConfig.siteMap.errorRedirects[key] === 'object') {
          if (
            path.match(key) &&
            siteConfig.siteMap.errorRedirects[key][errorCode]
          ) {
            filePath = this.getFilePath(
              siteConfig.siteMap.errorRedirects[key][errorCode]
            );
          }
        }
      });
    return filePath;
  }

  get404Page(siteConfig, path) {
    const config = this.config;
    siteConfig = siteConfig || config.siteConfig;
    let filePath = '';
    filePath = this.getIfMatchPagesOnRoute(siteConfig, path, 404);
    if (
      !filePath &&
      siteConfig.siteMap.errorRedirects &&
      siteConfig.siteMap.errorRedirects[404]
    ) {
      filePath = this.getFilePath(
        siteConfig.siteMap.errorRedirects &&
          siteConfig.siteMap.errorRedirects[404]
      );
    }
    return filePath;
  }

  getLaunchWaitPage(siteConfig, targetPage = 'launchSoon') {
    const config = this.config;
    siteConfig = siteConfig || config.siteConfig;
    let filePath = '';
    console.log('waiting', targetPage);
    if (
      siteConfig.siteMap.errorRedirects &&
      siteConfig.siteMap.errorRedirects[targetPage]
    ) {
      filePath = this.getFilePath(
        siteConfig.siteMap.errorRedirects &&
          siteConfig.siteMap.errorRedirects[targetPage]
      );
    }
    // else {
    //   filePath = this.getFilePath('/content/pages/comingsoon');
    // }
    return filePath;
  }
  getLaunchEndPage(siteConfig, targetPage = 'launchEnded') {
    const config = this.config;
    siteConfig = siteConfig || config.siteConfig;
    let filePath = '';
    if (
      siteConfig.siteMap.errorRedirects &&
      siteConfig.siteMap.errorRedirects[targetPage]
    ) {
      filePath = this.getFilePath(
        siteConfig.siteMap.errorRedirects &&
          siteConfig.siteMap.errorRedirects[targetPage]
      );
    }
    // else {
    //   filePath = this.getFilePath('/content/pages/launchend');
    // }
    return filePath;
  }

  getAppNameFromUrl(url) {
    return url.substr(0, url.indexOf('/'));
  }

  generateSiteMapPaths(path) {
    const arr = path.split('/').filter((i) => !!i);
    const root = arr.splice(0, 1);
    arr.pop();
    let next = `/${root}`;
    return arr.map((path) => {
      next = `${next ? `${next}` : ''}/${path}`;
      return `${next}/sitemap`;
    });
  }

  async getPageData(path) {
    const config = this.config;
    let status = 200;
    const srcFile = path;
    let fullPath = `${this.contentFolder}/${srcFile}`;
    const appPath = this.getAppNameFromUrl(srcFile);
    const siteMaps = this.generateSiteMapPaths(fullPath);
    let currentSiteConfig = this.allSiteMaps[appPath] || config.siteConfig;
    if (this.contentRepo) {
      const result = await this.contentRepo.searchSiteMaps(siteMaps);
      if (result.length > 0) {
        currentSiteConfig = {
          ...currentSiteConfig,
          ...result[0].pageData,
          siteMap: {
            ...currentSiteConfig.siteMap,
            ...result[0].pageData.siteMap,
          },
        };
      }
    }
    console.log('--serving=' + fullPath);
    let siblingData: any = {};
    let isLaunchMatch = false;
    let launchMatchKey = '';
    let launchTime = '';
    let launchEnded = '';

    if (currentSiteConfig.launchConfig) {
      Object.keys(currentSiteConfig.launchConfig).forEach((lKey) => {
        if (lKey === fullPath || fullPath.match(lKey)) {
          isLaunchMatch = true;
          launchMatchKey = lKey;
        }
      });
    }

    let { filePath, rootPath, isFile } = this.getFileLocation(fullPath);
    rootPath = `${rootPath || ''}`;
    if (isLaunchMatch) {
      let timeToLaunch;
      let pageForWait;
      let pageForEnded;
      let timeToEnd;
      if (typeof currentSiteConfig.launchConfig[launchMatchKey] === 'object') {
        timeToLaunch = currentSiteConfig.launchConfig[launchMatchKey].start;
        timeToEnd = currentSiteConfig.launchConfig[launchMatchKey].end;
        pageForWait = currentSiteConfig.launchConfig[launchMatchKey].waitPath;
        pageForEnded = currentSiteConfig.launchConfig[launchMatchKey].waitEnded;
      } else {
        timeToLaunch = currentSiteConfig.launchConfig[launchMatchKey];
      }
      launchTime = timeToLaunch && utils.datetime.new(timeToLaunch).toISO();
      launchEnded = timeToEnd && utils.datetime.new(timeToEnd).toISO();
      const diffInSeconds = utils.datetime
        .new(timeToLaunch)
        .diffInSeconds(utils.datetime.new());
      const diffInSecondsEnd = utils.datetime
        .new(timeToEnd)
        .diffInSeconds(utils.datetime.new());
      if (diffInSeconds > 0) {
        filePath = this.getLaunchWaitPage(currentSiteConfig, pageForWait);
        fullPath = filePath;
        isFile = true;
      } else if (diffInSecondsEnd < 0) {
        filePath = this.getLaunchEndPage(currentSiteConfig, pageForEnded);
        fullPath = filePath;
        isFile = true;
      }
    }

    let fileContents;
    let fileFound = true;
    if (!this.fse.existsSync(filePath)) {
      filePath = this.get404Page(currentSiteConfig, fullPath);
      status = 404;
      fileFound = false;
    } else if (!isLaunchMatch) {
      siblingData = this.getAllSiblings(
        `${rootPath}${fullPath}`,
        isFile,
        fullPath
      );
    }

    let contents;
    if (this.contentRepo && !fileFound) {
      const test = await this.contentRepo.getByPath(fullPath);
      if (test && !fileFound) {
        status = 200;
        contents = [test.pageData];
        console.log('served from db=' + fullPath);
      }
    }
    if (!contents) {
      if (this.fse.existsSync(filePath)) {
        fileContents = this.fse.readFileSync(`${filePath}`, 'utf8');
      } else {
        fileContents = this.fse.readFileSync(
          this.getFilePath('/content/pages/404'),
          'utf8'
        );
      }
    }
    let currentNode = this.getPageNode(currentSiteConfig.siteMap, filePath);
    if (!currentNode) {
      currentNode = currentSiteConfig.siteMap;
    }
    try {
      contents = !contents ? yaml.loadAll(fileContents) : contents;
    } catch (ex) {
      contents = [this.getErrorPage(currentSiteConfig, fullPath)];
    }

    const merged = {
      navigation: currentSiteConfig.siteMap.children,
      secondaryNavigation:
        currentNode !== currentSiteConfig.siteMap ? currentNode.children : [],
      pageConfig: {},
      userData: {
        launchTime,
        launchEnded,
        ...this.config.userData(),
      },
      parentPath: siblingData.parentPath || fullPath,
      siblingPages: siblingData.pages,
    };
    if (contents.length === 1) {
      contents = contents[0];
    }
    const data: any = {
      mode: config.mode,
      status,
      path: fullPath,
      site: config,
      extraParams: {
        publicUrl: config.envConfig.publicUrl || '',
        baseUrl: config.envConfig.publicUrl || '/',
        ENV: process.env,
        envConfig: config.envConfig,
        launchTime,
      },
      siteConfig: currentSiteConfig,
      currentNode,
      merged,
    };
    data.pageData = this.processContent(contents, data) || {};
    return data;
  }

  processContent(contents, data) {
    if (contents && contents.inject) {
      Object.keys(contents.inject).forEach((key) => {
        if (typeof contents.inject[key] === 'string') {
          contents[key] = utils.object.getDataFromKey(
            data,
            contents.inject[key]
          );
        }
      });
    }
    if (contents && contents.items) {
      contents.items.forEach((item) => {
        if (item.inject) {
          Object.keys(item.inject).forEach((key) => {
            if (typeof item.inject[key] === 'string') {
              item[key] = utils.object.getDataFromKey(data, item.inject[key]);
            }
          });
        }
      });
    }
    return contents;
  }

  serveContent(req, res) {
    console.log('request->' + req.params['0']);
    this.getPageContent(req.params['0'])
      .then((response: any) => {
        // setTimeout(() => {
        res.status(response.status).send(response.data);
        // }, 3000);
      })
      .catch((response) => {
        console.log(response);
        res.status(response.status).send(response.data);
      });
  }
}

export default ContentServer;
