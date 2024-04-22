import middleWare from './middleware';
import { features } from '@qubejs/cms';
import db from './database';
const { AdminPanel } = features.default.adminPanel;
const version = 'v1';
const prefix = 'api';

const apis = {
  ...new AdminPanel({
    db,
  }).get(),
  //   '/hooks': require('./' + prefix + '/' + version + '/hooks')
};

export default function (app) {
  console.log(apis);
  Object.keys(apis).forEach(function (routerName) {
    const apiRoutes = apis[routerName]();
    app.use('/'+ prefix + '/' + version + routerName, middleWare, apiRoutes);
  });
}
