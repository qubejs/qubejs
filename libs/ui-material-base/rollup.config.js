// const url = require('@rollup/plugin-url');
const nrwlConfig = require('@nx/react/plugins/bundle-rollup');
const ignoreImport = require('rollup-plugin-ignore-import');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

module.exports = (config) => {
  const originalConfig = nrwlConfig(config);
  const postCss = originalConfig.plugins.filter((i) => i.name === 'postcss')[0];
  originalConfig.plugins.splice(originalConfig.plugins.indexOf(postCss), 1);
  // originalConfig.output.preserveModules = true;
  // originalConfig.output.preserveModulesRoot = 'src';
  return {
    ...originalConfig,
    plugins: [
      ...originalConfig.plugins,
      peerDepsExternal(),
      ignoreImport({
        // Ignore all .scss and .css file imports while building the bundle
        extensions: ['.scss', '.css'],
        // Optional: replace body for ignored files. Default value is "export default undefined;"
        body: 'export default undefined;',
      }),
    ],
  };
};
