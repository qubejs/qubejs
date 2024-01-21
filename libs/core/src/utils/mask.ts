export default {
  email: function (email) {
    const parts = email.split('@');
    return [parts[0].substr(0, 1), '****@', parts[1]].join('');
  },
  phone: function (phone) {
    return [
      phone.substr(0, phone.length - 10),
      '******',
      phone.substr(phone.length - 4, 4),
    ].join('');
  },
};
