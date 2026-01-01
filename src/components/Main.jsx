import CurrencyExchangeBanner from './CurrencyExchangeBanner';
import HeroBanner from './HeroBanner';
import Products from './Product'; // Ensure file name is Product.jsx
import Header from './Header';   // Just './Header' is enough

function Main() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <HeroBanner />
      <CurrencyExchangeBanner />
      <Products /> {/* Yahan future mein Ad Grid aaega */}

    </div>
  );
}

export default Main;