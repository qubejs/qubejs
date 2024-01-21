const currency = {
  USD: 'US Dollar',
  INR: 'Indian Rupee',
  AUD: 'Australian Dollar',
  EUR: 'Euro',
  JPY: 'Japanese Yen',
  GBP: 'Pounds',
  RUB: 'Russian ruble',
  AED: 'Emirati dirham',
  CAD: 'Canadian dollar',
};

const signs = {
  USD: '$',
  CAD: '$',
  INR: '₹',
  GBP: '£',
  AUD: '$',
  EUR: '€',
  AED: 'د.إ',
  RUB: '₽',
  JPY: '¥',
};

Object.keys(currency).forEach((currKey) => {
  if (signs[currKey]) {
    currency[currKey] = '(' + signs[currKey] + ') ' + currency[currKey];
  }
});
const getSign = (curr) => {
  return signs[curr];
};

export { currency, signs, getSign };
