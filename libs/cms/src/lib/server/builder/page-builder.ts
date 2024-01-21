import fse = require('fs-extra');
import { promisify } from 'util';
import ejs from 'ejs';
import _ from 'lodash';
const ejsRenderFile = promisify(ejs.renderFile);

class PageBuilder {
  path: any;
  site: any;
  siteConfig: any;
  mode: any;
  publicUrl: any;
  data: any;
  merged: any;
  currentNode: any;
  extraParams: any;
  config: any;
  fse: any;
  constructor(
    {
      path = '',
      site = {},
      siteConfig,
      mode,
      publicUrl,
      pageData = {},
      merged = {},
      extraParams,
      currentNode,
    }: any,
    config:any = {}
  ) {
    this.path = path;
    this.site = site;
    this.siteConfig = siteConfig;
    this.mode = mode;
    this.publicUrl = publicUrl;
    this.data = pageData;
    this.merged = merged;
    this.currentNode = currentNode;
    this.extraParams = extraParams;
    this.config = config;
    this.fse = fse;
  }

  getComponentPath(compName) {
    const pathToSeach = [this.config.rootApp, this.config.rootPath];
    for (let i = 0; i < pathToSeach.length; i++) {
      const currentPath = pathToSeach[i];
      console.log('currentPath');
      if (this.fse.existsSync(`${currentPath}/${compName}.ejs`)) {
        return `${currentPath}/${compName}.ejs`;
      } else if (this.fse.existsSync(`${currentPath}/${compName}/index.ejs`)) {
        return `${currentPath}/${compName}/index.ejs`;
      } else if (
        this.fse.existsSync(`${currentPath}/${compName}/${compName}.ejs`)
      ) {
        return `${currentPath}/${compName}${compName}.ejs`;
      }
    }
    return compName;
  }

  build() {
    // console.log('building page ->' + this.data.title);
    // console.log('building page:template->' + this.data.template);
    // console.log('building page:layout->' + this.data.layout);
    const currentNode = this.currentNode;
    return new Promise((resolve) => {
      let finalPath;
      if (fse.existsSync(`${this.site.rootApp}/${this.data.template}.ejs`)) {
        finalPath = `${this.site.rootApp}/${this.data.template}.ejs`;
      } else if (
        fse.existsSync(`${this.site.srcPath}/${this.data.template}.ejs`)
      ) {
        finalPath = `${this.site.srcPath}/${this.data.template}.ejs`;
      } else {
        finalPath = `${this.site.srcPath}/apps/core/templates/page.ejs`;
      }
      console.log('template:' + finalPath);
      // render page
      ejsRenderFile(
        `${finalPath}`,
        Object.assign(
          {},
          {
            ...this.merged,
            ...this.extraParams,
            getComponentPath: this.getComponentPath.bind(this),
            analytics: this.siteConfig.analytics,
            siteMap: this.siteConfig.siteMap,
            currentPath: this.path,
            currentNode,
            _,
            mode: this.siteConfig.mode || this.mode,
          },
          { pageData: this.data }
        )
      )
        .then((pageContents) => {
          let finalPath;
          if (fse.existsSync(`${this.site.rootApp}/${this.data.layout}.ejs`)) {
            finalPath = `${this.site.rootApp}/${this.data.layout}.ejs`;
          } else if (
            fse.existsSync(`${this.site.srcPath}/${this.data.layout}.ejs`)
          ) {
            finalPath = `${this.site.srcPath}/${this.data.layout}.ejs`;
          } else {
            finalPath = `${this.site.srcPath}/apps/core/layouts/default.ejs`;
          }
          // render layout
          return ejsRenderFile(
            `${finalPath}`,
            Object.assign(
              {},
              {
                currentPath: this.path,
                ...this.extraParams,
                ...this.merged,
                getComponentPath: this.getComponentPath.bind(this),
                analytics: this.siteConfig.analytics,
                siteMap: this.siteConfig.siteMap,
                currentNode,
                mode: this.siteConfig.mode || this.mode,
                _,
                pageData: this.data,
              },
              { body: pageContents }
            )
          );
        })
        .then((layoutContent) => {
          resolve({
            output: layoutContent,
          });
        });
    });
  }
}

export default PageBuilder;
