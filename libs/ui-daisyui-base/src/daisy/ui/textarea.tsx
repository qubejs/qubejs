import * as React from 'react';
import { cn } from '../lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn('dy-textarea w-full', className)} {...props} />;
});
