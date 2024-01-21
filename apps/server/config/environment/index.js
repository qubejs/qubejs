import dotenv from 'dotenv';
import _ from 'lodash';
dotenv.config();
import defaults from './default';
import dev from './dev';
import development from './development';
import production from './production';
const evnv = {
  dev,
  development,
  production,
};
const enviroment =
  process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
if (!evnv[enviroment]) {
  throw `${enviroment} given not found`;
}
const config = evnv[enviroment];

console.log(enviroment);

export default _.merge(
  {
    env: enviroment,
  },
  defaults,
  config
);
