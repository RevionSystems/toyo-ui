import { forwardRef } from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';

type LinkBehaviorProps = Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] };

/**
 * Lets every MUI `Link`/`Button`/`ListItemButton` with an `href` navigate client-side.
 * External URLs fall through to a native anchor.
 */
export const LinkBehavior = forwardRef<HTMLAnchorElement, LinkBehaviorProps>(function LinkBehavior(
  { href, ...rest },
  ref,
) {
  if (typeof href === 'string' && /^(https?:|mailto:)/.test(href)) {
    // Children arrive via `rest`; the consuming MUI component provides the accessible content.
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a ref={ref} href={href} target="_blank" rel="noreferrer" {...rest} />;
  }
  return <RouterLink ref={ref} to={href} {...rest} />;
});
