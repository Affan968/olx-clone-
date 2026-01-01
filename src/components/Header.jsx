import React from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router';
import CategoryBar from './CategoryBar'
function Header() {
  return (
    <>
      {/* Fixed Container: Isme Top Row aur Search Row dono hain */}
      <div className="fixed top-0 left-0 right-0 z-[100] shadow-sm">
        
        {/* 1st Row: Blue Section */}
        <div className="bg-[#EBF1FF]">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a >
                <svg className="h-7 text-blue-600" fill="currentColor" viewBox="0 0 36.289 20.768">
                  <path d="M18.9 20.77V0h4.93v20.77zM0 10.39a8.56 8.56 0 1 1 8.56 8.56A8.56 8.56 0 0 1 0 10.4zm5.97-.01a2.6 2.6 0 1 0 2.6-2.6 2.6 2.6 0 0 0-2.6 2.6zm27 5.2l-1.88-1.87-1.87 1.88H25.9V12.3l1.9-1.9-1.9-1.89V5.18h3.27l1.92 1.92 1.93-1.92h3.27v3.33l-1.9 1.9 1.9 1.9v3.27z"></path>
                </svg>
              </a>
              <nav className="hidden sm:flex items-center text-sm space-x-3 text-gray-700 font-semibold ml-4">
                <a href="#" className="flex items-center space-x-1">
                  <img className="h-6" src="https://www.olx.com.pk/assets/iconMotors.6bf280165e43e55b173d0a53551e2bfb.png" alt="motors" />
                  <span>Motors</span>
                </a>
                <a href="#" className="flex items-center space-x-1">
                  <img className="h-6" src="https://www.olx.com.pk/assets/iconProperty.d09c6d2e3621f900c17c9e8330a1a37b.png" alt="property" />
                  <span>Property</span>
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-6">
              <button className="font-bold hover:underline">Login</button>
              <Link to='/post' 
                className="relative inline-flex items-center justify-center px-5 py-2 font-bold text-black bg-white rounded-full border-t-[6px] border-t-[#23E5DB] border-l-[5px] border-l-[#FFCE32] border-r-[5px] border-r-[#3A77FF] border-b-[5px] border-b-[#3A77FF] hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                style={{ boxShadow: 'inset 0 0 0 1px white' }} 
              >
                <PlusIcon className="h-5 w-5 mr-1 stroke-[3px]" />
                <span className="font-geomanist tracking-wider">SELL</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2nd Row: Search Section */}
        <div className="bg-white py-3 border-b border-gray-200">
          <div className="container mx-auto px-4 flex items-center space-x-4">
            <div className="relative w-1/4">
              <select className="border border-[#002f34] rounded-md h-12 p-2 w-full focus:outline-none">
                <option>Pakistan</option>
              </select>
            </div>
            <div className="flex-grow flex items-center border border-[#002f34] rounded-md overflow-hidden h-12">
              <input
                type="text"
                placeholder="Find Cars, Mobile Phones and more..."
                className="w-full h-full px-4 outline-none"
              />
              <div className="bg-[#002f34] h-full px-3 flex items-center justify-center cursor-pointer">
                <button>
                  <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                </button>
                <span className='text-white px-2 font-bold text-base'>Search</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Section (Ab ye normal scroll hoga) */}
      {/* pt-[140px] zaroori hai taaki Category section fixed header ke neeche na chupe */}
      <div className="pt-[145px] bg-white">
        <div className="container mx-auto px-5 py-0">
          {/* Aapka Category content yahan ayega */}
     <CategoryBar/>
        </div>
      </div>
    </>
  );
}

export default Header;