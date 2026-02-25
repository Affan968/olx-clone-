import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { 
  ChevronLeftIcon, 
  MapPinIcon 
} from "@heroicons/react/24/outline";
import { db, doc, getDoc } from "./firebaseconfig/index.jsx";
import moment from "moment"; 

// Skeleton Loading
const Skeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

function MyAdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "olxUseradd", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setItem(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching ad:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAd();
  }, [id]);

  // Calculate expiry date (30 days from creation)
  const getExpiryDate = () => {
    if (!item?.createdAt) return "N/A";
    const createdDate = item.createdAt.toDate();
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate.toLocaleDateString('en-GB');
  };

  if (!loading && !item) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#002f34] mb-2">Ad Not Found!</h2>
        <button 
          onClick={() => navigate('/my-ads')}
          className="bg-[#002f34] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#001e22]"
        >
          Back to My Ads
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f2f4f5] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-[800px]">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/my-ads')}
          className="flex items-center gap-2 text-[#002f34] mb-4 hover:underline"
        >
          <ChevronLeftIcon className="h-4 w-4" /> Back
        </button>

        {loading ? <Skeleton /> : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Ad Image - Agar image hai to dikhao */}
            {item?.adImages?.[0] && (
              <div className="w-full h-64 bg-gray-100">
                <img 
                  src={item.adImages[0]} 
                  className="w-full h-full object-cover" 
                  alt={item.adTitle}
                />
              </div>
            )}
            
            {/* Main Content */}
            <div className="p-6">
              
              {/* Price and Title */}
              <h1 className="text-3xl font-bold text-[#002f34] mb-2">
                Rs {Number(item?.adPrice).toLocaleString()}
              </h1>
              <h2 className="text-xl text-[#002f34] mb-4 font-medium">
                {item?.adTitle}
              </h2>
              
              {/* Expiry Notice - Exactly like screenshot */}
              <div className="mb-4 text-sm">
                <span className="text-gray-600">Your ad expires on </span>
                <span className="font-bold text-[#002f34]">{getExpiryDate()}</span>
              </div>
              
              {/* Location - Exactly like screenshot */}
              <div className="flex items-center gap-1 text-gray-600 mb-6">
                <MapPinIcon className="h-4 w-4" />
                <span className="text-sm">{item?.adLocation || "Pakistan"}</span>
              </div>

              {/* Details Section - Exactly like screenshot */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-lg font-bold text-[#002f34] mb-3">Details</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-gray-500 w-24">Brand</span>
                    <span className="text-[#002f34] font-medium">{item?.adBrand || "Habitt"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Condition</span>
                    <span className="text-[#002f34] font-medium capitalize">{item?.adCondition || "Used"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Category</span>
                    <span className="text-[#002f34] font-medium">{item?.adCategory || "Furniture"}</span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-lg font-bold text-[#002f34] mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {item?.adDescription || "Feature Your Ad Now & Reach 20X More Buyers!"}
                </p>
              </div>

              {/* Ad ID and Boost Section - Exactly like screenshot */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Ad ID: {id.slice(-10)}</span>
                  <button 
                    onClick={() => alert("Boost feature coming soon!")}
                    className="px-6 py-3 bg-[#002f34] text-white font-bold rounded-lg hover:bg-[#001e22] transition-colors"
                  >
                    Sell faster now
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Feature or boost your ad on top to reach more clients
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAdDetail;