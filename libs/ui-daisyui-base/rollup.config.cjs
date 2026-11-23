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
const outputPath = path.join(__dirname, '../../dist/libs/ui-daisyui-base');

// Group entry points (kept for backwards compatibility): @qubejs/ui-daisyui-base/basic, ...
const groupEntries = fileEntries(srcDir, {
  index: 'index.ts',
  'components.lazy': 'components.lazy.tsx',
  advanced: 'advanced.tsx',
  basic: 'basic.tsx',
  content: 'content.tsx',
  data: 'data.tsx',
  editing: 'editing.tsx',
  files: 'files.tsx',
  theme: 'theme.tsx',
  visualization: 'visualization.tsx',
});

// One entry per component: @qubejs/ui-daisyui-base/Input, @qubejs/ui-daisyui-base/Button, ...
const componentEntries = folderEntries(srcDir, ['components'], {
  reserved: Object.keys(groupEntries),
});

const config = withNx(
  {
    // main: 'libs/ui-daisyui-base/src/index.ts',
    main: './src/index.ts',
    outputPath: '../../dist/libs/ui-daisyui-base',
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
      '@qubejs/web-react',
      'd3',
    ],
    stylePreprocessorOptions: {
      includePaths: ['libs/ui-daisyui-base/src/styles'],
    },
    compiler: 'babel',
    assets: [
      {
        glob: 'libs/ui-daisyui-base/README.md',
        input: '.',
        output: '.',
      },
      {
        glob: 'libs/ui-daisyui-base/LICENCE',
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
