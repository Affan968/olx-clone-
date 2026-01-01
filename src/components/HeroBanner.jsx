import React from 'react';

function HeroBanner() {
  return (
    <div className="container mx-auto px-4 mt-4">
      <img
        // Note: Yahan aapko actual screenshot jaisa image dalna hoga ya uska placeholder
        src="https://via.placeholder.com/1200x350/000000/FFFFFF?text=VELO+PRESENTS+MAATCH+SCREENING" 
        alt="Velo Ad Banner"
        className="w-full h-auto object-cover" 
      />
      
    </div>
  );
}

export default HeroBanner;