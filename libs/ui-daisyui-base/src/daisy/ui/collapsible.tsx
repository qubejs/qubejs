import * as React from 'react';

const Ctx = React.createContext(false);
export function Collapsible({ open = false, children }: { open?: boolean; children?: React.ReactNode }) {
  return <Ctx.Provider value={open}>{children}</Ctx.Provider>;
}
export function CollapsibleContent({ className, ...props }: React.ComponentProps<'div'>) {
  const open = React.useContext(Ctx);
  return open ? <div className={className} {...props} /> : null;
}
