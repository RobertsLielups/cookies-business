import { Link } from 'react-router-dom';

/** Renders internal navigation links through React Router. */
function NavLink({ href, className, children, onClick }) {
  const isAppRoute = href.startsWith('/');

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
