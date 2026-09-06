import Header from '../components/Header';
import Hero from '../components/HeroPrototype'; // PROTOTYPE: swap back to './Hero' when done
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function Home() {
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
