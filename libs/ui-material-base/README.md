# @qubejs/ui-material-base

qubejs UI components built with [Material UI](https://mui.com/material-ui/) (MUI v5) and [Material Icons](https://mui.com/material-ui/material-icons/).

## Install

```
pnpm add @qubejs/ui-material-base @qubejs/web-react @qubejs/core
pnpm add react react-dom @mui/material @mui/icons-material @mui/lab @mui/x-date-pickers @emotion/react @emotion/styled react-redux react-router-dom
```

React, MUI, emotion, react-redux and react-router-dom are peer dependencies, so your app supplies a single copy of each.

## Importing components

Import each component from its own entry point so your bundle only includes what you use:

```js
import Input from '@qubejs/ui-material-base/Input';
import Button from '@qubejs/ui-material-base/Button';
```

The group and root entry points still work, but they pull in every component in the group:

```js
import { components } from '@qubejs/ui-material-base/basic'; // all "basic" components
import { components } from '@qubejs/ui-material-base'; // everything
```

The output is ES modules (ES2015 syntax, no injected polyfills).

## Running unit tests

Run `pnpm nx test ui-material-base` to execute the unit tests via [Jest](https://jestjs.io).
