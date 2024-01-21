import { containers } from '@qubejs/web-react';
const { DynamicContent } = containers;
export default [
  {
    path: '/ho/*',
    element: <DynamicContent />,
  },
];
