import Header from '../components/Header';
import Hero from '../components/Hero';
import Products from '../components/Products';
import About from '../components/About';
import Benefits from '../components/Benefits';
import Contact from '../components/Contact';
import CookieVisual from '../components/CookieVisual';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Header />
      <main className="site-main">
        <CookieVisual />
        <div className="site-main__content">
          <Hero />
          <Products />
          <About />
          <Benefits />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
