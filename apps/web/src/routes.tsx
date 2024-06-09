import { containers } from '@qubejs/web-react';
import login from './pages/login';
import register from './pages/register';

const { DynamicContent } = containers;
export default [
  {
    path: '/content/*',
    element: <DynamicContent />,
  },
  {
    path: '/login',
    element: <DynamicContent {...login} />,
  },
  {
    path: '/register',
    element: <DynamicContent {...register} />,
  },
];
