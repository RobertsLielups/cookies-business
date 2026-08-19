import { aboutStory } from '../data/company';
import '../styles/about.css';

function About() {
  return (
    <section id="about" className="section">
      <div className="container about__grid">
        <div className="about__content content-panel">
          <header className="section-header">
            <span className="section-label">About Us</span>
            <h2 className="section-title">{aboutStory.headline}</h2>
          </header>

          <div className="about__story">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div
          className="about__image image-placeholder"
          role="img"
          aria-label="Family bakers working together in the kitchen"
        >
          Family Kitchen
        </div>
      </div>
    </section>
  );
}

export default About;
