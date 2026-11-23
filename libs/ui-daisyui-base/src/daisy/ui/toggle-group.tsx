import * as React from 'react';
import { cn } from '../lib/utils';

const Ctx = React.createContext<{ value?: string; onValueChange?: (v: string) => void }>({});

/** Single-select button group on daisyUI `join`. */
export function ToggleGroup({ className, value, onValueChange, type, ...props }: Omit<React.ComponentProps<'div'>, 'onChange'> & { type?: 'single'; value?: string; onValueChange?: (v: string) => void }) {
  return (
    <Ctx.Provider value={{ value, onValueChange }}>
      <div role="group" className={cn('dy-join', className)} {...props} />
    </Ctx.Provider>
  );
}
export function ToggleGroupItem({ className, value, onClick, ...props }: React.ComponentProps<'button'> & { value: string }) {
  const ctx = React.useContext(Ctx);
  const active = ctx.value === value;
  return (
    <button
      type="button"
      aria-pressed={active}
      data-state={active ? 'on' : 'off'}
      className={cn('dy-join-item dy-btn dy-btn-ghost', active && 'dy-btn-active', className)}
      onClick={(e) => {
        onClick && onClick(e);
        ctx.onValueChange && ctx.onValueChange(active ? '' : value);
      }}
      {...props}
    />
  );
}
