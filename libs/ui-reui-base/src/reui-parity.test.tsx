/**
 * Renders every exported component of @qubejs/ui-reui-base next to its
 * @qubejs/ui-material-base counterpart with the same props, and checks that
 * - the same set of components is exported by both libraries
 * - nothing in ui-reui-base renders Material UI markup (Mui* classes)
 * - every component that renders MUI markup in ui-material-base renders ReUI markup
 *   (shadcn/ReUI `data-slot` elements or lucide icons) in ui-reui-base.
 */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { plugins } from '@qubejs/web-react';
import * as reui from './index';
import * as material from '../../ui-material-base/src/index';

const store = configureStore({ reducer: (s = {}) => s });

const options = [
  { text: 'One', value: 'one', iconName: 'home' },
  { text: 'Two', value: 'two', iconName: 'edit' },
];
const commonProps: Record<string, any> = {
  label: 'Label',
  text: 'Text',
  title: 'Title',
  header: 'Header',
  message: 'Message',
  buttonText: 'Button',
  iconName: 'home',
  name: 'field',
  value: 'one',
  options,
  items: [
    { title: 'Item 1', name: 'Item 1', description: 'd', iconName: 'home', imgUrl: '' },
    { title: 'Item 2', name: 'Item 2', description: 'd', iconName: 'edit', imgUrl: '' },
  ],
  links: [
    { label: 'Home', value: 'home', icon: 'home' },
    { label: 'Edit', value: 'edit', icon: 'edit' },
  ],
  actions: [{ buttonText: 'Act', iconName: 'edit', action: 'act' }],
  listOfActions: [{ buttonText: 'Profile', iconName: 'person' }],
  user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
  data: [{ text: 'Row', value: 'row' }],
  textField: 'text',
  valueField: 'value',
  count: 5,
  open: true,
  rightMenu: [{ icon: 'mail', total: 2 }],
  navigation: [],
  currentPath: '/',
  userData: {},
};

// Components rendered in a portal / closed state by default get extra props here.
const perComponentProps: Record<string, Record<string, any>> = {
  Dialog: { open: true, content: 'Body', actions: [{ buttonText: 'OK' }] },
  Snackbar: { open: true, message: 'Saved' },
  Progress: { style: 'static' },
  ProgressIndicator: { value: 40 },
  Pagination: { value: { currentPage: 1 }, count: 5 },
  Checkbox: { value: 'on' },
  CheckboxList: { value: ['one'] },
  Tabs: { value: 'one' },
  Slider: { value: 20 },
  DateSelector: { value: '2024-01-15T00:00:00.000Z' },
  Autocomplete: { value: 'one' },
  AutoCompleteValue: { value: 'one,two' },
  Select: { value: 'one' },
  Radio: { value: 'one' },
  Switch: { value: true },
  Input: { value: 'abc' },
  Textarea: { value: 'abc' },
};

class Boundary extends React.Component<{ children: React.ReactNode }, { error?: any }> {
  state: { error?: any } = {};
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? <div data-render-error="true" /> : this.props.children;
  }
}

const renderComponent = (Comp: any, name: string) => {
  const props = { ...commonProps, ...(perComponentProps[name] || {}) };
  const { baseElement } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Boundary>
          <Comp {...props} />
        </Boundary>
      </MemoryRouter>
    </Provider>
  );
  const html = baseElement as HTMLElement;
  const result = {
    error: !!html.querySelector('[data-render-error]'),
    mui: html.querySelectorAll('[class*="Mui"]').length,
    reui: html.querySelectorAll('[data-slot], svg.lucide').length,
  };
  cleanup();
  return result;
};

const reuiComponents: Record<string, any> = (reui as any).components;
const materialComponents: Record<string, any> = (material as any).components;

describe('ui-reui-base parity with ui-material-base', () => {
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  beforeAll(() => {
    // rendering ~130 components with generic props is noisy; failures are asserted below
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    plugins.register(reui);
  });
  afterAll(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test('exports the same components as ui-material-base', () => {
    expect(Object.keys(reuiComponents).sort()).toEqual(Object.keys(materialComponents).sort());
  });

  const names = Object.keys(materialComponents).sort();

  test.each(names)('%s renders without Material UI markup', (name) => {
    const reuiResult = renderComponent(reuiComponents[name], name);
    expect(reuiResult.mui).toBe(0);

    const materialResult = renderComponent(materialComponents[name], name);
    // the ReUI version must not fail to render where the MUI version renders
    if (!materialResult.error) {
      expect(reuiResult.error).toBe(false);
    }
    // anything that rendered MUI elements must now render ReUI elements
    if (materialResult.mui > 0) {
      expect(reuiResult.reui).toBeGreaterThan(0);
    }
  });
});
