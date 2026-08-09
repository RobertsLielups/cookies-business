import { Link } from 'react-router-dom';

/**
 * Renders either a React Router Link or a plain anchor,
 * depending on whether the href is an in-app route or a hash link.
 */
function NavLink({ href, className, children, onClick }) {
  const isAppRoute = href.startsWith('/') && !href.startsWith('/#');

  if (isAppRoute) {
    return (
      <Link to={href} className={className} onClick={onClick}>
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
