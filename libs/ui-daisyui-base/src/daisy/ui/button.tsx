import * as React from 'react';
import { cn } from '../lib/utils';
import { Slot } from '../lib/slot';

/** daisyUI `btn`. Variant/size names follow the shadcn API used by the qubejs components. */
const variants: Record<string, string> = {
  default: 'dy-btn-primary',
  outline: 'dy-btn-outline',
  secondary: 'dy-btn-soft',
  ghost: 'dy-btn-ghost',
  destructive: 'dy-btn-error',
  link: 'dy-btn-link',
};
const sizes: Record<string, string> = {
  default: '',
  xs: 'dy-btn-xs',
  sm: 'dy-btn-sm',
  lg: 'dy-btn-lg',
  icon: 'dy-btn-square',
  'icon-xs': 'dy-btn-square dy-btn-xs',
  'icon-sm': 'dy-btn-square dy-btn-sm',
  'icon-lg': 'dy-btn-square dy-btn-lg',
};

export function buttonVariants({ variant = 'default', size = 'default', className = '' }: { variant?: string; size?: string; className?: string } = {}) {
  return cn('dy-btn', variants[variant] ?? variants.default, sizes[size] ?? '', className);
}

export const Button = React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'> & { variant?: string; size?: string; asChild?: boolean }>(
  function Button({ className, variant = 'default', size = 'default', asChild = false, type, ...props }, ref) {
    const Comp: any = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type || 'button'}
        data-variant={variant}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);
