import * as React from 'react';
import { cn } from '../lib/utils';

export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('dy-skeleton', className)} {...props} />;
}
