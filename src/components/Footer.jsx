import { company, navLinks } from '../data/company';
import NavLink from './NavLink';
import '../styles/footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="footer__brand">{company.name}</p>
            <p className="footer__tagline">{company.tagline}</p>
            <div className="footer__social" aria-label="Follow Cepumbums on social media">
              <a
                href="https://www.facebook.com/cepumbums/?locale=lv_LV"
                className="footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Cepumbums on Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13.8 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6H17V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.8V13h2.7v8h3.3Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/cepumbums/"
                className="footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Cepumbums on Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@cepumbums"
                className="footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Cepumbums on TikTok"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16.7 3c.3 2.3 1.6 3.8 3.8 4v3.2a7.4 7.4 0 0 1-3.7-1.1v6.6a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.2a2.6 2.6 0 1 0 1.7 2.4V3h3Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h2 className="footer__heading">Cepumbums</h2>
            <ul className="footer__links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} className="footer__link">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer__heading">Contact</h2>
            <ul className="footer__links">
              <li>
                <a href={`mailto:${company.email}`} className="footer__link">
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${company.phone.replace(/\D/g, '')}`}
                  className="footer__link"
                >
                  {company.phone}
                </a>
              </li>
              <li>
                <span className="footer__link">{company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer__bottom">
          &copy; {currentYear} {company.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
