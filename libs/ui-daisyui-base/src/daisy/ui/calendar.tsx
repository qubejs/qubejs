import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../lib/utils';

/** react-day-picker styled by daisyUI's built-in `react-day-picker` support. */
export function Calendar({ className, ...props }: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker className={cn('dy-react-day-picker', className)} {...(props as any)} />;
}
