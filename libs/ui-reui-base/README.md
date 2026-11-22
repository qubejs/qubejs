# @qubejs/ui-reui-base

qubejs UI components built with [ReUI](https://reui.io) — shadcn/ui components on Radix UI,
styled with Tailwind CSS v4 and [lucide](https://lucide.dev) icons (the shadcn/ui icon set).

It exports the **same components, names and props** as `@qubejs/ui-material-base`, so pages
written for the Material UI library render unchanged.

## Install

```
pnpm add @qubejs/ui-reui-base @qubejs/web-react @qubejs/core react react-dom react-redux react-router-dom
```

## Use

```js
import * as uiReui from '@qubejs/ui-reui-base';
import '@qubejs/ui-reui-base/styles.css';
import { plugins } from '@qubejs/web-react';

plugins.register(uiReui);
```

Import single components to keep bundles small:

```js
import Input from '@qubejs/ui-reui-base/Input';
```

## Styling

- `styles.css` is compiled Tailwind CSS. It does **not** include Tailwind's global reset, so it
  can sit next to Bootstrap or other styles.
- Theme tokens are CSS variables prefixed `--reui-` (e.g. `--reui-primary`). Override them in
  your CSS, or with `<ThemeProvider theme={{ cssVars: { primary: 'oklch(0.55 0.2 260)' } }}>`
  from `@qubejs/ui-reui-base/theme`; `theme.palette.mode = 'dark'` switches to dark mode.
- Tailwind utilities that share a name with Bootstrap 4 utilities (`.bg-primary`, `.p-2`, ...)
  only apply to ReUI elements, so Bootstrap keeps working elsewhere
  (see `postcss/bootstrap-guard.cjs`).

## Structure

- `src/components/*` — qubejs components (same as ui-material-base)
- `src/reui/ui/*` — vendored ReUI / shadcn primitives (radix-nova style). Re-fetch or add more with
  `node tools/scripts/fetch-reui.mjs <name> @reui/<name> ...`
- `src/reui/compat/*` — adapters that accept the MUI-style props used by qubejs content
  (`TextField`, `Tooltip`, `Autocomplete`, variant/size mapping)
- `src/styles/reui.css` — Tailwind entry (theme tokens, scoped resets)

## Tests

`pnpm nx test ui-reui-base` — includes a parity test that renders every component next to its
ui-material-base counterpart and fails if anything renders Material UI markup.
