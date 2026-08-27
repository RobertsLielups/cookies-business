import { Link, useLocation } from 'react-router-dom';

/** Renders internal navigation links through React Router. */
function NavLink({ href, className, children, onClick }) {
  const isAppRoute = href.startsWith('/');
  const { pathname } = useLocation();
  const routePath = href.split('#')[0] || '/';
  const isCurrent = !href.includes('#') && pathname === routePath;

  if (isAppRoute) {
    return (
      <Link to={href} className={className} onClick={onClick} aria-current={isCurrent ? 'page' : undefined}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export default NavLink;
