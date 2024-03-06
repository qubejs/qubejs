import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridCell from './GridCell';

const columns = [
  {
    name: 'test',
    cmpType: 'Input',
    className: 'col-test',
    component: { label: 'Test' },
  },
  {
    name: 'test1',
    className: 'col-test1',
    cmpType: 'Input',
    component: { label: 'Test1' },
  },
  {
    name: 'test2',
    className: 'col-test2',
    cmpType: 'Input',
    component: { label: 'Test2' },
    beforeRender: () => {
      return {
        className: 'col-override',
        cmpType: 'Button',
        component: { buttonText: 'hello' },
      };
    },
  },
];

const setup = (props) => {
  const utils = render(<GridCell {...props} />);
  const input = utils.getByLabelText('Test');
  return {
    input,
    ...utils,
  };
};

describe('GridCell', () => {
 test('should render', () => {
    const { container: wrapper } = render(<GridCell />);
    expect(wrapper.getElementsByClassName('sq-grid__data-cell').length).toBe(1);
  });

  describe('GridCell:Column', () => {
    let wrapper;
    beforeEach(() => {
      const { container } = render(<GridCell column={columns[0]} />);
      wrapper = container;
    });

   test('should render apply given class on column', () => {
      expect(wrapper.getElementsByClassName('col-test').length).toBe(1);
    });
  });
  describe('GridCell:Input Component', () => {
    let wrapper,
      onChange = jest.fn(),
      onKeyPress = jest.fn(),
      onBlur = jest.fn();
    beforeEach(() => {
      const { container } = render(
        <GridCell column={columns[1]} onChange={onChange} onKeyPress={onKeyPress} onBlur={onBlur} />
      );
      wrapper = container;
    });
   test('should render raise onChange event with child component', () => {
      fireEvent.change(screen.getByLabelText('Test1'), {
        target: { value: '1' },
      });
      expect(onKeyPress).toHaveBeenCalledWith(columns[1], { value: '1' });
    });
   test('should render raise onBlur with child component', () => {
      fireEvent.change(screen.getByLabelText('Test1'), {
        target: { value: '12' },
      });
      fireEvent.blur(screen.getByLabelText('Test1'));
      expect(onBlur).toHaveBeenCalledWith(columns[1], { value: '12' });
    });
  });

  describe('GridCell:beforeRender', () => {
    let wrapper;
    beforeEach(() => {
      const { container } = render(<GridCell column={columns[2]} />);
      wrapper = container;
    });
   test('should render Button component', () => {
      expect(wrapper.getElementsByClassName('sq-button').length).toBe(1);
    });
  });
});
