import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * daisyUI `carousel` (CSS scroll-snap) with the small API the Carousel component uses:
 * selectedScrollSnap(), scrollNext(), scrollPrev(), scrollTo(i), on/off('select').
 */
export interface CarouselApi {
  selectedScrollSnap: () => number;
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
  on: (event: 'select', cb: () => void) => void;
  off: (event: 'select', cb: () => void) => void;
}
const Ctx = React.createContext<{ trackRef: React.RefObject<HTMLDivElement | null>; api: CarouselApi | null }>({ trackRef: { current: null }, api: null });

export function Carousel({ className, setApi, opts, children, ...props }: React.ComponentProps<'div'> & { setApi?: (api: CarouselApi) => void; opts?: { loop?: boolean } }) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const listeners = React.useRef(new Set<() => void>());
  const current = React.useRef(0);
  const api = React.useMemo<CarouselApi>(() => {
    const count = () => trackRef.current?.children.length || 0;
    const scrollTo = (i: number) => {
      const track = trackRef.current;
      if (!track || !count()) return;
      const n = count();
      const index = opts?.loop ? (i + n) % n : Math.max(0, Math.min(i, n - 1));
      track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
    };
    return {
      selectedScrollSnap: () => current.current,
      scrollTo,
      scrollNext: () => scrollTo(current.current + 1),
      scrollPrev: () => scrollTo(current.current - 1),
      on: (_e, cb) => void listeners.current.add(cb),
      off: (_e, cb) => void listeners.current.delete(cb),
    };
  }, [opts?.loop]);
  React.useEffect(() => {
    setApi && setApi(api);
  }, [api, setApi]);
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      if (i !== current.current) {
        current.current = i;
        listeners.current.forEach((cb) => cb());
      }
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <Ctx.Provider value={{ trackRef, api }}>
      <div role="region" aria-roledescription="carousel" className={cn('relative', className)} {...props}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
export function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { trackRef } = React.useContext(Ctx);
  return <div ref={trackRef} className={cn('dy-carousel w-full', className)} {...props} />;
}
export function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  return <div role="group" aria-roledescription="slide" className={cn('dy-carousel-item w-full [&>*]:w-full', className)} {...props} />;
}
export function CarouselPrevious({ className }: { className?: string }) {
  const { api } = React.useContext(Ctx);
  return (
    <button type="button" aria-label="Previous slide" className={cn('dy-btn dy-btn-circle dy-btn-sm absolute top-1/2 -translate-y-1/2', className)} onClick={() => api?.scrollPrev()}>
      <ChevronLeftIcon className="size-4" />
    </button>
  );
}
export function CarouselNext({ className }: { className?: string }) {
  const { api } = React.useContext(Ctx);
  return (
    <button type="button" aria-label="Next slide" className={cn('dy-btn dy-btn-circle dy-btn-sm absolute top-1/2 -translate-y-1/2', className)} onClick={() => api?.scrollNext()}>
      <ChevronRightIcon className="size-4" />
    </button>
  );
}
