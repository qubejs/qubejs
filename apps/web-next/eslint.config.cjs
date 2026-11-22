const path = require('path');
// Load FlatCompat from ESLint's own @eslint/eslintrc: eslint-config-next uses
// @rushstack/eslint-patch, which only recognises an eslintrc that lives inside ESLint's folder.
// Resolving it from the workspace root breaks whenever the hoisted node_modules layout shifts.
const { FlatCompat } = require(
  require.resolve('@eslint/eslintrc', {
    paths: [path.dirname(require.resolve('eslint/package.json'))],
  })
);
const js = require('@eslint/js');
const { fixupConfigRules } = require('@eslint/compat');
const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...fixupConfigRules(compat.extends('next')),

  ...fixupConfigRules(compat.extends('next/core-web-vitals')),

  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  {
    ignores: ['.next/**/*'],
  },
];
