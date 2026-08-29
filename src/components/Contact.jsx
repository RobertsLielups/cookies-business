import { useState } from 'react';
import { company } from '../data/company';
import '../styles/contact.css';

function Contact() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

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
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Something went wrong. Please try again.');
      }

      form.reset();
      setStatus('success');
    } catch (submissionError) {
      setError(submissionError.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="content-panel contact-panel">
          <div className="contact__grid">
            <div className="contact__info">
              <header className="section-header contact__header">
                <span className="section-label">Contact</span>
                <h2 className="section-title">We would love to hear from you</h2>
                <p className="section-description">
                  Questions about our cookies, custom orders, or wholesale? Send us
                  a message and we will get back to you within one business day.
                </p>
              </header>

              <div className="contact__details">
                <div className="contact__detail">
                  <strong>Email</strong>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </div>
                <div className="contact__detail">
                  <strong>Phone</strong>
                  <a href={`tel:${company.phone.replace(/[^\d+]/g, '')}`}>
                    {company.phone}
                  </a>
                </div>
                <div className="contact__detail">
                  <strong>Location</strong>
                  {company.address}
                </div>
              </div>
            </div>

            {status === 'success' ? (
              <div className="form-success" role="status" aria-live="polite">
                Thank you! Your message has been sent.
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="form-textarea"
                    id="message"
                    name="message"
                    required
                  />
                </div>

                <div className="contact__honeypot" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex="-1" autoComplete="off" />
                </div>

                {status === 'error' && (
                  <p className="contact__error" role="alert" aria-live="assertive">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn btn--primary" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
                <p className="contact__privacy">Your details will only be used to respond to your message.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
