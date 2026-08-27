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

        <aside className="about__mark" aria-label="Cepumbums family bakery">
          <img src="/cepumbums-logo-20260827.png" alt="Cepumbums" />
          <span>Ģimenes konditoreja</span>
        </aside>
      </div>
    </section>
  );
}

export default About;
