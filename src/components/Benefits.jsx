import { benefits } from '../data/company';
import '../styles/benefits.css';

function Benefits() {
  return (
    <section className="section">
      <div className="container">
        <header className="section-header">
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">Quality you can taste in every bite</h2>
          <p className="section-description">
            We believe great cookies come from great ingredients, honest
            recipes, and the kind of care only a family business can give.
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
