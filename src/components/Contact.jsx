import { useState } from 'react';
import { company } from '../data/company';
import { useLanguage } from '../context/LanguageContext';
import '../styles/contact.css';

function Contact() {
  const [status, setStatus] = useState('idle');
  const [errorKey, setErrorKey] = useState('');
  const { t } = useLanguage();

  function validateField(event, errorKey) {
    event.currentTarget.setCustomValidity(t(errorKey));
  }

  function clearFieldValidation(event) {
    event.currentTarget.setCustomValidity('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'submitting') return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      website: formData.get('website'),
    };

    setStatus('submitting');
    setErrorKey('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        setErrorKey(result?.errorCode ? `errors.${result.errorCode}` : 'contact.fallbackError');
        setStatus('error');
        return;
      }

      form.reset();
      setStatus('success');
    } catch {
      setErrorKey('contact.fallbackError');
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
          <div className="contact__grid">
            <div className="contact__info">
              <header className="section-header contact__header">
                <span className="section-label">{t('contact.label')}</span>
                <h2 className="section-title">{t('contact.title')}</h2>
                <p className="section-description">
                  {t('contact.description')}
                </p>
              </header>

              <div className="contact__details">
                <div className="contact__detail">
                  <strong>{t('common.email')}</strong>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </div>
                <div className="contact__detail">
                  <strong>{t('common.phone')}</strong>
                  <a href={`tel:${company.phone.replace(/[^\d+]/g, '')}`}>
                    {company.phone}
                  </a>
                </div>
                <div className="contact__detail">
                  <strong>{t('common.location')}</strong>
                  {company.address}
                </div>
              </div>
            </div>

            {status === 'success' ? (
              <div className="form-success" role="status" aria-live="polite">
                {t('contact.success')}
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    {t('common.name')}
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={t('contact.namePlaceholder')}
                    onInvalid={(event) => validateField(event, 'errors.nameRequired')}
                    onInput={clearFieldValidation}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    {t('common.email')}
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder={t('contact.emailPlaceholder')}
                    onInvalid={(event) => validateField(event, 'errors.emailInvalid')}
                    onInput={clearFieldValidation}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    {t('common.message')}
                  </label>
                  <textarea
                    className="form-textarea"
                    id="message"
                    name="message"
                    required
                    placeholder={t('contact.messagePlaceholder')}
                    onInvalid={(event) => validateField(event, 'errors.messageRequired')}
                    onInput={clearFieldValidation}
                  />
                </div>

                <div className="contact__honeypot" aria-hidden="true">
                  <label htmlFor="website" lang="en">Website</label>
                  <input id="website" name="website" type="text" tabIndex="-1" autoComplete="off" />
                </div>

                {status === 'error' && (
                  <p className="contact__error" role="alert" aria-live="assertive">
                    {t(errorKey)}
                  </p>
                )}

                <button type="submit" className="btn btn--primary" disabled={status === 'submitting'}>
                  {status === 'submitting' ? t('common.sending') : t('common.sendMessage')}
                </button>
                <p className="contact__privacy">{t('contact.privacy')}</p>
              </form>
            )}
          </div>
      </div>
    </section>
  );
}

export default Contact;
