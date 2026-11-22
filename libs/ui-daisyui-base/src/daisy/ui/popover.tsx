import * as React from 'react';
import { cn } from '../lib/utils';
import { FloatingAnchor, FloatingPanel, FloatingRoot, FloatingTrigger, type FloatingPanelProps } from '../lib/floating';

export const Popover = FloatingRoot;
export const PopoverTrigger = FloatingTrigger;
export const PopoverAnchor = FloatingAnchor;
export function PopoverContent({ className, align = 'center', ...props }: FloatingPanelProps) {
  return <FloatingPanel role="dialog" align={align} className={cn('w-72 p-3', className)} {...props} />;
}
