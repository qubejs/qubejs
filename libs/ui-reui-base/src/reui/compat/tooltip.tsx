import * as React from 'react';
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

/**
 * MUI-style tooltip: <Tooltip title="...">{child}</Tooltip>, rendered with ReUI Tooltip.
 * Includes its own provider so it works anywhere without app-level setup.
 */
export interface TooltipProps {
  title?: React.ReactNode;
  placement?: string;
  arrow?: boolean;
  children: React.ReactElement;
  [key: string]: any;
}

const sideFor = (placement = 'top') =>
  (placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left') || 'top';

export function Tooltip({ title, placement, children }: TooltipProps) {
  if (!title) return children;
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={sideFor(placement)}>{title}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

export default Tooltip;
