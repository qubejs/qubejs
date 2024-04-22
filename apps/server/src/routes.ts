const middleWare = require('./middleware');

const version = 'v1';
const prefix = 'api';

const apis = {
  '/hooks': require('./' + prefix + '/' + version + '/hooks')
};

module.exports = function (app) {
  Object.keys(apis).forEach(function (routerName) {
    var apiRoutes = apis[routerName]();
    app.use('/api/' + version + routerName, middleWare, apiRoutes);
  });
};
