import { render } from '@testing-library/react';

import WebNext from './web-next';

describe('WebNext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WebNext />);
    expect(baseElement).toBeTruthy();
  });
});
