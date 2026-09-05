import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { company, navLinks } from '../data/company';
import { useLanguage } from '../context/LanguageContext';
import NavLink from './NavLink';
import '../styles/header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { language, setLanguage, t } = useLanguage();

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
              alt={company.name}
              className="header__logo-image"
            />
          ) : (
            <span className="header__logo-mark" aria-hidden="true">
              GC
            </span>
          )}
        </Link>

        <button
          type="button"
          className={`header__toggle ${menuOpen ? 'header__toggle--open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? t('common.closeMenu') : t('common.openMenu')}
          onClick={toggleMenu}
        >
          <span className="header__toggle-bar" />
          <span className="header__toggle-bar" />
          <span className="header__toggle-bar" />
        </button>

        <nav
          id="main-navigation"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          aria-label={t('navigation.label')}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="header__link"
              onClick={(event) => handleNavigation(link.href, event)}
            >
              {t(`navigation.${link.key}`)}
            </NavLink>
          ))}
          <div className="language-switcher" role="group" aria-label={t('common.languageSwitcher')}>
            {['en', 'lv'].map((languageCode) => (
              <button
                key={languageCode}
                type="button"
                className={`language-switcher__button${language === languageCode ? ' language-switcher__button--active' : ''}`}
                aria-pressed={language === languageCode}
                onClick={() => {
                  setLanguage(languageCode);
                  closeMenu();
                }}
              >
                {languageCode.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
