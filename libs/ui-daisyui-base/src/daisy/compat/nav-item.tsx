import * as React from 'react';
import { cn } from '../lib/utils';

/** Navigation list row (stand-in for MUI ListItemButton), styled as a daisyUI ghost button. */
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
      data-part="nav-item"
      data-active={selected || undefined}
      className={cn(
        'dy-btn dy-btn-ghost w-full justify-start gap-3 font-normal',
        selected && 'dy-btn-active font-medium',
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
