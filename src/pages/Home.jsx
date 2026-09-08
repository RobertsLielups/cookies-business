import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { pageMeta } from '../seo';
import { usePageMeta } from '../utils/usePageMeta';

function Home() {
  const { language } = useLanguage();
  usePageMeta(pageMeta(language, 'home'));
  return (
    <>
      <Header overlay />
      <main className="site-main">
        <div className="site-main__content">
          <Hero />
          <About />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
