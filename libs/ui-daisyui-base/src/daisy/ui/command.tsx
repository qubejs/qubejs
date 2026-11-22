import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * Minimal command list (keyboard navigable listbox) used by the autocomplete adapter.
 * Arrow keys / Enter are handled at the root, so a focused input inside it drives the list.
 */
interface Ctx {
  active: string | null;
  setActive: (v: string | null) => void;
  items: React.MutableRefObject<Map<string, () => void>>;
  order: React.MutableRefObject<string[]>;
}
const CommandCtx = React.createContext<Ctx | null>(null);

export function Command({ className, children, shouldFilter, onKeyDown, ...props }: React.ComponentProps<'div'> & { shouldFilter?: boolean }) {
  const [active, setActive] = React.useState<string | null>(null);
  const items = React.useRef(new Map<string, () => void>());
  const order = React.useRef<string[]>([]);
  return (
    <CommandCtx.Provider value={{ active, setActive, items, order }}>
      <div
        className={cn(className)}
        onKeyDown={(e) => {
          onKeyDown && onKeyDown(e);
          const keys = order.current.filter((k) => items.current.has(k));
          if (!keys.length) return;
          const idx = active ? keys.indexOf(active) : -1;
          if (e.key === 'ArrowDown') (e.preventDefault(), setActive(keys[(idx + 1) % keys.length]));
          else if (e.key === 'ArrowUp') (e.preventDefault(), setActive(keys[(idx - 1 + keys.length) % keys.length]));
          else if (e.key === 'Enter' && active && items.current.has(active)) (e.preventDefault(), items.current.get(active)!());
        }}
        {...props}
      >
        {children}
      </div>
    </CommandCtx.Provider>
  );
}
export function CommandList({ className, children, ...props }: React.ComponentProps<'ul'>) {
  const ctx = React.useContext(CommandCtx)!;
  const values: string[] = [];
  React.Children.forEach(children, (c: any) => c?.props?.value !== undefined && values.push(String(c.props.value)));
  ctx.order.current = values;
  return (
    <ul role="listbox" className={cn('dy-menu w-full max-h-72 flex-nowrap overflow-auto p-0', className)} {...props}>
      {children}
    </ul>
  );
}
export function CommandEmpty({ className, children }: { className?: string; children?: React.ReactNode }) {
  const ctx = React.useContext(CommandCtx)!;
  return ctx.order.current.length === 0 ? <li className={cn('px-3 py-2 text-sm opacity-60', className)}>{children}</li> : null;
}
export function CommandItem({ value, onSelect, className, children, ...props }: Omit<React.ComponentProps<'button'>, 'onSelect' | 'value'> & { value: string; onSelect?: () => void }) {
  const ctx = React.useContext(CommandCtx)!;
  React.useEffect(() => {
    ctx.items.current.set(value, () => onSelect && onSelect());
    return () => void ctx.items.current.delete(value);
  });
  const active = ctx.active === value;
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={active}
        className={cn('gap-2', active && 'dy-menu-active', className)}
        onMouseEnter={() => ctx.setActive(value)}
        onClick={() => onSelect && onSelect()}
        {...props}
      >
        {children}
      </button>
    </li>
  );
}
