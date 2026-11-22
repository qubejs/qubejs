import * as React from 'react';
import { cn } from '../lib/utils';

/** daisyUI `join`: children become joined items. */
export function ButtonGroup({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div role="group" className={cn('dy-join', className)} {...props}>
      {React.Children.map(children, (child: any) =>
        React.isValidElement(child) ? React.cloneElement(child as any, { className: cn('dy-join-item', (child as any).props.className) }) : child
      )}
    </div>
  );
}
