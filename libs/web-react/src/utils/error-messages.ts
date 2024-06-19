import { translate } from './translate';

let MESSAGES = {
  INVALID_CREDENTIALS: "Username or Password doesn't match.",
  INSUFFICIENT_PERMISSION: "You don't have sufficent permission to access this",
  NOT_LOGGED_IN: "You aren't logged in please login to access the application",
  DUPLICATE_RECORD: "Record is already registered",
  DATA_INEGRITY: 'Unable to delete record, depent data found.',
  INVALID_LICENCE: 'Missing valid licence key',
  UNEXPECTED_ERROR: 'Oops something went wrong.',
  EMAIL_NOT_VERIFIED: 'Opps looks like your email is not verified. Please check your inbox and verify your email.'
};

const addMessages = (newMessages) => {
  MESSAGES = {
    ...MESSAGES,
    ...newMessages
  };
};

const messages = {
  get: (key) => {
    return translate(MESSAGES[key]);
  }
};

export { messages, addMessages };
