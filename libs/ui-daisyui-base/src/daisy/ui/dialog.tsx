import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { Slot } from '../lib/slot';

/** daisyUI `modal` (rendered open through a portal while `open` is true). */
const Ctx = React.createContext<{ open: boolean; setOpen: (o: boolean) => void; titleId: string; descId: string }>({
  open: false,
  setOpen: () => undefined,
  titleId: '',
  descId: '',
});

export function Dialog({ open = false, onOpenChange, children }: { open?: boolean; onOpenChange?: (o: boolean) => void; children?: React.ReactNode }) {
  const titleId = React.useId();
  const descId = React.useId();
  return <Ctx.Provider value={{ open, setOpen: (o) => onOpenChange && onOpenChange(o), titleId, descId }}>{children}</Ctx.Provider>;
}

export interface DialogContentProps extends React.ComponentProps<'div'> {
  showCloseButton?: boolean;
  placement?: 'middle' | 'end' | 'start';
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onPointerDownOutside?: (e: { preventDefault: () => void }) => void;
  onInteractOutside?: (e: { preventDefault: () => void }) => void;
}
export function DialogContent({ className, children, showCloseButton, placement = 'middle', onEscapeKeyDown, onPointerDownOutside, onInteractOutside, ...props }: DialogContentProps) {
  const { open, setOpen, titleId, descId } = React.useContext(Ctx);
  const boxRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    boxRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onEscapeKeyDown && onEscapeKeyDown(e);
      if (!e.defaultPrevented) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!open || typeof document === 'undefined') return null;
  const outside = () => {
    let stop = false;
    const evt = { preventDefault: () => (stop = true) };
    onPointerDownOutside && onPointerDownOutside(evt);
    onInteractOutside && onInteractOutside(evt);
    if (!stop) setOpen(false);
  };
  return createPortal(
    <div className={cn('dy-modal dy-modal-open z-[10000]', placement === 'end' && 'dy-modal-end', placement === 'start' && 'dy-modal-start')} role="presentation">
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className={cn('dy-modal-box relative outline-none', className)}
        {...props}
      >
        {children}
      </div>
      <div className="dy-modal-backdrop" onClick={outside} />
    </div>,
    document.body
  );
}
export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />;
}
export function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('dy-modal-action mt-0', className)} {...props} />;
}
export function DialogTitle({ className, asChild, ...props }: React.ComponentProps<'h3'> & { asChild?: boolean }) {
  const { titleId } = React.useContext(Ctx);
  const Comp: any = asChild ? Slot : 'h3';
  return <Comp id={titleId} className={cn('text-lg font-bold', className)} {...props} />;
}
export function DialogDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { descId } = React.useContext(Ctx);
  return <p id={descId} className={cn('m-0 text-sm opacity-70', className)} {...props} />;
}
export function DialogClose({ asChild, onClick, ...props }: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const { setOpen } = React.useContext(Ctx);
  const Comp: any = asChild ? Slot : 'button';
  return (
    <Comp
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick && onClick(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}
