import * as React from 'react';
import { cn } from '../lib/utils';

type Props = Omit<React.ComponentProps<'input'>, 'checked' | 'onChange'> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void };
export const Switch = React.forwardRef<HTMLInputElement, Props>(function Switch({ className, checked, onCheckedChange, ...props }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      role="switch"
      className={cn('dy-toggle dy-toggle-primary dy-toggle-sm', className)}
      checked={!!checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      {...props}
    />
  );
});
