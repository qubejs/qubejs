import * as React from 'react';
import { cn } from '../lib/utils';
import { Slot } from '../lib/slot';

/** daisyUI `list` / `list-row`. */
export function ItemGroup({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul role="list" className={cn('dy-list', className)} {...props} />;
}
export function Item({ className, asChild, size, children, ...props }: React.ComponentProps<'div'> & { asChild?: boolean; size?: string; variant?: string }) {
  const Comp: any = asChild ? Slot : 'div';
  return (
    <li className="contents">
      <Comp className={cn('dy-list-row w-full items-center border-0 bg-transparent text-left', asChild && 'cursor-pointer', size === 'sm' && 'py-2', className)} {...props}>
        {children}
      </Comp>
    </li>
  );
}
export function ItemMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex shrink-0 items-center', className)} {...props} />;
}
export function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex min-w-0 flex-1 flex-col', className)} {...props} />;
}
export function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-sm font-medium', className)} {...props} />;
}
export function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('m-0 text-xs opacity-60', className)} {...props} />;
}
