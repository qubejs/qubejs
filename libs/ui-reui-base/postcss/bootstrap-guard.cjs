/**
 * PostCSS plugin run after Tailwind for @qubejs/ui-reui-base styles.
 *
 * Bootstrap 4 (used by qubejs apps) ships utilities with the same names as Tailwind's
 * (.bg-primary, .p-2, .border, .rounded, .shadow, .container, ...) and marks most of them
 * !important. Without help, Bootstrap would restyle ReUI components, while letting Tailwind win
 * everywhere would restyle the rest of the app.
 *
 * This plugin:
 *  - marks every Tailwind utility !important (like Tailwind's important mode), which beats
 *    Bootstrap because !important rules in a cascade layer win over unlayered !important rules,
 *    while variants (hover:, data-open:, ...) still override their base utilities as usual;
 *  - limits utilities whose class name also exists in Bootstrap to ReUI elements (those with
 *    [data-slot]) and their descendants, so Bootstrap keeps its meaning on non-ReUI markup.
 */
const fs = require('fs');
const path = require('path');

const SCOPE = ':is([data-slot], [data-slot] *)';

function bootstrapClassNames() {
  const file = require.resolve('bootstrap/dist/css/bootstrap.css', {
    paths: [process.cwd(), __dirname],
  });
  const css = fs.readFileSync(file, 'utf8');
  return new Set(
    [...css.matchAll(/\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)/g)].map((m) => m[1])
  );
}

// first class name in a selector, with CSS escapes removed (e.g. ".p-2\.5" -> "p-2.5")
const leadingClass = (selector) => {
  const m = /^\.((?:\\.|[_a-zA-Z0-9-])+)/.exec(selector.trim());
  return m ? m[1].replace(/\\/g, '') : null;
};

const inUtilitiesLayer = (node) => {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === 'atrule' && p.name === 'layer' && /\butilities\b/.test(p.params)) return true;
  }
  return false;
};

module.exports = () => {
  const bootstrap = bootstrapClassNames();
  return {
    postcssPlugin: 'qubejs-reui-bootstrap-guard',
    Once(root) {
      root.walkRules((rule) => {
        if (!inUtilitiesLayer(rule)) return;
        rule.walkDecls((decl) => {
          decl.important = true;
        });
        const selectors = rule.selectors || [];
        const collides = selectors.some((s) => bootstrap.has(leadingClass(s)));
        if (!collides) return;
        rule.selectors = selectors.map((s) => {
          const cls = leadingClass(s);
          if (!bootstrap.has(cls)) return s;
          // insert the scope right after the leading class: .p-2:hover -> .p-2:is(...):hover
          const m = /^(\s*\.(?:\\.|[_a-zA-Z0-9-])+)(.*)$/s.exec(s);
          return `${m[1]}${SCOPE}${m[2]}`;
        });
      });
    },
  };
};
module.exports.postcss = true;
