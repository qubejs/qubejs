const { Response } = require('@qubejs/core');
module.exports = ({ context } = {}) => {
  context.router.get('/module', function (req, res) {
    res.send(
      new Response({
        moduleName: 'admin',
      }).success()
    );
  });
};
