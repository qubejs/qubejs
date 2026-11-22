import * as React from 'react';
import { cn } from '../lib/utils';

/** daisyUI `breadcrumbs` (separators are drawn by daisyUI between items). */
export function Breadcrumb({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" className={cn('dy-breadcrumbs p-0 text-sm', className)} {...props} />;
}
export function BreadcrumbList({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn(className)} {...props} />;
}
export function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn(className)} {...props} />;
}
export function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return <span aria-current="page" className={cn(className)} {...props} />;
}
// daisyUI renders separators itself
export function BreadcrumbSeparator(_props: React.ComponentProps<'li'>) {
  return null;
}
