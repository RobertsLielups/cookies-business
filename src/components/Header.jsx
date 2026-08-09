import { useState } from 'react';
import { Link } from 'react-router-dom';
import { company, navLinks } from '../data/company';
import NavLink from './NavLink';
import '../styles/header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
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
              onClick={closeMenu}
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
