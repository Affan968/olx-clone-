import React from 'react';
import HeroBanner from './HeroBanner';
import Products from './Product';
import Header from './Header';
import CurrencyExchangeBanner from './CurrencyExchangeBanner';
import { Outlet, useLocation } from 'react-router';
import Footer from './footer';

function Main() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#f2f4f5] font-sans">
      <Header />

      <main className="flex-1">
        {isHomePage && (
          <>
            {/* HeroBanner top padding sambhale ga */}
            <HeroBanner />
            {/* Currency Banner (Animated) */}
            <CurrencyExchangeBanner />
            {/* Items/Ads */}
            <Products />
          </>
        )}

        {/* Padding ko mazeed kam kar diya hai taake banner upar jump kare */}
        <div className={!isHomePage ? "pt-[70px] md:pt-[90px]" : ""}>
          <Outlet />
        </div>
        <Footer/>
      </main>
    </div>
  );
}

export default Main;