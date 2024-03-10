import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './index';

describe('Input', () => {
 test('should render Input component without crash', () => {
    const { container } = render(<Input />);
    expect(container.getElementsByClassName('sq-input-field').length).toBe(1);
  });
  describe('Input:focus', () => {
   test('should have "sq-input-field--focused" class while on focus', () => {
      const { container } = render(<Input label={'Name'} />);
      fireEvent.focus(screen.getByLabelText('Name'));
      expect(
        container.getElementsByClassName('sq-input-field--focused').length
      ).toBe(1);
    });
  });
  describe('Input:onBlur()', () => {
   test('should call onBlur with entered value', () => {
      const onBlur = jest.fn();
      render(<Input label={'Name'} onBlur={onBlur} />);
      fireEvent.focus(screen.getByLabelText('Name'));
      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'hello' },
      });
      fireEvent.blur(screen.getByLabelText('Name'));
      expect(onBlur).toHaveBeenCalledWith({ value: 'hello' });
    });
  });

  describe('Input:onKeyPress()', () => {
   test('should call onKeyPress with entered value', () => {
      const onKeyPress = jest.fn();
      render(<Input label={'Name'} onKeyPress={onKeyPress} />);
      fireEvent.focus(screen.getByLabelText('Name'));
      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'hello' },
      });
      fireEvent.blur(screen.getByLabelText('Name'));
      expect(onKeyPress).toHaveBeenCalledWith({ value: 'hello' });
    });
  });
});
