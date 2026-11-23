import * as React from 'react';
import { cn } from '../lib/utils';

const TabsCtx = React.createContext<{ value?: string; onValueChange?: (v: string) => void }>({});

export function Tabs({ className, value, onValueChange, ...props }: Omit<React.ComponentProps<'div'>, 'onChange'> & { value?: string; onValueChange?: (v: string) => void }) {
  return (
    <TabsCtx.Provider value={{ value, onValueChange }}>
      <div className={cn(className)} {...props} />
    </TabsCtx.Provider>
  );
}
/** daisyUI `tabs` (box style, or border style for variant="line"). */
export function TabsList({ className, variant = 'default', ...props }: React.ComponentProps<'div'> & { variant?: string }) {
  return <div role="tablist" className={cn('dy-tabs', variant === 'line' ? 'dy-tabs-border' : 'dy-tabs-box', 'w-fit', className)} {...props} />;
}
export function TabsTrigger({ className, value, disabled, onClick, ...props }: React.ComponentProps<'button'> & { value: string }) {
  const ctx = React.useContext(TabsCtx);
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? 'active' : 'inactive'}
      disabled={disabled}
      className={cn('dy-tab gap-1.5', active && 'dy-tab-active', disabled && 'dy-tab-disabled', className)}
      onClick={(e) => {
        onClick && onClick(e);
        !disabled && ctx.onValueChange && ctx.onValueChange(value);
      }}
      {...props}
    />
  );
}
