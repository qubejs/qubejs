/**
 * Compiles src/styles/daisy.css (daisyUI + Tailwind CSS v4 + daisy guard) to dist styles.css.
 *   node libs/ui-daisyui-base/postcss/build-css.cjs <out-file>
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const daisyGuard = require('./daisy-guard.cjs');

const input = path.join(__dirname, '../src/styles/daisy.css');
const output = path.resolve(process.argv[2] || 'dist/libs/ui-daisyui-base/styles.css');

postcss([tailwind({ base: path.join(__dirname, '../src'), optimize: { minify: true } }), daisyGuard()])
  .process(fs.readFileSync(input, 'utf8'), { from: input, to: output })
  .then((result) => {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, result.css);
    console.log(`-> daisyUI styles: ${path.relative(process.cwd(), output)} (${(result.css.length / 1024).toFixed(1)} KB)`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
