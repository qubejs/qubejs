import { configureStore } from '@reduxjs/toolkit';
import 'whatwg-fetch';
import { reducers } from '@qubejs/web-react';
// import auth from './auth';
// import app from './app';

const store = configureStore({
  reducer: {
    ...reducers.default,
    // auth,
    // app,
  },
});

export { store };
