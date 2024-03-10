import { render } from '@testing-library/react';
import * as ui from '@qubejs/ui-material-base';
import { BrowserRouter } from 'react-router-dom';
import { plugins } from '@qubejs/web-react';
import App from './app';

plugins.register(ui);

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
