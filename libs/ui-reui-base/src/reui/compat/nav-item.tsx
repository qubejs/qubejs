import * as React from 'react';
import { cn } from '../lib/utils';

/** Navigation list row (stand-in for MUI ListItemButton), styled with ReUI tokens. */
export function NavItem({
  selected = false,
  inset = false,
  className = '',
  children,
  ...props
}: React.ComponentProps<'button'> & { selected?: boolean; inset?: boolean }) {
  return (
    <button
      type="button"
      data-slot="nav-item"
      data-active={selected || undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        selected && 'bg-muted font-medium',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default NavItem;
