import * as React from 'react';
import { cn } from '../lib/utils';

type Props = Omit<React.ComponentProps<'input'>, 'checked' | 'onChange'> & {
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean) => void;
};
export const Checkbox = React.forwardRef<HTMLInputElement, Props>(function Checkbox({ className, checked, onCheckedChange, ...props }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn('dy-checkbox dy-checkbox-sm dy-checkbox-primary', className)}
      checked={checked === true}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      {...props}
    />
  );
});
