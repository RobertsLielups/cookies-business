import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { company, navLinks } from '../data/company';
import NavLink from './NavLink';
import '../styles/header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  function returnHome(event) {
    closeMenu();

    // React Router does not reset the scroll position when linking to the
    // current route, so make the brand reliably return to the hero section.
    if (pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleNavigation(href, event) {
    closeMenu();

    if (href === '/' && pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={returnHome}>
          {company.logo ? (
            <img
              src={company.logo}
              alt=""
              className="header__logo-image"
            />
          ) : (
            <span className="header__logo-mark" aria-hidden="true">
              GC
            </span>
          )}
          {company.name}
        </Link>

        <button
          type="button"
          className={`header__toggle ${menuOpen ? 'header__toggle--open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          <span className="header__toggle-bar" />
          <span className="header__toggle-bar" />
          <span className="header__toggle-bar" />
        </button>

        <nav
          id="main-navigation"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="header__link"
              onClick={(event) => handleNavigation(link.href, event)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
