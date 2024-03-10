import React from 'react';
import { render } from '@testing-library/react';
import BreadCrumb from './index';

xdescribe('BreadCrumb', () => {
  test('should render 1 read only text', () => {
    const { container } = render(
      <BreadCrumb
        currentPath={'/content/test'}
        navigation={[
          {
            title: 'test',
            url: '/content/test',
          },
        ]}
      />
    );
    const boxes = container.getElementsByClassName('sq-bread-crumbs');
    expect(boxes.length).toBe(1);
  });
});
