// import packageJson from '@qubejs/source/package.json';
import config from './environment/index';
import siteConfig from '../site.config';

export default {
  appVersion: '0.0.0',
  apiPrefix: config.apiPrefix,
  environment: config.env,
  tenantCode: config.tenantCode || 'Sample',
  siteMap: siteConfig,
  publicUrl: config.publicUrl,
  module: 'ho',
};
