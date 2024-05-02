import middleWare from './middleware';
import { features } from '@qubejs/cms-admin';
import express from 'express';
import db from './database';
const { AdminPanel } = features.adminPanel;
const version = 'v1';
const prefix = 'api';
const router = express.Router();

let apis = {
  //   '/hooks': require('./' + prefix + '/' + version + '/hooks')
};

export default function (app) {
  apis = {
    ...new AdminPanel({
      router,
      db,
    }).get(),
    ...apis,
  };

  Object.keys(apis).forEach(function (routerName) {
    const apiRoutes = apis[routerName]();
    app.use('/' + prefix + '/' + version + routerName, middleWare, apiRoutes);
  });
}
