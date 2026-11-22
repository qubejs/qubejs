import * as React from 'react';
import { cn } from '../lib/utils';

export function Avatar({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className="dy-avatar dy-avatar-placeholder">
      <div className={cn('w-8 rounded-full bg-neutral text-neutral-content', className)} {...props}>
        {children}
      </div>
    </div>
  );
}
export function AvatarFallback({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-sm', className)} {...props} />;
}
