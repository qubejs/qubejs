import { utils } from '@qubejs/core';
import { translate } from './translate';
import cookieMgr from './cookie-manager';
const { Validator, addValidator, getValidators, addMessage, getMessages, setObject } = utils.validator;

Validator.parseMessage = (message) => {
  return translate(message);
};
addValidator('hasCookieValue', (value, { cookieName }) => {
  return !!cookieMgr.getAll()[cookieName];
});

addValidator('cookieValue', (value, { cookieName }) => {
  return cookieMgr.getAll()[cookieName] === value;
});

export { Validator, addValidator, getValidators, addMessage, getMessages, setObject };
