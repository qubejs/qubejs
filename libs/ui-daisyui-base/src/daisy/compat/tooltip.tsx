import * as React from 'react';

/**
 * MUI-style tooltip: <Tooltip title="...">{child}</Tooltip>, rendered with daisyUI's CSS
 * `tooltip` (text comes from `data-tip`).
 */
export interface TooltipProps {
  title?: React.ReactNode;
  placement?: string;
  arrow?: boolean;
  children: React.ReactElement;
  [key: string]: any;
}

const sides: Record<string, string> = {
  top: 'dy-tooltip-top',
  bottom: 'dy-tooltip-bottom',
  left: 'dy-tooltip-left',
  right: 'dy-tooltip-right',
};
const textOf = (node: React.ReactNode): string => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement(node)) return textOf((node.props as any).children);
  return '';
};

export function Tooltip({ title, placement = 'top', children }: TooltipProps) {
  const tip = textOf(title);
  if (!tip) return children;
  return (
    <span className={`dy-tooltip ${sides[placement.split('-')[0]] || sides.top}`} data-tip={tip}>
      {children}
    </span>
  );
}

export default Tooltip;
