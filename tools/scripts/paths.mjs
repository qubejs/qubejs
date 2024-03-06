import path from 'path';
import fs from 'fs';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// config after eject: we're in ./config/
export default {
  core: resolveApp('libs/core'),
  cms: resolveApp('libs/cms'),
  webreact: resolveApp('libs/web-react'),
  webreactSrc: resolveApp('libs/web-react/src'),
  dist: resolveApp('dist'),
  distWeb: resolveApp('dist/apps/web'),
};
export { resolveApp };
