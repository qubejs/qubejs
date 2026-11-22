import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { plugins } from '@qubejs/web-react';
import { store } from './redux';
import App from './app/app';
import { UiLibrarySwitcher, getUiLibrary, loadUiLibrary } from './app/ui-library';
import './global-events';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Switch the component library with ?ui=reui (ReUI), ?ui=daisyui (daisyUI) or ?ui=material.
// For a single library this is simply:
//   import * as uiReui from '@qubejs/ui-reui-base';
//   plugins.register(uiReui);
const uiLibrary = getUiLibrary();
loadUiLibrary(uiLibrary).then((ui) => {
  plugins.register(ui);
  root.render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <UiLibrarySwitcher current={uiLibrary} />
      </Provider>
    </BrowserRouter>
  );
});

const setFullHeight = () => {
  const item: any = document.querySelector(':root');
  item?.style?.setProperty('--vh', window.innerHeight / 100 + 'px');
};
window.addEventListener('resize', () => {
  console.log('set done');
  setFullHeight();
});
setFullHeight();
