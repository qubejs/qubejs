import { CONSTANTS } from '../../globals';
import CustomModule from '../../utils/custom-module';
import apiBridge from '../../utils/api-bridge';
const customHooks = new CustomModule();

customHooks.add('data', {
  extractResult: (result, { dataKey = 'data', rootKey = 'data', rootErrorKey = 'error', index = 0 } = {}) => {
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      if (result[rootKey] && result[rootKey][dataKey] && result[rootKey][dataKey].length > index) {
        return result[rootKey][dataKey][index];
      }
    } else if (result.status === CONSTANTS.STATUS.ERROR) {
      if (result[rootErrorKey] && result[rootErrorKey]) {
        return result[rootErrorKey];
      }
    }
    return null;
  },
});

customHooks.add('contentPages', {
  getAppsData: async (result, data) => {
    let navigation = [];
    const promises = [];
    if (data.payload?.apps) {
      const siteMapPath = data.payload.dataUrl || '/env/sitemap.json';
      data.payload.apps.forEach((appName) => {
        promises.push(apiBridge.get(`${appName === '/' ? '' : `/${appName}`}${siteMapPath}`));
      });
    }
    await Promise.all(promises).then((result) => {
      result.forEach((dataItem) => {
        if (dataItem?.data?.navigation) {
          navigation = [...navigation, ...dataItem?.data?.navigation];
        }
      });
    });
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      return {
        ...result,
        data: {
          navigation,
        },
      };
    }
  },
  extractDataArray: (result) => {
    if (result.status === CONSTANTS.STATUS.SUCCESS) {
      return {
        ...result.data,
        pages: result.data.data,
      };
    }
  },
});

export { customHooks };
