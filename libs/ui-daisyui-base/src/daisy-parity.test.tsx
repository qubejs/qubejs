/**
 * Renders every exported component of @qubejs/ui-daisyui-base next to its
 * @qubejs/ui-material-base counterpart with the same props, and checks that
 * - the same set of components is exported by both libraries
 * - nothing in ui-daisyui-base renders Material UI markup (Mui* classes) or ReUI markup
 * - every component that renders MUI markup in ui-material-base renders daisyUI markup
 *   (`dy-*` classes, or lucide icons where MUI rendered icons) in ui-daisyui-base.
 */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { plugins } from '@qubejs/web-react';
import * as daisy from './index';
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
    // daisyUI has no icon set: icons render as lucide SVGs
    daisy: html.querySelectorAll('[class*="dy-"], svg.lucide').length,
    reuiSlots: html.querySelectorAll('[data-slot]').length,
  };
  cleanup();
  return result;
};

const daisyComponents: Record<string, any> = (daisy as any).components;
const materialComponents: Record<string, any> = (material as any).components;

describe('ui-daisyui-base parity with ui-material-base', () => {
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  beforeAll(() => {
    // rendering ~130 components with generic props is noisy; failures are asserted below
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    plugins.register(daisy);
  });
  afterAll(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test('exports the same components as ui-material-base', () => {
    expect(Object.keys(daisyComponents).sort()).toEqual(Object.keys(materialComponents).sort());
  });

  const names = Object.keys(materialComponents).sort();

  test.each(names)('%s renders with daisyUI, without Material UI markup', (name) => {
    const daisyResult = renderComponent(daisyComponents[name], name);
    expect(daisyResult.mui).toBe(0);
    expect(daisyResult.reuiSlots).toBe(0);

    const materialResult = renderComponent(materialComponents[name], name);
    // the daisyUI version must not fail to render where the MUI version renders
    if (!materialResult.error) {
      expect(daisyResult.error).toBe(false);
    }
    // anything that rendered MUI elements must now render daisyUI elements
    if (materialResult.mui > 0) {
      expect(daisyResult.daisy).toBeGreaterThan(0);
    }
  });
});
