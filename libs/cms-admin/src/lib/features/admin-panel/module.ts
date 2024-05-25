import { Response } from '@qubejs/core';
export default ({ context }: any = {}) => {
  context.router.get('/module', function (req, res) {
    res.send(
      new Response({
        moduleName: 'admin',
      }).success()
    );
  });
};
