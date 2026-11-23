import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from './utils';

/**
 * Anchored overlays (popover, dropdown, select list). daisyUI is CSS-only, so positioning,
 * outside-click and Escape handling live here. Panels are portalled and positioned with
 * `position: fixed` next to their anchor.
 */
type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

interface FloatingCtx {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  contentId: string;
}
export const FloatingContext = React.createContext<FloatingCtx | null>(null);
export const useFloating = () => {
  const ctx = React.useContext(FloatingContext);
  if (!ctx) throw new Error('Floating parts must be used inside their root component');
  return ctx;
};

export function useControllableOpen(open?: boolean, onOpenChange?: (o: boolean) => void, defaultOpen = false) {
  const [inner, setInner] = React.useState(defaultOpen);
  const controlled = open !== undefined;
  const value = controlled ? !!open : inner;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onOpenChange && onOpenChange(next);
    },
    [controlled, onOpenChange]
  );
  return [value, setOpen] as const;
}

export function FloatingRoot({
  open,
  onOpenChange,
  defaultOpen,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [value, setOpen] = useControllableOpen(open, onOpenChange, defaultOpen);
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const contentId = React.useId();
  const ctx = React.useMemo(() => ({ open: value, setOpen, anchorRef, contentId }), [value, setOpen, contentId]);
  return <FloatingContext.Provider value={ctx}>{children}</FloatingContext.Provider>;
}

function place(anchor: DOMRect, panel: DOMRect, side: Side, align: Align, offset: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let s = side;
  // flip when there is no room
  if (s === 'bottom' && anchor.bottom + offset + panel.height > vh && anchor.top - offset - panel.height > 0) s = 'top';
  else if (s === 'top' && anchor.top - offset - panel.height < 0) s = 'bottom';
  else if (s === 'right' && anchor.right + offset + panel.width > vw) s = 'left';
  else if (s === 'left' && anchor.left - offset - panel.width < 0) s = 'right';
  let top = 0;
  let left = 0;
  if (s === 'bottom' || s === 'top') {
    top = s === 'bottom' ? anchor.bottom + offset : anchor.top - offset - panel.height;
    left =
      align === 'start' ? anchor.left : align === 'end' ? anchor.right - panel.width : anchor.left + (anchor.width - panel.width) / 2;
  } else {
    left = s === 'right' ? anchor.right + offset : anchor.left - offset - panel.width;
    top = align === 'start' ? anchor.top : align === 'end' ? anchor.bottom - panel.height : anchor.top + (anchor.height - panel.height) / 2;
  }
  left = Math.max(8, Math.min(left, vw - panel.width - 8));
  top = Math.max(8, Math.min(top, vh - panel.height - 8));
  return { top, left, side: s };
}

export interface FloatingPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  /** match the anchor's width (select lists, autocomplete) */
  matchWidth?: boolean;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onInteractOutside?: (e: { target: EventTarget | null; preventDefault: () => void }) => void;
  onOpenAutoFocus?: (e: { preventDefault: () => void }) => void;
  /** keep mounted while closed (hidden) */
  forceMount?: boolean;
}

export const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(function FloatingPanel(
  { side = 'bottom', align = 'center', sideOffset = 4, matchWidth, onEscapeKeyDown, onInteractOutside, onOpenAutoFocus, forceMount, className, style, children, ...props },
  ref
) {
  const { open, setOpen, anchorRef, contentId } = useFloating();
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number; width?: number; side: Side } | null>(null);

  const update = React.useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const a = anchor.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const r = place(a, { ...p.toJSON(), width: matchWidth ? a.width : p.width, height: p.height } as DOMRect, side, align, sideOffset);
    setPos({ ...r, width: matchWidth ? a.width : undefined });
  }, [anchorRef, side, align, sideOffset, matchWidth]);

  React.useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, update]);

  React.useEffect(() => {
    if (!open) return;
    let prevented = false;
    onOpenAutoFocus && onOpenAutoFocus({ preventDefault: () => (prevented = true) });
    if (!prevented) {
      const focusable = panelRef.current?.querySelector<HTMLElement>('[role=menuitem],[role=option],button,input,[tabindex]');
      focusable && focusable.focus({ preventScroll: true });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onEscapeKeyDown && onEscapeKeyDown(e);
      if (!e.defaultPrevented) {
        setOpen(false);
        anchorRef.current?.focus?.();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || anchorRef.current?.contains(t)) return;
      let stop = false;
      onInteractOutside && onInteractOutside({ target: e.target, preventDefault: () => (stop = true) });
      if (!stop) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open && !forceMount) return null;
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      id={contentId}
      ref={(el) => {
        panelRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      data-state={open ? 'open' : 'closed'}
      data-side={pos?.side || side}
      className={cn('fixed z-[10010] rounded-box border border-base-300 bg-base-100 text-base-content shadow-lg', className)}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        width: pos?.width,
        visibility: open && pos ? undefined : 'hidden',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
});

/** Element that opens/closes the overlay and anchors it. */
export const FloatingTrigger = React.forwardRef<HTMLElement, any>(function FloatingTrigger(
  { asChild, disabled, onClick, children, ...props },
  ref
) {
  const { open, setOpen, anchorRef, contentId } = useFloating();
  const Comp: any = asChild ? SlotLike : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      data-state={open ? 'open' : 'closed'}
      disabled={asChild ? undefined : disabled}
      {...props}
      ref={(el: HTMLElement) => {
        anchorRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as any).current = el;
      }}
      onClick={(e: React.MouseEvent) => {
        onClick && onClick(e);
        if (!disabled && !e.defaultPrevented) setOpen(!open);
      }}
    >
      {children}
    </Comp>
  );
});

/** Positions the overlay against an element without toggling it. */
export const FloatingAnchor = React.forwardRef<HTMLElement, any>(function FloatingAnchor({ asChild, children, ...props }, ref) {
  const { anchorRef } = useFloating();
  const Comp: any = asChild ? SlotLike : 'div';
  return (
    <Comp
      {...props}
      ref={(el: HTMLElement) => {
        anchorRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as any).current = el;
      }}
    >
      {children}
    </Comp>
  );
});

// local import to avoid a cycle in consumers
import { Slot as SlotLike } from './slot';
