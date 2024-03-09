
# qubejs
Core framework for web, plugin, cms &amp; nodejs server

[![npm](https://img.shields.io/npm/dm/@qubejs/web-react.svg)](https://www.npmjs.com/package/@qubejs/web-react)
[![npm](https://img.shields.io/npm/v/@qubejs/web-react.svg)](https://www.npmjs.com/package/@qubejs/web-react)


## Demos
- **Home page**: https://qubejs.github.io
- **Basic demo**: https://qubejs.github.io/content/en/qubejs/docs/intro
- **Full list**: https://qubejs.github.io/content/en/qubejs/examples


## Issues Report
https://github.com/qubejs/qubejs

## Download and Install qubejs

### Install from npm

```
npm install @qubejs/web-react
```
## Available Modules

At present, we officially aim to support 3 modules

- @qubejs/ui-material-base
- @qubejs/web-react
- @qubejs/cms
- @qubejs/core

## CMS Server

```
import express from 'express';
import * as path from 'path';
import { ContentServer } from '@qubejs/cms';
import siteConfig from '../site.config';
import config from '../config/environment';
import appConfig from '../config/app-config';

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const cmsSever = new ContentServer(
  {
    contentPath: path.resolve('./apps/server/content'),
    serverPath: '/content/*',
    rootApp: path.resolve('./apps/server'),
    internalDevPath: path.resolve('./libs/cms'),
    damAssets: path.resolve('./apps/server/dam'),
    clientLibs: path.resolve('./apps/server/clientlibs'),
    userData: () => {
      return {
        tenantCode: process.env.TENANT_CODE || 'NOT_DEFINED',
        sitekey: process.env.sitekey || 'NOT_DEFINED',
      };
    },
    appConfig,
    envConfig: config,
    mode: config.env,
    siteConfig: siteConfig,
  },
  app
);

cmsSever.init();

const port = process.env.PORT || 4602;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
```


## License

This project is licensed under the terms of the
[MIT license](/LICENSE).
