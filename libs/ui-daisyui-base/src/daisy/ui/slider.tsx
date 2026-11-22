import * as React from 'react';
import { cn } from '../lib/utils';

/** daisyUI `range`, with the array value API used by the components. */
export function Slider({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }: Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & { value?: number[]; onValueChange?: (v: number[]) => void }) {
  return (
    <input
      type="range"
      className={cn('dy-range dy-range-primary dy-range-sm w-full', className)}
      min={min}
      max={max}
      step={step}
      value={value[0] ?? 0}
      onChange={(e) => onValueChange && onValueChange([Number(e.target.value)])}
      {...props}
    />
  );
}
