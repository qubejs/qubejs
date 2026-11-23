import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Icon from './Icon';

describe('Icon', () => {
  describe('Icon:Defaults', () => {
    test('should render default icon', () => {
      const { container } = render(<Icon />);
      expect(container.getElementsByClassName('sq-icon--default').length).toBe(
        1
      );
    });
    test('should render given varient', () => {
      const { container } = render(<Icon name="help" variant={`error`} />);
      expect(container.getElementsByClassName('sq-icon--error').length).toBe(1);
    });
    test('should render given size', () => {
      const { container } = render(<Icon name="help" size={`large`} />);
      expect(container.getElementsByClassName('sq-icon--large').length).toBe(1);
    });
  });
});
