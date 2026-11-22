import * as React from 'react';
import { cn } from './utils';

/** Merges its props onto its only child (the `asChild` pattern). */
export const Slot = React.forwardRef<any, any>(function Slot({ children, ...props }, ref) {
  if (!React.isValidElement(children)) return null;
  const child: any = children;
  const merged: any = { ...props, ...child.props };
  Object.keys(props).forEach((key) => {
    if (/^on[A-Z]/.test(key) && typeof props[key] === 'function' && typeof child.props[key] === 'function') {
      merged[key] = (...args: any[]) => {
        child.props[key](...args);
        props[key](...args);
      };
    }
  });
  merged.className = cn(props.className, child.props.className);
  merged.style = { ...props.style, ...child.props.style };
  merged.ref = mergeRefs(ref, child.props.ref ?? child.ref);
  return React.cloneElement(child, merged);
});

export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T) => {
    refs.forEach((r) => {
      if (typeof r === 'function') r(value);
      else if (r) (r as React.MutableRefObject<T>).current = value;
    });
  };
}
