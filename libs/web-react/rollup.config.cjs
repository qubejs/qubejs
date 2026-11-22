const ignoreImport = require('rollup-plugin-ignore-import');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

const { withNx } = require('@nx/rollup/with-nx');
const url = require('@rollup/plugin-url');
const svg = require('@svgr/rollup');
const path = require('path');
const {
  folderEntries,
  fileEntries,
  applyOutputLayout,
  perEntryExports,
} = require('../../tools/scripts/rollup-entries.cjs');

const srcDir = path.join(__dirname, 'src');
const outputPath = path.join(__dirname, '../../dist/libs/web-react');

// Namespace entry points: @qubejs/web-react/utils, @qubejs/web-react/hooks, ...
const groupEntries = fileEntries(srcDir, {
  index: 'index.ts',
  ui: 'ui.ts',
  utils: 'utils/index.ts',
  domain: 'domain/index.ts',
  redux: 'redux/index.ts',
  plugins: 'plugins.ts',
  hooks: 'hooks/index.js',
  globals: 'globals.ts',
  cordova: 'cordova.ts',
  components: 'components/index.tsx',
  containers: 'containers/index.tsx',
  templates: 'templates/index.tsx',
});

// One entry per container / template: @qubejs/web-react/PageBuilder, ...
const componentEntries = folderEntries(
  srcDir,
  ['containers', 'components', 'templates'],
  { reserved: Object.keys(groupEntries) }
);

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
    input: { ...groupEntries, ...componentEntries },

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
      perEntryExports({ outputPath }),
    ],
  }
);
const postCss = config.plugins.filter((i) => i.name === 'postcss')[0];
config.plugins.splice(config.plugins.indexOf(postCss), 1);
applyOutputLayout(config);
module.exports = config;