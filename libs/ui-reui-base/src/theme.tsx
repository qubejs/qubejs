import * as React from 'react';
import { TooltipProvider } from './reui/ui/tooltip';

/**
 * Theme provider for ReUI components. Accepts the same `theme` prop shape used with
 * ui-material-base; `theme.palette.mode === 'dark'` (or `theme.mode`) switches ReUI to dark,
 * and `theme.cssVars` can override any --reui-* token (e.g. { primary: 'oklch(...)' }).
 */
export interface ThemeProviderProps {
  theme?: {
    mode?: 'light' | 'dark';
    palette?: { mode?: 'light' | 'dark' };
    cssVars?: Record<string, string>;
  };
  className?: string;
  children?: React.ReactNode;
}

export function ThemeProvider({ theme = {}, className = '', children }: ThemeProviderProps) {
  const mode = theme.mode || theme.palette?.mode || 'light';
  const style = Object.fromEntries(
    Object.entries(theme.cssVars || {}).map(([k, v]) => [`--reui-${k}`, v])
  ) as React.CSSProperties;
  return (
    <div
      data-slot="reui-theme"
      className={`sq-reui-theme ${mode === 'dark' ? 'dark' : ''} ${className}`.trim()}
      style={style}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}

export default ThemeProvider;
