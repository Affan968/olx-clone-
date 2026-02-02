import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router'; // ✅ IMPORT LINK
import { db } from './firebaseconfig'; // Ensure path is correct
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

  // Category Data List
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

  // --- 1. FIREBASE SE DATA FETCH KARNA ---
  useEffect(() => {
    const getAdsFromFirebase = async () => {
      try {
        // Hum "olxUseradd" collection use kar rahe hain jisme humne data save kiya tha
        const querySnapshot = await getDocs(collection(db, "olxUseradd"));
        const adsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAds(adsArray);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    getAdsFromFirebase();
  }, []);

  // Function to format date
  const formatDate = (date) => {
    if (!date) return "Recently";
    
    if (date.toDate) {
      const firebaseDate = date.toDate();
      const now = new Date();
      const diffMs = now - firebaseDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    }
    
    return "Recently";
  };

  return (
    <div className="container mx-auto px-4 sm:px-18 py-8">

      {/* --- SECTION 1: CATEGORY GRID --- */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap justify-start mx- gap-y-7 gap-x-17 max-w-10xl">
          {categories.map((category) => (
            <div
              key={category.id}
              className="w-[80px] sm:w-[90px] text-center cursor-pointer p-1 hover:bg-gray-100 rounded transition duration-200"
            >
              <div className="bg-[#F2F4F5] rounded-lg shadow-sm w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center mx-auto mb-1">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-[#002f34]">Fresh Recommendations</h2>

      {/* --- SECTION 2: PRODUCT GRID (MAP HERE) --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002f34]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ads.map((ad) => (
            <Link 
              key={ad.id} 
              to={`/item/${ad.id}`} // ✅ LINK TO ITEM DETAIL PAGE
              className="block"
            >
              <div className="border border-gray-300 rounded overflow-hidden bg-white cursor-pointer hover:shadow-md transition-all duration-300 relative group">
                {/* Image Section */}
                <div className="h-48 w-full bg-gray-100 overflow-hidden">
                  {ad.adImages && ad.adImages[0] ? (
                    <img 
                      src={ad.adImages[0]} 
                      alt={ad.adTitle} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-gray-400 text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Heart Icon (Like Button) */}
                <button 
                  className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white shadow-md hover:shadow-lg transition-all z-10"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    e.stopPropagation();
                    // Handle like functionality here
                  }}
                >
                  <HeartIcon className="h-5 w-5 text-gray-700 hover:text-red-500" />
                </button>

                {/* Product Info Section */}
                <div className="p-3 border-l-4 border-l-[#ffce32]">
                  <h3 className="font-bold text-lg text-[#002f34]">
                    Rs {parseInt(ad.adPrice).toLocaleString()}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2 capitalize">
                    {ad.adTitle || "Untitled Ad"}
                  </p>

                  <div className="flex justify-between items-end mt-4">
                    <span className="text-[10px] text-gray-500 uppercase font-medium truncate max-w-[120px] flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ad.adLocation || "Pakistan"}
                    </span>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                      {formatDate(ad.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && ads.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No ads available right now.</p>
          <p className="text-sm text-gray-400 mt-2">Be the first to post an ad!</p>
        </div>
      )}

    </div>
  );
}

export default Products;