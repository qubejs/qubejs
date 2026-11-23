import * as React from 'react';
import { cn } from '../lib/utils';

const variants: Record<string, string> = {
  default: '',
  info: 'dy-alert-info',
  success: 'dy-alert-success',
  warning: 'dy-alert-warning',
  destructive: 'dy-alert-error',
  invert: '',
};
/** daisyUI `alert` (soft style). Children: icon, AlertTitle, AlertDescription, AlertAction. */
export function Alert({ className, variant = 'default', children, ...props }: React.ComponentProps<'div'> & { variant?: string }) {
  const items = React.Children.toArray(children);
  const isText = (c: any) => c?.type === AlertTitle || c?.type === AlertDescription;
  const icon = items.filter((c: any) => !isText(c) && c?.type !== AlertAction);
  const text = items.filter(isText);
  const action = items.filter((c: any) => c?.type === AlertAction);
  return (
    <div role="alert" className={cn('dy-alert dy-alert-soft w-full', variants[variant] ?? '', className)} {...props}>
      {icon}
      <div className="flex flex-col">{text}</div>
      {action}
    </div>
  );
}
export function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('font-semibold', className)} {...props} />;
}
export function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-sm', className)} {...props} />;
}
export function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('ml-auto', className)} {...props} />;
}
