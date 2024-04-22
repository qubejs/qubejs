// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  // RouterProvider,
  // createHashRouter,
} from 'react-router-dom';
import { storage, utils, ThemeProvider } from '@qubejs/web-react';
import { Provider } from 'react-redux';
import theme from '../styles/themes/main/main.theme';
import { store } from '../redux';
import routes from '../routes';
import containers from '../containers';
import templates from '../templates';
import '../styles/themes/main/index.scss';
import config from '../config';
import Content from '../templates/Content';
const {
  redirect: { setUrlMapping, setNavigate },
} = utils;

setUrlMapping(config.urlMapping);

storage.containers.set({
  ...containers,
  ...templates,
});

export function App() {
  const navigate = useNavigate();
  // const { Snackbar } = storage.components.get();
  const { Application } = storage.containers.get();
  const onUnauthroized = () => {
    // appActions.clearUser();
    const url = window.location.pathname + window.location.search;
    if (url.indexOf('/login') === -1) {
      utils.redirect.redirectTo('login', { returnUrl: url });
    }
  };
  useEffect(() => {
    utils.redirect.setNavigate(navigate);
    utils.apiBridge.events.subscribeOnce('onUnauthroized', onUnauthroized);
    const token = utils.cookie.get('token');
    utils.apiBridge.addHeader(
      'tenantCode',
      utils.win.getWindow().APP_CONFIG.tenantCode
    );
    if (token) {
      utils.apiBridge.addHeader('Authorization', `Bearer ${token}`);
    }
    // appActions.initApplication(config).then(() => appActions.setAppLoaded());
  }, []);
  useEffect(() => {
    setNavigate(navigate);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Application>
          <Content>
            <Routes>
              {routes.map((item) => {
                return <Route key={item.path} {...item}></Route>;
              })}
              <Route path="*" element={<Navigate to="/ho/home" />} />
            </Routes>
          </Content>
        </Application>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
