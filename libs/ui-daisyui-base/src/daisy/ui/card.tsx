import * as React from 'react';
import { cn } from '../lib/utils';

export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('dy-card dy-card-border bg-base-100', className)} {...props} />;
}
