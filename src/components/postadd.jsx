import React, { useContext } from 'react';
import { CateogaryContext} from './context.jsx'; // Context Variable import
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router';
import mobile from './logo/Mobiles.png';
import Vehicles from './logo/vehicles.png';
import Property from './logo/property.png';
import Propertytwo from './logo/Propertytwo.png';
import Electronic from './logo/electronics-home-appliances.png';
import Bikes from './logo/bikes.png';
import business from './logo/business-Industrial-agriculture.png';
import Services from './logo/services.png';
import Jobs from './logo/jobs.png';
import Animals from './logo/animals.png';
import furniture from './logo/furniture-.png';
import fashion from './logo/fashion.png';
import Books from './logo/books.png';
import Kids from './logo/kids.png';

const categories = [
  { id: 1, name: 'Mobiles', icon: mobile },
  { id: 2, name: 'Vehicles', icon: Vehicles },
  { id: 3, name: 'Property for Sale', icon: Property },
  { id: 4, name: 'Property for Rent', icon: Propertytwo },
  { id: 5, name: 'Electronics & Home Appliances', icon: Electronic },
  { id: 6, name: 'Bikes', icon: Bikes },
  { id: 7, name: 'Business, Industrial & Agriculture', icon: business },
  { id: 8, name: 'Services', icon: Services },
  { id: 9, name: 'Jobs', icon: Jobs },
  { id: 10, name: 'Animals', icon: Animals },
  { id: 11, name: 'Furniture & Home Decor', icon: furniture },
  { id: 12, name: 'Books, Sports & Hobbies', icon: Books },
  { id: 13, name: 'Kids', icon: fashion },
  { id: 14, name: 'Fashion & Beauty', icon: Kids },
];

export default function PostAd() {
  // Yahan useContext mein CateogaryContext pass kiya hai
const contextData = useContext(CateogaryContext);  
const {CategoriesImage,setCategoriesImage}=contextData
  const navigate = useNavigate();

  const handlesubmit = (cat) => {
    console.log(cat,"cat")
    setCategoriesImage(cat); // Poora object context mein set ho gaya
    navigate("/postad"); // Apne route ka sahi naam yahan likhen
    console.log(CategoriesImage,"image")
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-[#F7F8F8] border-b border-gray-200 py-3 px-4 flex items-center">
        <Link to="/" className="flex items-center text-[#002F34]">
          <ChevronLeftIcon className="h-6 w-6 mr-2" />
          <svg className="h-7" fill="currentColor" viewBox="0 0 36.289 20.768">
            <path d="M18.9 20.77V0h4.93v20.77zM0 10.39a8.56 8.56 0 1 1 8.56 8.56A8.56 8.56 0 0 1 0 10.4zm5.97-.01a2.6 2.6 0 1 0 2.6-2.6 2.6 2.6 0 0 0-2.6 2.6zm27 5.2l-1.88-1.87-1.87 1.88H25.9V12.3l1.9-1.9-1.9-1.89V5.18h3.27l1.92 1.92 1.93-1.92h3.27v3.33l-1.9 1.9 1.9 1.9v3.27z"></path>
          </svg>
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-[#002F34] tracking-tight mb-12">Post Your Ad</h1>
        <div className="text-left mb-6">
          <h2 className="text-xl font-bold text-[#002F34] uppercase tracking-wide">Choose a Category</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 bg-[#F7F8F8] transition-all"
              onClick={() => handlesubmit(cat)}
            >
              <div className="h-24 w-24 mb-4 flex items-center justify-center">
                <img src={cat.icon} alt={cat.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-[#002F34] font-bold text-center text-sm uppercase">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}