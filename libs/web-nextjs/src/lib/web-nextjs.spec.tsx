import { render } from '@testing-library/react';

import WebNextjs from './web-nextjs';

describe('WebNextjs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WebNextjs />);
    expect(baseElement).toBeTruthy();
  });
});
