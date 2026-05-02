import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { prefetchRoute } from "../lib/routePrefetch";

/**
 * Drop-in replacement for react-router's `<Link>` that kicks off
 * `prefetchRoute(to)` on hover/focus/touch. No visual change, no
 * behavior change on click — just a warmer network cache by the
 * time the click arrives.
 */
export const PrefetchLink = forwardRef<HTMLAnchorElement, LinkProps>(function PrefetchLink(
  { to, onMouseEnter, onFocus, onTouchStart, ...rest },
  ref,
) {
  const target = typeof to === "string" ? to : undefined;

  return (
    <Link
      ref={ref}
      to={to}
      onMouseEnter={(e) => {
        if (target) prefetchRoute(target);
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        if (target) prefetchRoute(target);
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        if (target) prefetchRoute(target);
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
});
