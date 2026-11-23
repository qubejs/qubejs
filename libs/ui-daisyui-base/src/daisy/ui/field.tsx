import * as React from 'react';
import { cn } from '../lib/utils';

/** Form layout on daisyUI `fieldset` / `label`. */
export function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return <fieldset className={cn('dy-fieldset flex flex-col gap-2 py-0', className)} {...props} />;
}
export function FieldLegend({ className, variant = 'legend', ...props }: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return <legend data-variant={variant} className={cn('dy-fieldset-legend', variant === 'label' && 'text-sm', className)} {...props} />;
}
export function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-3', className)} {...props} />;
}
export const Field = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'> & { orientation?: 'vertical' | 'horizontal' }>(function Field(
  { className, orientation = 'vertical', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn('flex w-full', orientation === 'horizontal' ? 'flex-row items-center gap-2' : 'flex-col gap-1.5', className)}
      {...props}
    />
  );
});
export function FieldLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return <label className={cn('dy-label cursor-pointer text-sm text-base-content', className)} {...props} />;
}
export function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('dy-label m-0 text-xs whitespace-normal', className)} {...props} />;
}
