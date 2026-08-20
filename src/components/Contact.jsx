import { useState } from 'react';
import { company } from '../data/company';
import '../styles/contact.css';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.target.reset();
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

            {submitted ? (
              <div className="form-success" role="status">
                Thank you for reaching out! We have received your message and will
                respond soon.
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
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

                <button type="submit" className="btn btn--primary">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
