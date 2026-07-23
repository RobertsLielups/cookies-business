import { aboutStory, values } from '../data/company';
import '../styles/about.css';

function About() {
  return (
    <section id="about" className="section section--alt">
      <div className="container about__grid">
        <div>
          <header className="section-header">
            <span className="section-label">About Us</span>
            <h2 className="section-title">{aboutStory.headline}</h2>
          </header>

          <div className="about__story">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <ul className="about__values">
            {values.map((value) => (
              <li key={value.title} className="about__value">
                <h3 className="about__value-title">{value.title}</h3>
                <p className="about__value-description">{value.description}</p>
              </li>
            ))}
          </ul>
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
