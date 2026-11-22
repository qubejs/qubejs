import * as React from 'react';
import { cn } from '../lib/utils';

export function Separator({ className, orientation = 'horizontal', ...props }: React.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn('dy-divider m-0', orientation === 'vertical' ? 'dy-divider-horizontal h-full' : 'h-px', className)}
      {...props}
    />
  );
}
