
# qubejs
Core framework for web, plugin, cms &amp; nodejs server

[![npm](https://img.shields.io/npm/dm/@qubejs/web-react.svg)](https://www.npmjs.com/package/@qubejs/web-react)
[![npm](https://img.shields.io/npm/v/@qubejs/web-react.svg)](https://www.npmjs.com/package/@qubejs/web-react)


## Demos
- **Home page**: https://www.qubejs.com
- **Basic demo**: https://www.qubejs.com/content/en/qubejs/docs/intro
- **Full list**: https://www.qubejs.com/content/en/qubejs/examples


## Issues Report
https://github.com/qubejs/qubejs

## Download and Install qubejs

### Install from npm

```
pnpm add @qubejs/web-react @qubejs/core
# or: npm install @qubejs/web-react @qubejs/core
```

Requires React 19 (`react`, `react-dom`), `react-redux` and `react-router-dom` as peer dependencies.

## Available Modules

| Package | Description |
|---|---|
| `@qubejs/core` | Core utilities shared by all packages |
| `@qubejs/web-react` | React framework: containers, templates, redux, plugin system |
| `@qubejs/cms` | CMS content server (express) |
| `@qubejs/ui-material-base` | UI components built with Material UI |
| `@qubejs/ui-reui-base` | The same UI components built with [ReUI](https://reui.io) (shadcn/ui, Radix UI, Tailwind CSS v4) |
| `@qubejs/ui-daisyui-base` | The same UI components built with [daisyUI 5](https://daisyui.com) (Tailwind CSS v4) |

## Choosing a UI library

The three UI packages export the same components, names and props, so CMS pages render with
any of them. Register one with the plugin system:

```js
import { plugins } from '@qubejs/web-react';

// Material UI
import * as uiMaterial from '@qubejs/ui-material-base';
plugins.register(uiMaterial);

// or ReUI
import * as uiReui from '@qubejs/ui-reui-base';
import '@qubejs/ui-reui-base/styles.css';
plugins.register(uiReui);

// or daisyUI
import * as uiDaisyui from '@qubejs/ui-daisyui-base';
import '@qubejs/ui-daisyui-base/styles.css';
plugins.register(uiDaisyui);
```

Every component also has its own entry point, so you can import only what you use:

```js
import Input from '@qubejs/ui-reui-base/Input';
import PageBuilder from '@qubejs/web-react/PageBuilder';
```

The ReUI and daisyUI stylesheets don't include a global CSS reset and are scoped so they can
run next to Bootstrap 4. See each package's README for theming details.

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


## Development

This repository is an [Nx](https://nx.dev) workspace managed with [pnpm](https://pnpm.io).

```
pnpm install
pnpm nx serve server        # CMS server on http://localhost:4602
pnpm nx serve web           # sample app on http://localhost:4603/content/home
```

The sample app can switch UI libraries with the floating switcher or a query parameter:
`?ui=material`, `?ui=reui` or `?ui=daisyui`. Useful pages:

- `/content/ui-library-showcase` renders every component that differs between the libraries
- `/content/ui-library-dialog` shows a dialog with long content (scrolling body, visible actions)

Common tasks:

```
pnpm nx run-many -t test                 # unit tests
pnpm nx run <project>:dist               # build a library into dist/libs/<project>
node tools/scripts/publish.mjs <project> <version> [tag] --dry-run   # check a package without publishing
pnpm nx run <project>:publish --args="--ver=<version> --tag=<tag>"  # build and publish
```

ReUI components are vendored from the ReUI/shadcn registry with
`node tools/scripts/fetch-reui.mjs <name> @reui/<name> ...`.

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).
