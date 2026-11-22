import * as React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { FloatingPanel, FloatingRoot, FloatingTrigger, useFloating, type FloatingPanelProps } from '../lib/floating';

/** Menus on daisyUI `menu`, positioned by lib/floating. */
export const DropdownMenu = FloatingRoot;
export const DropdownMenuTrigger = FloatingTrigger;

export function DropdownMenuContent({ className, align = 'start', children, onKeyDown, ...props }: FloatingPanelProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role^=menuitem]:not([aria-disabled=true])') || []);
    const idx = items.indexOf(document.activeElement as HTMLElement);
    items[(idx + dir + items.length) % items.length]?.focus();
  };
  return (
    <FloatingPanel
      ref={ref}
      align={align}
      className={cn('min-w-40 p-0', className)}
      onKeyDown={(e) => {
        onKeyDown && onKeyDown(e);
        if (e.key === 'ArrowDown') (e.preventDefault(), move(1));
        if (e.key === 'ArrowUp') (e.preventDefault(), move(-1));
      }}
      {...props}
    >
      <ul role="menu" className="dy-menu w-full">
        {children}
      </ul>
    </FloatingPanel>
  );
}

type ItemProps = Omit<React.ComponentProps<'button'>, 'onSelect'> & { onSelect?: (e: Event) => void; disabled?: boolean };
function useSelect(onSelect?: (e: Event) => void) {
  const { setOpen } = useFloating();
  return (native: Event) => {
    onSelect && onSelect(native);
    if (!native.defaultPrevented) setOpen(false);
  };
}
export function DropdownMenuItem({ className, onSelect, onClick, disabled, children, ...props }: ItemProps) {
  const select = useSelect(onSelect);
  return (
    <li className={cn(disabled && 'dy-menu-disabled')}>
      <button
        type="button"
        role="menuitem"
        aria-disabled={disabled || undefined}
        disabled={disabled}
        className={cn('gap-2', className)}
        onClick={(e) => {
          onClick && onClick(e);
          if (!e.defaultPrevented) select(e.nativeEvent);
        }}
        {...props}
      >
        {children}
      </button>
    </li>
  );
}
export function DropdownMenuCheckboxItem({ className, checked, onCheckedChange, onSelect, children, ...props }: ItemProps & { checked?: boolean; onCheckedChange?: (c: boolean) => void }) {
  const select = useSelect(onSelect);
  return (
    <li>
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={!!checked}
        className={cn('gap-2', className)}
        onClick={(e) => {
          onCheckedChange && onCheckedChange(!checked);
          select(e.nativeEvent);
        }}
        {...props}
      >
        <span className="flex size-4 items-center justify-center">{checked && <CheckIcon className="size-4" />}</span>
        {children}
      </button>
    </li>
  );
}
export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('dy-menu-title', className)} {...props} />;
}
export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <li role="separator" className={cn('my-1 h-px bg-base-300', className)} />;
}
