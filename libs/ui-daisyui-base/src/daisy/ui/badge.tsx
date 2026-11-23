import * as React from 'react';
import { cn } from '../lib/utils';

const variants: Record<string, string> = {
  default: 'dy-badge-primary',
  secondary: 'dy-badge-ghost',
  outline: 'dy-badge-outline',
  destructive: 'dy-badge-error',
  info: 'dy-badge-info',
  success: 'dy-badge-success',
  warning: 'dy-badge-warning',
};
export function Badge({ className, variant = 'default', ...props }: React.ComponentProps<'span'> & { variant?: string }) {
  return <span className={cn('dy-badge', variants[variant] ?? variants.default, className)} {...props} />;
}
