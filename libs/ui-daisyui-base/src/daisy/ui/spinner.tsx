import * as React from 'react';
import { cn } from '../lib/utils';

export function Spinner({ className, ...props }: React.ComponentProps<'span'>) {
  return <span role="status" aria-label="Loading" className={cn('dy-loading dy-loading-spinner', className)} {...props} />;
}
