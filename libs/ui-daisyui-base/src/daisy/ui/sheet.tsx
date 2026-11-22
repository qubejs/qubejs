import * as React from 'react';
import { cn } from '../lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';

/** Side panel: daisyUI modal placed at the end (or start) of the screen. */
export const Sheet = Dialog;
export function SheetContent({ className, side = 'right', ...props }: React.ComponentProps<typeof DialogContent> & { side?: 'left' | 'right' }) {
  return (
    <DialogContent
      placement={side === 'left' ? 'start' : 'end'}
      className={cn('h-full max-h-none w-80 max-w-[85vw] rounded-none', className)}
      {...props}
    />
  );
}
export const SheetHeader = DialogHeader;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;
