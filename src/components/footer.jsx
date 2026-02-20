import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#ebeeef] border-t border-gray-300 pt-8">
      {/* Top Section: Links */}
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-8">
          
          {/* Popular Categories */}
          <div>
            <h4 className="text-[#002f34] font-bold text-[14px] uppercase mb-4">Popular Categories</h4>
            <ul className="text-[#002f34]/70 text-[12px] space-y-2">
              <li className="hover:text-[#002f34] cursor-pointer">Cars</li>
              <li className="hover:text-[#002f34] cursor-pointer">Flats for rent</li>
              <li className="hover:text-[#002f34] cursor-pointer">Mobile Phones</li>
              <li className="hover:text-[#002f34] cursor-pointer">Jobs</li>
            </ul>
          </div>

          {/* Trending Searches */}
          <div>
            <h4 className="text-[#002f34] font-bold text-[14px] uppercase mb-4">Trending Searches</h4>
            <ul className="text-[#002f34]/70 text-[12px] space-y-2">
              <li className="hover:text-[#002f34] cursor-pointer">Bikes</li>
              <li className="hover:text-[#002f34] cursor-pointer">Watches</li>
              <li className="hover:text-[#002f34] cursor-pointer">Books</li>
              <li className="hover:text-[#002f34] cursor-pointer">Dogs</li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-[#002f34] font-bold text-[14px] uppercase mb-4">About Us</h4>
            <ul className="text-[#002f34]/70 text-[12px] space-y-2">
              <li className="hover:text-[#002f34] cursor-pointer">About Dubizzle Group</li>
              <li className="hover:text-[#002f34] cursor-pointer">OLX Blog</li>
              <li className="hover:text-[#002f34] cursor-pointer">Contact Us</li>
              <li className="hover:text-[#002f34] cursor-pointer">OLX for Businesses</li>
            </ul>
          </div>

          {/* OLX */}
          <div>
            <h4 className="text-[#002f34] font-bold text-[14px] uppercase mb-4">OLX</h4>
            <ul className="text-[#002f34]/70 text-[12px] space-y-2">
              <li className="hover:text-[#002f34] cursor-pointer">Help</li>
              <li className="hover:text-[#002f34] cursor-pointer">Sitemap</li>
              <li className="hover:text-[#002f34] cursor-pointer">Terms of use</li>
              <li className="hover:text-[#002f34] cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          {/* Social & Apps */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-[#002f34] font-bold text-[14px] uppercase mb-4">Follow Us</h4>
            <div className="flex gap-2 mb-4">
              {/* Dummy Social Icons */}
              <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-white text-gray-600">f</div>
              <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-white text-gray-600">t</div>
              <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-white text-gray-600">i</div>
            </div>
            <div className="flex gap-2">
               <img src="https://www.olx.com.pk/assets/iconAppStoreEN_noinline.a73fd14c51444559c80115f90bc24045.svg" className="w-24 cursor-pointer" alt="app-store" />
               <img src="https://www.olx.com.pk/assets/iconGooglePlayEN_noinline.9892833785fd884c9703c18c029a44ad.svg" className="w-24 cursor-pointer" alt="play-store" />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#002f34] py-4">
        <div className="container mx-auto px-4 max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white text-[12px] font-bold">Free Classifieds in Pakistan <span className="font-normal opacity-70">. © 2006-2026 OLX</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;