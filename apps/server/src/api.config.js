
module.exports = {
  version: 'v2',
  prefix: 'api',
  getUrl: function (relativeUrl) {
    return ['/', this.prefix, '/', this.version, relativeUrl].join('');
  }
};