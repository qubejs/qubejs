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
  const { Snackbar } = storage.components.get();
  const { Application } = storage.containers.get();
  useEffect(() => {
    setNavigate(navigate);
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Application>
          <Routes>
            {routes.map((item) => {
              return <Route key={item.path} {...item}></Route>;
            })}
            <Route path="*" element={<Navigate to="/ho/home" />} />
          </Routes>
        </Application>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
