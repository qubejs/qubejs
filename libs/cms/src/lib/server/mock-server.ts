import fs from 'fs';
import { Response, Errors as errors } from '@qubejs/core';

class MockServer {
  config: any;
  app: any;
  fse: any;
  constructor({ fse = fs, ...options } = {}, app) {
    this.config = {
      staticMocks: '/api/*',
      staticApiPath: './mocks',
      ...options,
    };
    this.app = app;
    this.fse = fse;
  }

  ensureSlash(path) {
    return path.substr(path.length - 1, 1) === '/' ? path : `${path}/`;
  }

  init() {
    console.log('--- init mock-server');
    this.app.all(this.config.staticMocks, (req, res) => {
      const path = req._parsedUrl.pathname;
      const method = req.method.toLowerCase();
      let finalPath = this.ensureSlash(this.config.staticApiPath) + path;
      let response:any = new Response(errors.notfound()).error();
      let isJs = false;
      if (this.fse.existsSync(`${finalPath}/${method}/index.js`)) {
        finalPath = `${finalPath}/${method}/index.js`;
        isJs = true;
      } else if (this.fse.existsSync(`${finalPath}/${method}.json`)) {
        finalPath = `${finalPath}/${method}.json`;
      } else if (this.fse.existsSync(`${finalPath}/index.json`)) {
        finalPath = `${finalPath}/index.json`;
      }
      console.log(`mock serving_path=${finalPath}`);
      try {
        if (isJs) {
          console.log(`executing dynamic route`);
          response = require(finalPath);
        } else {
          response = this.fse.readFileSync(finalPath, 'utf8');
          response = JSON.parse(response);
        }
        if (typeof response === 'function') {
          response = response(req, res);
        }
      } catch (ex) {
        console.log(ex);
      }

      // const method = req.method.toLowerCase();
      // const routerData = apis[routerName];
      // const status = apis[routerName].status || 200;

      return res.status(response.statusCode || 200).send(response);
    });
  }
}

export default MockServer;
