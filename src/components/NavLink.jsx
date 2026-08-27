import { Link, useLocation } from 'react-router-dom';

/** Renders internal navigation links through React Router. */
function NavLink({ href, className, children, onClick }) {
  const isAppRoute = href.startsWith('/');
  const { pathname } = useLocation();
  const routePath = href.split('#')[0] || '/';
  const isCurrent = !href.includes('#') && pathname === routePath;
  const hashTarget = href.startsWith('/#') ? href.slice(2) : null;

  function handleClick(event) {
    onClick?.(event);

    // React Router does not always re-run a same-route hash navigation. Make
    // in-page links reliable in both the header and footer.
    if (!event.defaultPrevented && hashTarget && pathname === '/') {
      event.preventDefault();
      document.getElementById(hashTarget)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  if (isAppRoute) {
    return (
      <Link to={href} className={className} onClick={handleClick} aria-current={isCurrent ? 'page' : undefined}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

export default NavLink;
