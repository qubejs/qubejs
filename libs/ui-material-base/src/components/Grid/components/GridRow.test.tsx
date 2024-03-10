import { render, screen, fireEvent } from '@testing-library/react';
import GridRow from './GridRow';
import '../test-comps';

const columns = [
  {
    name: 'name',
    className: 'col-name',
    headerText: 'Name',
    component: {
      label: 'Name',
    },
    cmpType: 'Input',
  },
  {
    name: 'designation',
    component: {
      label: 'Designation',
    },
    className: 'col-designation',
    headerText: 'Designation',
    cmpType: 'Input',
  },
];

describe('GridRow', () => {
 test('should render', () => {
    const { container } = render(<GridRow />);
    expect(container.getElementsByClassName('sq-grid__data-row').length).toBe(
      1
    );
  });

  describe('GridRow:Columns', () => {
    let wrapper;
    beforeEach(() => {
      const { container } = render(
        <GridRow
          columns={columns}
          data={{ name: 'Hello', designation: 'Desig' }}
        />
      );
      wrapper = container;
    });
   test('should render apply given class on column', () => {
      expect(screen.getByDisplayValue('Hello')).toBeVisible();
    });
   test('should render apply given class on column', () => {
      expect(screen.getByDisplayValue('Desig')).toBeVisible();
    });
  });
  describe('GridRow:onRowChange', () => {
    let wrapper,
      onRowChange = jest.fn();
    beforeEach(() => {
      const { container } = render(
        <GridRow
          columns={columns}
          data={{ name: 'Hello', designation: 'Desig' }}
          onRowChange={onRowChange}
        />
      );
      wrapper = container;
    });

   test('should render given columns', () => {
      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'dssf' },
      });
      fireEvent.blur(screen.getByLabelText('Name'));
      expect(onRowChange).toHaveBeenCalled();
    });
  });
  describe('GridRow:onColumnChange', () => {
   test('should call onColumnChange', () => {
      const onColumnChange = jest.fn();
      const { container } = render(
        <GridRow
          columns={columns}
          data={{ name: 'Hello', designation: 'Desig' }}
          onColumnChange={onColumnChange}
        />
      );
      fireEvent.change(screen.getByLabelText('Designation'), {
        target: { value: 'dssf' },
      });
      fireEvent.blur(screen.getByLabelText('Designation'));
      expect(onColumnChange).toHaveBeenCalled();
    });
  });
  describe('GridRow:onFieldBlur', () => {
   test('should call onFieldBlur', () => {
      const onFieldBlur = jest.fn();
      render(
        <GridRow
          columns={columns}
          data={{ name: 'Hello', designation: 'Desig' }}
          onFieldBlur={onFieldBlur}
        />
      );
      fireEvent.change(screen.getByLabelText('Designation'), {
        target: { value: 'dssf' },
      });
      fireEvent.blur(screen.getByLabelText('Designation'));
      expect(onFieldBlur).toHaveBeenCalled();
    });
  });
});
