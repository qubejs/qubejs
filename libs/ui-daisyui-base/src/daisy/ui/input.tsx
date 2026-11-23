import * as React from 'react';
import { cn } from '../lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(function Input({ className, type, ...props }, ref) {
  return <input ref={ref} type={type} className={cn('dy-input w-full', className)} {...props} />;
});
