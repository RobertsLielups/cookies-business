import { company, navLinks } from '../data/company';
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
          </div>

          <div>
            <h2 className="footer__heading">Navigation</h2>
            <ul className="footer__links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer__link">
                    {link.label}
                  </a>
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
