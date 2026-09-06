import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { company } from '../data/company';
import { legalInfo, legalReviewFields, policyLastUpdated } from '../data/legal';
import { useLanguage } from '../context/LanguageContext';
import '../styles/policy.css';

function ConfigurationDetails() {
  const { language, t } = useLanguage();
  const configuredDetails = [
    ['controllerName', legalInfo.controllerName],
    ['registrationNumber', legalInfo.registrationNumber],
    ['legalAddress', legalInfo.legalAddress],
    ['privacyEmail', legalInfo.privacyEmail],
  ].filter(([, value]) => value);

  return (
    <>
      {configuredDetails.length > 0 && (
        <dl className="policy-details">
          {configuredDetails.map(([key, value]) => (
            <div key={key}>
              <dt>{t(`legal.fields.${key}`)}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <aside className="policy-review-note" aria-label={t('legal.reviewTitle')}>
        <h2>{t('legal.reviewTitle')}</h2>
        <p>{t('legal.reviewDescription')}</p>
        <ul>
          {legalReviewFields.filter((field) => !legalInfo[field]).map((field) => (
            <li key={field}>{t(`legal.fields.${field}`)}</li>
          ))}
        </ul>
      </aside>
    </>
  );
}

function PolicySection({ section }) {
  return (
    <section className="policy-page__section" aria-labelledby={`policy-${section.id}`}>
      <h2 id={`policy-${section.id}`}>{section.title}</h2>
      {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.items && (
        <ul>
          {section.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
      {section.storage && (
        <div className="policy-table-wrap">
          <table className="policy-table">
            <thead>
              <tr>{section.storage.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr>
            </thead>
            <tbody>
              {section.storage.rows.map((row) => (
                <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} data-label={section.storage.headers[index]}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {section.contactEmail && <p><a href={`mailto:${company.email}`}>{company.email}</a></p>}
    </section>
  );
}

function PolicyPage({ type }) {
  const { t } = useLanguage();
  const policy = t(`${type}Policy`);

  useEffect(() => {
    document.title = policy.metadataTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', policy.metadataDescription);
  }, [policy.metadataDescription, policy.metadataTitle]);

  return (
    <>
      <Header />
      <main className="policy-page">
        <section className="section">
          <div className="container">
            <article className="policy-page__content">
              <header className="policy-page__header">
                <span className="section-label">{company.name}</span>
                <h1 className="section-title">{policy.title}</h1>
                <p className="policy-page__updated">{policy.lastUpdatedLabel}: {policyLastUpdated[language]}</p>
              </header>

              {policy.intro.map((paragraph) => <p className="policy-page__lead" key={paragraph}>{paragraph}</p>)}
              {policy.sections.map((section) => <PolicySection key={section.id} section={section} />)}

              {type === 'privacy' && (
                <section className="policy-page__section" aria-labelledby="policy-contact-information">
                  <h2 id="policy-contact-information">{t('privacyPolicy.contactInformationTitle')}</h2>
                  <p>{t('privacyPolicy.contactInformationDescription')}</p>
                  <p><a href={`mailto:${company.email}`}>{company.email}</a></p>
                  <ConfigurationDetails />
                </section>
              )}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PolicyPage;
