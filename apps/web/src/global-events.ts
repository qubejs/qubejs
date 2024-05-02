import { utils } from '@qubejs/web-react';
import './utils';

utils.apiBridge.events.subscribeOnce('onPrefix', function (data: any) {
  let url = '';
  Object.keys(utils.win.getWindow().APP_CONFIG.apiPrefix).forEach((item) => {
    if (!data.url.match(new RegExp('^http', 'i')) && data.url.match(item)) {
      url = utils.win.getWindow().APP_CONFIG.apiPrefix[item].prefix;
    }
  });
  return url;
});

utils.apiBridge.events.subscribeOnce('onRequestUrl', function (url: string) {
  if (url.startsWith('/crm')) {
    return url.replace('/crm', '');
  }
});
