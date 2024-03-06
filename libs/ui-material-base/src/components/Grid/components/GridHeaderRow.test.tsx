import { render, screen, fireEvent } from '@testing-library/react';
import GridHeaderRow from './GridHeaderRow';

const columns = [
  {
    name: 'test',
    className: 'col-test',
    headerText: 'Test',
  },
];

describe('GridHeaderRow', () => {
 test('should render', () => {
    const { container } = render(<GridHeaderRow />);
    expect(container.getElementsByClassName('sq-grid__header-row').length).toBe(
      1
    );
  });

  describe('GridHeaderRow:Columns', () => {
    let wrapper;
    beforeEach(() => {
      const { container } = render(<GridHeaderRow columns={columns} />);
      wrapper = container;
    });

   test('should render given columns', () => {
      expect(
        wrapper.getElementsByClassName('sq-grid__header-row-cell').length
      ).toBe(1);
    });
   test('should render apply given class on column', () => {
      expect(wrapper.getElementsByClassName('col-test').length).toBe(1);
    });
   test('should have text "Test"', async () => {
      expect(await screen.findByText('Test')).toBeVisible();
    });
  });
});
