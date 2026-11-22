import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../lib/utils';

/** daisyUI `join` of `btn`s. */
export function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav role="navigation" aria-label="pagination" className={cn('flex', className)} {...props} />;
}
export function PaginationContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('dy-join', className)} {...props} />;
}
export function PaginationItem({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
type LinkProps = React.ComponentProps<'a'> & { isActive?: boolean; size?: string };
const sizeClass = (size?: string) => (size === 'icon-sm' ? 'dy-btn-sm' : size === 'icon-lg' ? 'dy-btn-lg' : '');
export function PaginationLink({ className, isActive, size, ...props }: LinkProps) {
  return (
    <a aria-current={isActive ? 'page' : undefined} className={cn('dy-join-item dy-btn', sizeClass(size), isActive && 'dy-btn-active', className)} {...props} />
  );
}
export function PaginationPrevious({ className, text = 'Previous', ...props }: LinkProps & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to previous page" className={className} {...props}>
      <ChevronLeftIcon className="size-4" />
      {text && <span>{text}</span>}
    </PaginationLink>
  );
}
export function PaginationNext({ className, text = 'Next', ...props }: LinkProps & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to next page" className={className} {...props}>
      {text && <span>{text}</span>}
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  );
}
export function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span aria-hidden className={cn('dy-join-item dy-btn dy-btn-disabled', className)} {...props}>
      …
    </span>
  );
}
