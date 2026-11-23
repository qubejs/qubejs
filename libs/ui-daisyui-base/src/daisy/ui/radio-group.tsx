import * as React from 'react';
import { cn } from '../lib/utils';

const RadioCtx = React.createContext<{ name: string; value?: string; onValueChange?: (v: string) => void } | null>(null);

export function RadioGroup({ className, name, value, onValueChange, children, ...props }: Omit<React.ComponentProps<'div'>, 'onChange'> & { name?: string; value?: string; onValueChange?: (v: string) => void }) {
  const generated = React.useId();
  return (
    <RadioCtx.Provider value={{ name: name || generated, value, onValueChange }}>
      <div role="radiogroup" className={cn('flex flex-col gap-2', className)} {...props}>
        {children}
      </div>
    </RadioCtx.Provider>
  );
}
export const RadioGroupItem = React.forwardRef<HTMLInputElement, Omit<React.ComponentProps<'input'>, 'value'> & { value: string }>(function RadioGroupItem(
  { className, value, ...props },
  ref
) {
  const ctx = React.useContext(RadioCtx);
  return (
    <input
      ref={ref}
      type="radio"
      name={ctx?.name}
      value={value}
      checked={ctx?.value === value}
      onChange={() => ctx?.onValueChange && ctx.onValueChange(value)}
      className={cn('dy-radio dy-radio-sm dy-radio-primary', className)}
      {...props}
    />
  );
});
