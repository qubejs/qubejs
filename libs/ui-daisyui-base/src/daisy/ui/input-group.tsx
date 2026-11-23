import * as React from 'react';
import { cn } from '../lib/utils';

/** daisyUI input with inline adornments (`<label class="input">…<input/>…</label>`). */
export function InputGroup({ className, children, ...props }: React.ComponentProps<'div'>) {
  const hasTextarea = React.Children.toArray(children).some((c: any) => c?.type === InputGroupTextarea);
  return (
    <div className={cn(hasTextarea ? 'dy-textarea flex h-auto w-full items-start gap-2' : 'dy-input flex w-full items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
}
export function InputGroupAddon({ className, align = 'inline-start', ...props }: React.ComponentProps<'div'> & { align?: string }) {
  return <div data-align={align} className={cn('flex shrink-0 items-center gap-1 opacity-70', className)} {...props} />;
}
export const InputGroupInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(function InputGroupInput({ className, ...props }, ref) {
  return <input ref={ref} className={cn('grow', className)} {...props} />;
});
export const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(function InputGroupTextarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn('grow resize-none bg-transparent outline-none', className)} {...props} />;
});
