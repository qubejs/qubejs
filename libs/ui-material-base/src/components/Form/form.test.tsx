import React from 'react';
import { render, screen } from '@testing-library/react';
import { utils } from '@qubejs/web-react';
import Form from './index';
import Input from '../Input';
import Button from '../Button';
import Actions from '../Actions';
import Link from '../Link';
import LinkButton from '../LinkButton';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import Header from '../Header';
import Text from '../Text';
// import '../../ui.material';
// import { createFakeComponent } from '../../../tests/utils/fakeComp';
// import { mount } from 'enzyme';

// let fakeInput, fakeSelect;

utils.storage.components.set({
  Input,
  Button,
  Checkbox,
  Icon,
  Header,
  Text,
  Link,
  LinkButton,
  Actions,
});

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
