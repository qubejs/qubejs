import * as React from 'react';

/** daisyUI tooltips are CSS-only (see compat/tooltip); the provider is kept for API parity. */
export function TooltipProvider({ children }: { children?: React.ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}
