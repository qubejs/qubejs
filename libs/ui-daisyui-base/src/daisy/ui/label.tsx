import * as React from 'react';
import { cn } from '../lib/utils';

export function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return <label className={cn('dy-label text-sm text-base-content', className)} {...props} />;
}
