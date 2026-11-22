import * as React from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { FloatingPanel, FloatingRoot, FloatingTrigger, useFloating } from '../lib/floating';

/**
 * Single-value select: a daisyUI `select`-styled trigger with a `menu` list.
 * Items stay mounted (hidden) while closed so the trigger can show the selected label.
 */
interface SelectCtx {
  value: string;
  onValueChange?: (v: string) => void;
  labels: Map<string, React.ReactNode>;
  register: (value: string, label: React.ReactNode) => void;
}
const Ctx = React.createContext<SelectCtx | null>(null);

export function Select({ value = '', onValueChange, disabled, name, children }: { value?: string; onValueChange?: (v: string) => void; disabled?: boolean; name?: string; children?: React.ReactNode }) {
  const [labels, setLabels] = React.useState(() => new Map<string, React.ReactNode>());
  const register = React.useCallback((v: string, label: React.ReactNode) => {
    setLabels((prev) => (prev.get(v) === label ? prev : new Map(prev).set(v, label)));
  }, []);
  return (
    <Ctx.Provider value={{ value, onValueChange, labels, register }}>
      <FloatingRoot>
        <fieldset disabled={disabled} className="contents">
          {name && <input type="hidden" name={name} value={value} />}
          {children}
        </fieldset>
      </FloatingRoot>
    </Ctx.Provider>
  );
}
export function SelectTrigger({ className, children, ...props }: React.ComponentProps<'button'>) {
  return (
    <FloatingTrigger role="combobox" className={cn('dy-select w-full items-center text-left', className)} {...props}>
      <span className="flex min-w-0 flex-1 items-center gap-2 truncate">{children}</span>
      <ChevronDownIcon className="hidden" aria-hidden />
    </FloatingTrigger>
  );
}
export function SelectValue({ placeholder }: { placeholder?: React.ReactNode }) {
  const ctx = React.useContext(Ctx)!;
  const label = ctx.labels.get(ctx.value);
  return <span className={cn('flex items-center gap-2 truncate', label == null && 'opacity-60')}>{label ?? placeholder}</span>;
}
export function SelectContent({ className, children }: { className?: string; position?: string; children?: React.ReactNode }) {
  return (
    <FloatingPanel role="listbox" align="start" matchWidth forceMount className={cn('max-h-72 overflow-auto p-0', className)}>
      <ul className="dy-menu w-full">{children}</ul>
    </FloatingPanel>
  );
}
export function SelectItem({ value, disabled, className, children }: { value: string; disabled?: boolean; className?: string; children?: React.ReactNode }) {
  const ctx = React.useContext(Ctx)!;
  const { setOpen } = useFloating();
  React.useEffect(() => ctx.register(value, children), [value, children]); // eslint-disable-line react-hooks/exhaustive-deps
  const selected = ctx.value === value;
  return (
    <li className={cn(disabled && 'dy-menu-disabled')}>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        disabled={disabled}
        className={cn('gap-2', selected && 'dy-menu-active', className)}
        onClick={() => {
          ctx.onValueChange && ctx.onValueChange(value);
          setOpen(false);
        }}
      >
        <span className="flex flex-1 items-center gap-2">{children}</span>
        {selected && <CheckIcon className="size-4" />}
      </button>
    </li>
  );
}
