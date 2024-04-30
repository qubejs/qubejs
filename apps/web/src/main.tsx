import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import * as uiMaterial from '@qubejs/ui-material-base';
import { Provider } from 'react-redux';
// import * as uiMaterial from '@qubejs/ui-material-base';
import { plugins } from '@qubejs/web-react';
import { store } from './redux';
import App from './app/app';
import './global-events';
plugins.register(uiMaterial);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

const setFullHeight = () => {
  const item: any = document.querySelector(':root');
  item?.style?.setProperty('--vh', window.innerHeight / 100 + 'px');
};
window.addEventListener('resize', () => {
  console.log('set done');
  setFullHeight();
});
setFullHeight();
