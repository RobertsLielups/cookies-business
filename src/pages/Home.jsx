import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useSearchParams } from 'react-router-dom';
import '../styles/landing-variants.css';
import { useLanguage } from '../context/LanguageContext';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const requestedVariant = searchParams.get('variant')?.toUpperCase();
  const variant = ['A', 'B', 'C'].includes(requestedVariant) ? requestedVariant : 'A';

  function selectVariant(nextVariant) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('variant', nextVariant);
    setSearchParams(nextParams, { preventScrollReset: true });
  }
  return (
    <div className={`home-page variant-${variant}`}>
      <Header />
      <main className="site-main">
        <div className="site-main__content">
          <Hero key={variant} variant={variant} />
          <About />
          <Contact />
        </div>
      </main>
      <Footer />
      <nav className="variant-switcher" aria-label={language === 'lv' ? 'Dizaina varianti' : 'Design variants'}>
        <span>{language === 'lv' ? 'Variants' : 'Variant'}</span>
        {['A', 'B', 'C'].map((option) => (
          <button key={option} type="button" onClick={() => selectVariant(option)} aria-pressed={variant === option} aria-label={`${language === 'lv' ? 'Variants' : 'Variant'} ${option}`}>{option}</button>
        ))}
      </nav>
    </div>
  );
}

export default Home;
