import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import * as ui from '@qubejs/ui-material-base';
import { Router } from 'react-router-dom';
import { plugins } from '@qubejs/web-react';
import { store } from '../redux';
import App from './app';

plugins.register(ui);

describe('App', () => {
  it('should render successfully', () => {
    const history = createMemoryHistory({ initialEntries: ['/content/home'] });
    const { baseElement } = render(
      <Router location={history.location} navigator={history}>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    );
    expect(baseElement).toBeTruthy();
  });
});
