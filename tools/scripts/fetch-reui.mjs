/**
 * Vendors ReUI components (and the shadcn primitives they build on) into
 * libs/ui-reui-base/src/reui. ReUI has no npm package; it is distributed as a
 * shadcn registry, so this script plays the role of `shadcn add`.
 *
 *   node tools/scripts/fetch-reui.mjs button input @reui/badge ...
 *
 * Plain names come from the shadcn registry, `@reui/<name>` from reui.io.
 * Imports are rewritten to relative paths so the library needs no aliases.
 */
import fs from 'node:fs';
import path from 'node:path';

const STYLE = 'radix-nova';
const ROOT = path.resolve('libs/ui-reui-base/src/reui');
const SOURCES = {
  shadcn: (n) => `https://ui.shadcn.com/r/styles/${STYLE}/${n}.json`,
  reui: (n) => `https://reui.io/r/${STYLE}/${n}.json`,
};

const seen = new Map();
const npmDeps = new Set();

const toKey = (dep) =>
  dep.startsWith('@reui/') ? ['reui', dep.slice(6)] : ['shadcn', dep];

async function fetchItem(source, name) {
  const key = `${source}:${name}`;
  if (seen.has(key)) return;
  seen.set(key, null);
  const res = await fetch(SOURCES[source](name), { redirect: 'follow' });
  if (!res.ok) {
    // ReUI-only items referenced without the @reui prefix fall back to reui.io
    if (source === 'shadcn') {
      seen.delete(key);
      return fetchItem('reui', name);
    }
    throw new Error(`${key}: HTTP ${res.status}`);
  }
  const item = await res.json();
  seen.set(key, item);
  (item.dependencies || []).forEach((d) => npmDeps.add(d));
  for (const dep of item.registryDependencies || []) {
    const [s, n] = toKey(dep);
    await fetchItem(s, n);
  }
}

function targetFor(file) {
  const base = path.basename(file.path);
  switch (file.type) {
    case 'registry:hook':
      return path.join('hooks', base);
    case 'registry:lib':
      return path.join('lib', base);
    default:
      return path.join('ui', base);
  }
}

// The registries ship <IconPlaceholder lucide="X" tabler="..." /> and let the shadcn CLI
// pick the icon library. We use lucide-react.
const ICON_LIBS = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'];
function resolveIcons(code) {
  if (!code.includes('IconPlaceholder')) return code;
  const used = new Set();
  code = code.replace(/<IconPlaceholder\b([\s\S]*?)\/>/g, (_m, attrs) => {
    const icon = /\blucide="([^"]+)"/.exec(attrs)?.[1];
    if (!icon) throw new Error('IconPlaceholder without lucide icon');
    used.add(icon);
    const rest = attrs
      .replace(new RegExp(`\\s*\\b(${ICON_LIBS.join('|')})="[^"]*"`, 'g'), '')
      .trim();
    return `<${icon}${rest ? ' ' + rest : ''} />`;
  });
  return code.replace(
    /import \{ IconPlaceholder \} from "[^"]+"\n/,
    `import { ${[...used].sort().join(', ')} } from "lucide-react"\n`
  );
}

// Theme variables are namespaced (--reui-*) in styles/reui.css, so raw var(--primary) etc.
// are pointed at Tailwind's --color-* aliases instead.
const THEME_VARS =
  'background|foreground|card|card-foreground|popover|popover-foreground|primary|primary-foreground|secondary|secondary-foreground|muted|muted-foreground|accent|accent-foreground|destructive|destructive-foreground|border|input|ring|info|success|warning|invert';
const themeVarRe = new RegExp(`var\\(--(${THEME_VARS})(?=[),])`, 'g');

function rewriteImports(code, fromDir) {
  code = resolveIcons(code).replace(themeVarRe, 'var(--color-$1');
  const rel = (to) => {
    let r = path.relative(fromDir, path.join(ROOT, to));
    if (!r.startsWith('.')) r = './' + r;
    return r;
  };
  return code
    .replace(/from ["']cn["']/g, `from "${rel('lib/utils')}"`)
    .replace(/from ["']@\/lib\/utils["']/g, `from "${rel('lib/utils')}"`)
    .replace(
      /from ["']@\/(?:registry\/[^/]+\/)?(?:components\/)?ui\/([^"']+)["']/g,
      (_m, n) => `from "${rel('ui/' + n)}"`
    )
    .replace(
      /from ["']@\/(?:registry\/[^/]+\/)?(?:components\/)?reui\/([^"']+)["']/g,
      (_m, n) => `from "${rel('ui/' + n)}"`
    )
    .replace(
      /from ["']@\/(?:registry\/[^/]+\/)?hooks\/([^"']+)["']/g,
      (_m, n) => `from "${rel('hooks/' + n)}"`
    )
    .replace(
      /from ["']@\/(?:registry\/[^/]+\/)?lib\/([^"']+)["']/g,
      (_m, n) => `from "${rel('lib/' + n)}"`
    );
}

const names = process.argv.slice(2);
if (!names.length) {
  console.error('usage: node tools/scripts/fetch-reui.mjs <name|@reui/name>...');
  process.exit(1);
}
for (const n of names) {
  const [s, name] = toKey(n);
  await fetchItem(s, name);
}

let written = 0;
for (const item of seen.values()) {
  if (!item) continue;
  for (const file of item.files || []) {
    if (!file.content) continue;
    const out = path.join(ROOT, targetFor(file));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, rewriteImports(file.content, path.dirname(out)));
    written++;
  }
}
npmDeps.delete('cn'); // replaced by src/reui/lib/utils.ts
console.log(`items: ${[...seen.keys()].join(' ')}`);
console.log(`files written: ${written}`);
console.log(`npm deps: ${[...npmDeps].sort().join(' ')}`);
