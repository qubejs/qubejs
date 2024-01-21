import path from 'path';
import { StaticContentBuilder } from '../../libs/scripts/src';
import paths from './paths.mjs';
import config from '../../apps/server/config/environment/index.js';
import appConfig from '../../apps/server/config/app-config.js';
import siteConfig from '../../apps/server/site.config.js';

new StaticContentBuilder({
  serverConfig: {
    contentPath: path.resolve('apps/server/ho'),
    serverPath: '/ho/*',
    siteConfig,
    appConfig: {
      ...appConfig,
      source: 'Web',
    },
    damAssets: path.resolve('apps/server/dam'),
    clientLibs: path.resolve('apps/server/clientlibs'),
    envConfig: config,
    mode: 'production',
  },
  output: paths.distWeb,
  ignoreFolder: process.env.PUBLIC_URL?.substr(1),
})
  .build()
  .then(() => {
    console.log('--> content process done');
  });
  