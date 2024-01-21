import { utils } from '@qubejs/core';
const { QueryString} = utils

const location = window.location;

const query = {
  get: (search?):any => {
    let browserSearch = '';
    if (location.href.indexOf('?') > -1) {
      browserSearch = location.href.substr(location.href.indexOf('?'));
    }
    return new QueryString(search || location.search || browserSearch).toObject();
  },
};
export { query, QueryString };
