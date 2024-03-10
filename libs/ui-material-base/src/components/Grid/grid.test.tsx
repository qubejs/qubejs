import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Grid from './index';
import './test-comps';

const columns = [
  {
    name: 'test',
    className: 'col-test',
  },
  {
    name: 'action',
    cmpType: 'Actions',
    component: {
      actions: [
        {
          buttonText: 'Save',
          actionType: 'save',
          className: 'save-action',
        },
        {
          className: 'can-action',
          buttonText: 'Cancel',
          actionType: 'cancel',
        },
      ],
    },
  },
];
const data1 = [
  {
    test: 'Hello',
  },
  {
    test: 'Hello2',
  },
];

describe('Grid', () => {
  test('should render Grid with defaults', () => {
    const { container } = render(<Grid />);
    expect(container.getElementsByClassName('sq-grid').length).toBe(1);
  });

  describe('No Data View', () => {
    test('should render no columns as no data view', () => {
      const { container } = render(<Grid fields={columns} />);
      expect(container.getElementsByClassName('sq-grid').length).toBe(1);
    });
  });

  describe('Data View', () => {
    let wrapper;
    describe('Basic Data View', () => {
      beforeEach(() => {
        const { container } = render(<Grid columns={columns} data={data1} />);
        wrapper = container;
      });
      test('should render header', () => {
        expect(wrapper.getElementsByClassName('sq-grid__header').length).toBe(
          1
        );
      });

      test('should render root wrapper', () => {
        expect(wrapper.getElementsByClassName('sq-grid__root').length).toBe(1);
      });
      test('should render 3 body wrapper', () => {
        expect(wrapper.getElementsByClassName('sq-grid__body').length).toBe(3);
      });
      test('should render two rows', () => {
        expect(screen.getAllByRole('row').length).toBe(2);
      });
    });
  });
  describe('Action tests', () => {
    let wrapper;
    const onAction = jest.fn((value, action, column) => ({
      value,
      action,
      column,
    }));
    describe('Basic Data View', () => {
      beforeEach(() => {
        const { container } = render(
          <Grid columns={columns} data={data1} onAction={onAction} />
        );
        wrapper = container;
      });
      test('should render header', () => {
        expect(screen.getAllByText('Save').length).toBe(2);
      });
      test('should render body wrapper', () => {
        expect(screen.getAllByText('Cancel').length).toBe(2);
      });
      test('should trigger onAction with row and action', () => {
        fireEvent.click(screen.getAllByText('Cancel')[0]);
        expect(onAction).toHaveBeenCalledWith(
          data1[0],
          {
            actionType: 'cancel',
            buttonText: 'Cancel',
            className: 'can-action',
          },
          columns[1]
        );
      });
    });
  });
  describe('Custom wrapper class', () => {
    test('should have button to add', () => {
      const { container } = render(
        <Grid className="custom-class" columns={columns} data={data1} />
      );
      expect(container.getElementsByClassName('custom-class').length).toBe(1);
    });
  });
});
