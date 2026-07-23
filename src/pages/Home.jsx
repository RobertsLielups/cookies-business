import Header from '../components/Header';
import Hero from '../components/Hero';
import Products from '../components/Products';
import About from '../components/About';
import Benefits from '../components/Benefits';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <About />
        <Benefits />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default Home;
