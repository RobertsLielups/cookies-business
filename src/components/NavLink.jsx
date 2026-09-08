import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

/** Renders internal navigation links through React Router, under the current language prefix. */
function NavLink({ href, className, children, onClick, tabIndex }) {
  const isAppRoute = href.startsWith('/');
  const { pathname } = useLocation();
  const { localePath } = useLanguage();
  const to = isAppRoute ? localePath(href) : href;
  const home = localePath('/');
  const routePath = to.split('#')[0];
  const isCurrent = !href.includes('#') && pathname === routePath;
  const hashTarget = href.startsWith('/#') ? href.slice(2) : null;

  function handleClick(event) {
    onClick?.(event);

    // React Router does not always re-run a same-route hash navigation. Make
    // in-page links reliable in both the header and footer.
    if (!event.defaultPrevented && hashTarget && pathname === home) {
      event.preventDefault();
      document.getElementById(hashTarget)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  if (isAppRoute) {
    return (
      <Link to={to} className={className} onClick={handleClick} tabIndex={tabIndex} aria-current={isCurrent ? 'page' : undefined}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={handleClick} tabIndex={tabIndex}>
      {children}
    </a>
  );
}

export default NavLink;
