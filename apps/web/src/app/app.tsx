// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  // RouterProvider,
  // createHashRouter,
} from 'react-router-dom';
import { storage, utils, ThemeProvider, reducers } from '@qubejs/web-react';

import theme from '../styles/themes/main/main.theme';
import routes from '../routes';
import containers from '../containers';
import templates from '../templates';
import '../styles/themes/main/index.scss';
import config from '../config';
import Content from '../templates/Content';
const {
  redirect: { setUrlMapping, setNavigate },
} = utils;

const { closeNotification, closePopup, closePopupScreen } = reducers.common;
const { initApplication, selectUserData } = reducers.content;

const { DynamicContent, Application } = containers;
setUrlMapping(config.urlMapping);

storage.containers.set({
  ...containers,
  ...templates,
});

export function App({ appActions }) {
  const navigate = useNavigate();
  const [loaded, setAppLoaded] = useState(false);
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
    appActions.initApplication(config).then(() => setAppLoaded(true));
  }, []);
  useEffect(() => {
    setNavigate(navigate);
  }, []);

  return (
    <>
      {loaded && (
        <ThemeProvider theme={theme}>
          <Application>
            <Content>
              <Routes>
                {routes.map((item) => {
                  return <Route key={item.path} {...item}></Route>;
                })}
                <Route path="*" element={<Navigate to="/content/home" />} />
              </Routes>
            </Content>
          </Application>
        </ThemeProvider>
      )}
    </>
  );
}
const mapStateToProps = (state: any) => {
  return {
    appStore: state,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    appActions: {
      initApplication: (data: any) => dispatch(initApplication(data)),
      closeNotification: () => dispatch(closeNotification()),
      closePopup: () => dispatch(closePopup()),
      closePopupScreen: () => dispatch(closePopupScreen()),
    },
    raiseAction: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
