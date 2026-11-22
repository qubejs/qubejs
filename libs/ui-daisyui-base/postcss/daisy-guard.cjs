/**
 * PostCSS plugin run after Tailwind/daisyUI for @qubejs/ui-daisyui-base styles.
 *
 * 1. Flattens @layer blocks. Bootstrap 4's element rules (label, button, legend, input, ...)
 *    are unlayered, and unlayered rules always beat layered ones; once flattened, normal
 *    specificity applies and daisyUI's `.dy-*` classes win over Bootstrap's element selectors.
 * 2. Tailwind utilities whose class name also exists in Bootstrap (.p-2, .bg-primary, .border,
 *    .container, ...) are limited to daisyUI elements and their descendants and marked
 *    !important (Bootstrap marks its utilities !important), so Bootstrap keeps its meaning on
 *    non-daisyUI markup.
 */
const fs = require('fs');

const SCOPE = ':is([class*="dy-"], [class*="dy-"] *)';

function bootstrapClassNames() {
  const file = require.resolve('bootstrap/dist/css/bootstrap.css', { paths: [process.cwd(), __dirname] });
  const css = fs.readFileSync(file, 'utf8');
  return new Set([...css.matchAll(/\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)/g)].map((m) => m[1]));
}

const leadingClass = (selector) => {
  const m = /^\.((?:\\.|[_a-zA-Z0-9-])+)/.exec(selector.trim());
  return m ? m[1].replace(/\\/g, '') : null;
};

const layerName = (node) => {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === 'atrule' && p.name === 'layer') return p.params;
  }
  return null;
};

module.exports = () => {
  const bootstrap = bootstrapClassNames();
  return {
    postcssPlugin: 'qubejs-daisy-guard',
    OnceExit(root) {
      // scope colliding utilities (before flattening, while layer info is available)
      root.walkRules((rule) => {
        if (!/\butilities\b/.test(layerName(rule) || '')) return;
        const selectors = rule.selectors || [];
        if (!selectors.some((s) => bootstrap.has(leadingClass(s)))) return;
        rule.selectors = selectors.map((s) => {
          if (!bootstrap.has(leadingClass(s))) return s;
          const m = /^(\s*\.(?:\\.|[_a-zA-Z0-9-])+)(.*)$/s.exec(s);
          return `${m[1]}${SCOPE}${m[2]}`;
        });
        rule.walkDecls((decl) => {
          decl.important = true;
        });
      });
      // drop layer order statements and unwrap layer blocks (innermost first)
      root.walkAtRules('layer', (at) => {
        if (!at.nodes) at.remove();
      });
      let found = true;
      while (found) {
        found = false;
        root.walkAtRules('layer', (at) => {
          if (at.nodes) {
            at.replaceWith(at.nodes);
            found = true;
          }
        });
      }
    },
  };
};
module.exports.postcss = true;
