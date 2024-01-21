import { utils } from '@qubejs/core';
const { currency, signs } = utils.currency;

let currentCurrency = localStorage?.getItem('currency') || 'USD';

const set = (newCurr) => {
  if (currency[newCurr]) {
    currentCurrency = newCurr;
    localStorage && localStorage.setItem('currency', newCurr);
  }
};

const get = () => {
  return currentCurrency;
};

const getSign = (curr?) => {
  return signs[curr] || signs[currentCurrency] || '';
};

export default currency;

export { currency, signs, set, get, getSign };
