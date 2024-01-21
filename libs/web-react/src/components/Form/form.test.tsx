import React from 'react';
import { render, screen } from '@testing-library/react';
import Form from './index';
import '../../ui.material';
// import { createFakeComponent } from '../../../tests/utils/fakeComp';
// import { mount } from 'enzyme';

// let fakeInput, fakeSelect;

describe('Form', () => {
  test('has 1 input field', () => {
    const { container } = render(
      <Form
        fields={[
          {
            label: 'First Name',
          },
          {
            label: 'Last Name',
          },
        ]}
      />
    );
    const boxes = container.getElementsByClassName('sq-input-field');
    expect(boxes.length).toBe(2);
  });
});
