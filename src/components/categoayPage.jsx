import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router'; 
import { ChevronRightIcon, MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import { db, collection, query, where, getDocs } from './firebaseconfig/index.jsx';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";
    const postDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    return postDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  useEffect(() => {
    const fetchCategoryAds = async () => {
      try {
        setLoading(true);
        const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
        const q = query(collection(db, "olxUseradd"), where("adCategory", "==", formattedCategory));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(data);
      } catch (error) {
        console.error("Firebase Error:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    if (categoryName) fetchCategoryAds();
  }, [categoryName]);

  const filteredAds = ads.filter(ad => {
    const price = Number(ad.adPrice);
    const matchesMinPrice = minPrice === '' || price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || price <= Number(maxPrice);
    const matchesLocation = location === '' || ad.adLocation.toLowerCase().includes(location.toLowerCase());
    return matchesMinPrice && matchesMaxPrice && matchesLocation;
  });

  const SkeletonCard = () => (
    <div className="flex bg-white rounded-md border border-gray-200 h-[150px] animate-pulse overflow-hidden mb-3">
      <div className="w-[180px] sm:w-[260px] bg-gray-200 flex-shrink-0"></div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div><div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>
        <div className="flex justify-between items-center"><div className="h-3 bg-gray-200 rounded w-1/4"></div><div className="h-3 bg-gray-200 rounded w-1/6"></div></div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        
        {/* Main Layout Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* --- LEFT SIDEBAR (Forcefully Visible on Desktop) --- */}
          <aside className="hidden md:block col-span-3">
            <h2 className="text-xl font-bold mb-4 text-[#002f34]">Filters</h2>
            
            {/* Category Box */}
            <div className="bg-white p-4 border border-gray-200 mb-4 shadow-sm">
              <h3 className="font-bold text-xs uppercase mb-3 text-[#002f34]">Categories</h3>
              <p className="text-[#002f34] font-bold border-l-4 border-[#002f34] pl-2 capitalize text-sm">{categoryName}</p>
            </div>

            {/* Location Box */}
            <div className="bg-white p-4 border border-gray-200 mb-4 shadow-sm">
              <h3 className="font-bold text-xs uppercase mb-3 text-[#002f34]">Location</h3>
              <div className="relative">
                <MapPinIcon className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Location..." 
                  className="w-full bg-gray-50 p-2 pl-8 text-sm outline-none border-b border-gray-200 focus:border-[#002f34]"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white p-4 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-xs uppercase mb-3 text-[#002f34]">Price Range</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 bg-gray-50 p-2 text-xs rounded border border-gray-100" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <input type="number" placeholder="Max" className="w-1/2 bg-gray-50 p-2 text-xs rounded border border-gray-100" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>
          </aside>

          {/* --- RIGHT CONTENT AREA --- */}
          <main className="col-span-12 md:col-span-9">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-[12px] text-gray-500 mb-4 px-1">
              <Link to="/" className="hover:underline">Home</Link>
              <ChevronRightIcon className="h-2 w-2 mx-2" />
              <span className="capitalize font-semibold">{categoryName}</span>
            </nav>

            <div className="flex flex-col gap-3">
              {loading ? (
                [1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)
              ) : filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <Link to={`/item/${ad.id}`} key={ad.id} className="flex bg-white rounded-md border border-gray-200 hover:shadow-lg transition-all h-[150px] overflow-hidden group shadow-sm">
                    <div className="w-[180px] sm:w-[240px] bg-[#eef1f2] flex-shrink-0">
                      <img src={ad.adImages?.[0]} className="object-cover h-full w-full group-hover:scale-105 transition-all duration-500" alt="" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-[#002f34]">Rs {Number(ad.adPrice).toLocaleString()}</h3>
                          <HeartIcon className="h-6 w-6 text-gray-300 hover:text-red-500 transition-colors" />
                        </div>
                        <p className="text-[17px] text-gray-700 font-normal line-clamp-1 mt-1 group-hover:text-blue-600">{ad.adTitle}</p>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-500 font-semibold uppercase">
                        <div className="flex items-center gap-1 truncate max-w-[70%]"><MapPinIcon className="h-3 w-3" />{ad.adLocation}</div>
                        <span className="text-gray-400">{getTimeAgo(ad.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-20 bg-white border border-dashed rounded-lg text-gray-500">
                  Is category mein koi ads nahi hain.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}