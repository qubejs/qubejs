import { getWindow } from './utils/window';
const cordova = getWindow().cordova;

function resolveFile(filePath) {
  if (cordova) {
    return cordova.file.applicationDirectory + 'www/' + filePath.substr(2);
  } else {
    return filePath;
  }
}
function resolveImageUrl(filePath) {
  if (cordova) {
    return getWindow().API_SERVER + filePath;
  } else {
    return filePath;
  }
}

function getPathName() {
  if (cordova) {
    return getWindow().location.hash && getWindow().location.hash.substr(1);
  } else {
    return getWindow().location.pathname;
  }
}

function isiOS() {
  return !!getWindow().cordova && getWindow().cordova.platformId === 'ios';
}

function isAndroid() {
  return !!getWindow().cordova && getWindow().cordova.platformId === 'android';
}

function isApp() {
  return !!getWindow().cordova;
}

export {
  cordova,
  resolveFile,
  resolveImageUrl,
  getPathName,
  isAndroid,
  isiOS,
  isApp,
};
