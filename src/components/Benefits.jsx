import { useLanguage } from '../context/LanguageContext';
import '../styles/benefits.css';

function Benefits() {
  const { t } = useLanguage();
  const benefits = t('benefits.items');
  return (
    <section className="section">
      <div className="container">
        <header className="section-header content-panel section-header--panel">
          <span className="section-label">{t('benefits.label')}</span>
          <p className="section-description">
            {t('benefits.description')}
          </p>
        </header>

        <div className="benefits__grid">
          {benefits.map((benefit, index) => (
            <article key={benefit.title} className="benefit-card">
              <span className="benefit-card__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="benefit-card__title">{benefit.title}</h3>
              <p className="benefit-card__description">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;
