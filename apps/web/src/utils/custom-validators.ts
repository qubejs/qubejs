import { utils } from '@qubejs/web-react';
import config from '../config';

const { addValidator, addMessage } = utils.validator;
addValidator('hasMatchingUrl', (value, { setName }) => {
  const currentUrl = window.location.pathname;
  let isAllowed = false;
  config.urls[setName]?.forEach((item) => {
    if (new RegExp(item).test(currentUrl)) {
      isAllowed = true;
    }
  });
  return isAllowed;
});
