import CurrencyExchangeBanner from './CurrencyExchangeBanner';
import HeroBanner from './HeroBanner';
import Products from './Product';
import Header from './Header';
import { Outlet, useLocation } from 'react-router';

function Main() {
  const location = useLocation();
  
  // Check karo ke kya hum Home page par hain ya Detail page par
  const isHomePage = location.pathname === "/";
  const isItemDetailPage = location.pathname.includes('/item/');

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />

      {/* 1. Sirf Home Page par Banner aur Products dikhao */}
      {isHomePage && (
        <>
          <HeroBanner />
          <CurrencyExchangeBanner />
          <Products />
        </>
      )}

      {/* 2. Detail Page ya Login/Signup ke liye Outlet */}
      <div className={!isHomePage ? "pt-5" : ""}>
        <Outlet />
      </div>

      {/* 3. Footer (Optional agar tumhare paas hai) */}
    </div>
  );
}

export default Main;