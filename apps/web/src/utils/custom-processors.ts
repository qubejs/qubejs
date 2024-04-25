import { utils } from '@qubejs/web-react';

utils.processor.add('test', {
  name: (value, options, { state }) => {
    return value.replace('/content/', '/');
  },
});
