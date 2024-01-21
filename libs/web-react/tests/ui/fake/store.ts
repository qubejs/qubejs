export const create = ({ userData = {}, notification = {} } = {}) => {
  return {
    content: {
      userData: userData,
    },
    common: {
      notification: notification,
    },
  };
};
