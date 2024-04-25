// import packageJson from '@qubejs/source/package.json';
import config from './environment/index';
import siteConfig from '../site.config';
import packagJson from '../../../package.json';

export default {
  appVersion: packagJson.version,
  apiPrefix: config.apiPrefix,
  environment: config.env,
  tenantCode: config.tenantCode || 'Sample',
  siteMap: siteConfig,
  publicUrl: config.publicUrl,
  module: 'ho',
};
