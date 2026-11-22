import * as React from 'react';
import { TooltipProvider } from './daisy/ui/tooltip';

/**
 * Theme provider for daisyUI components. Accepts the same `theme` prop shape used with
 * ui-material-base; `theme.palette.mode === 'dark'` (or `theme.mode`) selects daisyUI's dark theme,
 * `theme.name` any other daisyUI theme, and `theme.cssVars` overrides daisyUI color variables
 * (e.g. { primary: 'oklch(...)' } sets --color-primary).
 */
export interface ThemeProviderProps {
  theme?: {
    mode?: 'light' | 'dark';
    name?: string;
    palette?: { mode?: 'light' | 'dark' };
    cssVars?: Record<string, string>;
  };
  className?: string;
  children?: React.ReactNode;
}

export function ThemeProvider({ theme = {}, className = '', children }: ThemeProviderProps) {
  const mode = theme.mode || theme.palette?.mode || 'light';
  const style = Object.fromEntries(
    Object.entries(theme.cssVars || {}).map(([k, v]) => [`--color-${k}`, v])
  ) as React.CSSProperties;
  return (
    <div
      data-theme={theme.name || mode}
      className={`sq-daisyui-theme ${className}`.trim()}
      style={style}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}

export default ThemeProvider;
