const ignoreImport = require('rollup-plugin-ignore-import');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

const { withNx } = require('@nx/rollup/with-nx');
const url = require('@rollup/plugin-url');
const svg = require('@svgr/rollup');

const config = withNx(
  {
    // main: 'libs/web-react/src/index.ts',
    main: './src/index.ts',
    outputPath: '../../dist/libs/web-react',
    tsConfig: './tsconfig.lib.json',
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'immutability-helper',
      'animated-scroll-to',
      'react-router-dom',
      'react-html-parser',
      '@qubejs/core',
      'd3',
    ],
    stylePreprocessorOptions: {
      includePaths: ['libs/web-react/src/styles'],
    },
    compiler: 'babel',
    assets: [
      {
        glob: 'libs/web-react/README.md',
        input: '.',
        output: '.',
      },
      {
        glob: 'libs/web-react/LICENCE',
        input: '.',
        output: '.',
      },
    ],
    extractCss: true,
    // format: ['esm'],
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    preserveSymlinks: true,

    plugins: [
      peerDepsExternal(),
      ignoreImport({
        // Ignore all .scss and .css file imports while building the bundle
        extensions: ['.scss', '.css'],
        // Optional: replace body for ignored files. Default value is "export default undefined;"
        body: 'export default undefined;',
      }),
      svg({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      url({
        limit: 10000, // 10kB
      }),
    ],
  }
);
const postCss = config.plugins.filter((i) => i.name === 'postcss')[0];
config.plugins.splice(config.plugins.indexOf(postCss), 1);
module.exports = config;