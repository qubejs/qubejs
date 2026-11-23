require('dotenv').config();
const path = require('path');
// const chalk = require('chalk');
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const packageJson = require('../../package.json');

const VERSION = process.env.VERSION || packageJson.version;
/**
 * Runs Tailwind CSS v4 (@tailwindcss/postcss) plus the library's guard plugin on the
 * stylesheets of @qubejs/ui-reui-base and @qubejs/ui-daisyui-base, so the app can consume
 * those libraries from source.
 * All other stylesheets keep Nx's default PostCSS pipeline.
 */
function enableTailwindFor(config, sheets) {
  const tailwind = require('@tailwindcss/postcss');
  const visit = (rule) => {
    if (!rule) return;
    (rule.oneOf || []).forEach(visit);
    (rule.rules || []).forEach(visit);
    (Array.isArray(rule.use) ? rule.use : []).forEach((use) => {
      if (!use || typeof use !== 'object' || !/postcss-loader/.test(use.loader || '')) return;
      const original = use.options && use.options.postcssOptions;
      if (typeof original !== 'function' || original.__tailwind) return;
      const wrapped = (loader) => {
        const options = original(loader);
        const sheet = sheets.find((x) => x.test.test(loader.resourcePath));
        if (sheet) {
          // Tailwind resolves its own @imports, so it replaces postcss-import here
          const rest = (options.plugins || []).filter(
            (p) => p && p.postcssPlugin !== 'postcss-import'
          );
          return {
            ...options,
            plugins: [tailwind({ base: sheet.base }), require(sheet.guard)(), ...rest],
          };
        }
        return options;
      };
      wrapped.__tailwind = true;
      use.options.postcssOptions = wrapped;
    });
  };
  config.module.rules.forEach(visit);
}

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  if (VERSION) {
    console.log('building for version:' + VERSION);
    config.output.filename = `[name]${VERSION ? `.${VERSION}` : ''}.js`;
    config.output.chunkFilename = `[name]${VERSION ? `.${VERSION}` : ''}.js`;
    const plugin = config.plugins.find(
      (item) => item?.constructor?.name === 'MiniCssExtractPlugin'
    );
    console.log(plugin)
    plugin.options.filename = `[name]${VERSION ? `.${VERSION}` : ''}.css`;
    plugin.options.chunkFilename = `[name]${VERSION ? `.${VERSION}` : ''}.css`;
  }
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  const typescss = config.module.rules.filter((i) => '.scss'.match(i.test))[0];
  // console.log(typescss);
  const scssMod = typescss.oneOf.filter((i) => '.scss'.match(i.test))[0];
  // scssMod.use[1].options.importLoaders = 1;
  // scssMod.use[1].options.modules = {
  //   compileType: 'icss',
  // };
  // console.log(config.module.rules);
  // console.log(scssMod.use[1]);
  const typeWeb = scssMod.use[3].options;
  typeWeb.additionalData = (content, loaderContext) => {
    if (
      loaderContext.resourcePath.endsWith(
        `themes\\main\\abstract\\_variables.scss`
      ) ||
      loaderContext.resourcePath.endsWith(
        `themes/main/abstract/_variables.scss`
      )
    ) {
      return content;
    }
    return `
      @import "themes/main/abstract/_variables.scss";
      @import "mixins/index.scss";
    ${content}
  `;
  };
  // console.log(path.resolve('apps/web/src/styles'));
  typeWeb.sassOptions.includePaths.push(path.resolve('apps/web/src/styles'));
  typeWeb.sassOptions.includePaths.push(path.resolve('libs'));
  enableTailwindFor(config, [
    {
      test: /ui-reui-base[\\/]src[\\/]styles[\\/]reui\.css$/,
      base: path.resolve('libs/ui-reui-base/src'),
      guard: path.resolve('libs/ui-reui-base/postcss/bootstrap-guard.cjs'),
    },
    {
      test: /ui-daisyui-base[\\/]src[\\/]styles[\\/]daisy\.css$/,
      base: path.resolve('libs/ui-daisyui-base/src'),
      guard: path.resolve('libs/ui-daisyui-base/postcss/daisy-guard.cjs'),
    },
  ]);
  return config;
});
