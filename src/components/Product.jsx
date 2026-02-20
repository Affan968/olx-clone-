import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router'; 
import { db } from './firebaseconfig'; 
import { HeartIcon } from '@heroicons/react/24/outline';

// Logo Imports
import mobile from './logo/Mobiles.png';
import vechile from './logo/cars.png';
import property from './logo/property.png';
import property2 from './logo/propertytwo.png';
import electronics from './logo/electronics-home-appliances.png';
import bikes from './logo/bikes.png';
import buissness from './logo/business-industrial-agriculture.png';
import services from './logo/services.png';
import jobs from './logo/jobs.png';
import animal from './logo/animals.png';
import furniture from './logo/furniture-.png';
import fashion from './logo/fashion.png';
import books from './logo/books.png';
import kids from './logo/kids.png';

function Products() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: 'Mobiles', icon: mobile },
    { id: 2, name: 'Vehicles', icon: vechile },
    { id: 3, name: 'Property For Sale', icon: property },
    { id: 4, name: 'Property For Rent', icon: property2 },
    { id: 5, name: 'Electronics & Home', icon: electronics },
    { id: 6, name: 'Bikes', icon: bikes },
    { id: 7, name: 'Business, Industrial &', icon: buissness },
    { id: 8, name: 'Services', icon: services },
    { id: 9, name: 'Jobs', icon: jobs },
    { id: 10, name: 'Animals', icon: animal },
    { id: 11, name: 'Furniture & Home Decor', icon: furniture },
    { id: 12, name: 'Fashion & Beauty', icon: fashion },
    { id: 13, name: 'Books, Sports & Hobbies', icon: books },
    { id: 14, name: 'Kids', icon: kids }
  ];

  useEffect(() => {
    const getAdsFromFirebase = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "olxUseradd"));
        const adsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAds(adsArray);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        // Smooth feel ke liye loading
        setTimeout(() => setLoading(false), 800);
      }
    };
    getAdsFromFirebase();
  }, []);

  const formatDate = (date) => {
    if (!date?.toDate) return "Recently";
    const firebaseDate = date.toDate();
    const diffDays = Math.floor((new Date() - firebaseDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // --- SKELETON CARD (Exact Layout Match) ---
  const SkeletonCard = () => (
    <div className="border border-gray-300 rounded overflow-hidden bg-white animate-pulse">
      <div className="h-48 w-full bg-gray-200"></div>
      <div className="p-3 border-l-4 border-l-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-full mb-4"></div>
        <div className="flex justify-between items-end mt-4">
          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-18 py-8">

      {/* SECTION 1: CATEGORY GRID */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap justify-start gap-y-7 gap-x-12 max-w-10xl">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/category/${category.name.toUpperCase()}`)}
              className="w-[80px] sm:w-[90px] text-center cursor-pointer p-1 hover:bg-gray-100 rounded transition duration-200"
            >
              <div className="bg-[#F2F4F5] rounded-lg shadow-sm w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center mx-auto mb-1">
                <img src={category.icon} alt={category.name} className="w-20 h-20 object-contain" />
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-[#002f34]">Fresh Recommendations</h2>

      {/* SECTION 2: PRODUCT GRID WITH SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          // Exact number of cards for a full row on desktop
          Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          ads.map((ad) => (
            <Link key={ad.id} to={`/item/${ad.id}`} className="block">
              <div className="border border-gray-300 rounded overflow-hidden bg-white hover:shadow-md transition-all duration-300 relative group h-full">
                <div className="h-48 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={ad.adImages?.[0] || ""} 
                    alt={ad.adTitle} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all" 
                  />
                </div>
                <div className="p-3 border-l-4 border-l-[#ffce32]">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-[#002f34]">Rs {Number(ad.adPrice).toLocaleString()}</h3>
                    <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2 capitalize">{ad.adTitle}</p>
                  <div className="flex justify-between items-end mt-4 text-[10px] text-gray-500">
                    <span className="truncate max-w-[60%]">{ad.adLocation}</span>
                    <span>{formatDate(ad.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Products;