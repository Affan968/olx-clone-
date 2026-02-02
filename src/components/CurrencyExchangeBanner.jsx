import React, { useState, useEffect } from 'react';

function CurrencyExchangeBanner() {
  // 1. Dono banners ke links ko array mein rakha
  const banners = [
    "https://images.olx.com.pk/thumbnails/591766922-800x600.webp", // Blue Banner
    "https://images.olx.com.pk/thumbnails/592280306-800x600.webp"  // Yellow Banner
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
jj
  // 2. Logic: Har 3 second baad image change hogi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000); // 3000ms = 3 seconds

    // Cleanup: Jab component band ho to timer khatam ho jaye
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="container mx-auto px-5 mt-5 flex justify-center">
      <div className="relative overflow-hidden rounded-sm w-full max-w-[1480px]">
        {/* Banner Image with smooth transition */}
        <img 
          src={banners[currentIndex]} 
          alt={`Banner ${currentIndex + 1}`} 
          className="w-full h-auto px-1 mx-2 object-cover transition-opacity duration-500 ease-in-out"
        />
        
        {/* Optional: Chote dots jo OLX par niche nazar aate hain */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <div 
              key={index}
              className={`h-2.5 w-1.5 px-1 rounded-full ${index === currentIndex ? 'bg-white w-3' : 'bg-gray-400'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CurrencyExchangeBanner;