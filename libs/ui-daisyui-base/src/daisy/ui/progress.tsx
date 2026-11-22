import * as React from 'react';
import { cn } from '../lib/utils';

export function Progress({ className, value, ...props }: React.ComponentProps<'progress'> & { value?: number }) {
  return <progress className={cn('dy-progress dy-progress-primary w-full', className)} value={value ?? undefined} max={100} {...props} />;
}
