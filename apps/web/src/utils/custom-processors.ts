import { utils } from '@qubejs/web-react';

utils.processor.add('test', {
  name: (value, options, { state }) => {
    return value.replace('/content/', '/');
  },
  previewPath: (value, options, { state, userData }) => {
    console.log(options, state, userData );
    return value;
  },
});

