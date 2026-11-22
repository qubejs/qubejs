# @qubejs/ui-daisyui-base

qubejs UI components built with [daisyUI 5](https://daisyui.com) on Tailwind CSS v4, with
[lucide](https://lucide.dev) icons.

It exports the **same components, names and props** as `@qubejs/ui-material-base`, so pages
written for the Material UI library render unchanged.

## Install

```
pnpm add @qubejs/ui-daisyui-base @qubejs/web-react @qubejs/core react react-dom react-redux react-router-dom
```

## Use

```js
import * as uiDaisyui from '@qubejs/ui-daisyui-base';
import '@qubejs/ui-daisyui-base/styles.css';
import { plugins } from '@qubejs/web-react';

plugins.register(uiDaisyui);
```

Import single components to keep bundles small:

```js
import Input from '@qubejs/ui-daisyui-base/Input';
```

## Styling

- `styles.css` is compiled daisyUI + Tailwind CSS. daisyUI classes are prefixed **`dy-`**
  (`dy-btn`, `dy-modal`, ...) so they never clash with Bootstrap's `.btn`, `.modal`, `.alert`...
- No global reset is included, so it can sit next to Bootstrap or other styles.
  `postcss/daisy-guard.cjs` flattens CSS layers (so Bootstrap's element rules can't override
  daisyUI) and limits Tailwind utilities that share names with Bootstrap to daisyUI elements.
- Themes: daisyUI `light` (default) and `dark`. Use
  `<ThemeProvider theme={{ mode: 'dark' }}>` from `@qubejs/ui-daisyui-base/theme`, or override
  daisyUI color variables with `theme.cssVars` (e.g. `{ primary: 'oklch(0.55 0.2 260)' }`).

## Structure

- `src/components/*` — qubejs components (same as ui-material-base)
- `src/daisy/ui/*` — small React primitives that render daisyUI classes (button, select,
  dropdown menu, modal, tabs, ...). daisyUI is CSS-only, so overlay behaviour (positioning,
  outside click, Escape, keyboard navigation) lives in `src/daisy/lib/floating.tsx`.
- `src/daisy/compat/*` — adapters for the MUI-style props used by qubejs content
- `src/styles/daisy.css` — Tailwind/daisyUI entry

## Tests

`pnpm nx test ui-daisyui-base` — includes a parity test that renders every component next to its
ui-material-base counterpart and fails if anything renders Material UI (or ReUI) markup.
