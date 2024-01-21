import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <App />
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
