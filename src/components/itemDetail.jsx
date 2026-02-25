import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./logo/authContext/authcontext.jsx";
import { 
  ChevronRightIcon, ChevronLeftIcon, 
  PhoneIcon, ChatBubbleLeftEllipsisIcon, 
  HeartIcon as HeartOutline, 
  ShareIcon, MapPinIcon, 
  ClockIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { db, doc, getDoc, serverTimestamp, setDoc, collection, query, where, getDocs, limit } from "./firebaseconfig/index.jsx";
import moment from "moment"; 

// Image Zoom Modal Component
const ImageZoomModal = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  if (!images) return null;
  
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 z-10 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={onPrev}
              className="absolute left-6 text-white bg-black/50 hover:bg-black/70 rounded-full p-4 transition-colors"
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
            <button 
              onClick={onNext}
              className="absolute right-6 text-white bg-black/50 hover:bg-black/70 rounded-full p-4 transition-colors"
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>
          </>
        )}
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold">
          {currentIndex + 1} / {images.length}
        </div>
        
        <img 
          src={images[currentIndex]} 
          className="max-h-[90vh] max-w-[90vw] object-contain" 
          alt="product zoom" 
        />
      </div>
    </div>
  );
};

// --- SKELETON LOADING ---
const Skeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6 animate-pulse mt-6">
    <div className="lg:w-2/3 space-y-4">
      <div className="bg-gray-200 h-[480px] rounded-lg"></div>
      <div className="bg-white p-6 space-y-4 rounded-lg shadow-sm border">
        <div className="h-10 bg-gray-200 w-1/3 rounded"></div>
        <div className="h-6 bg-gray-200 w-2/3 rounded"></div>
        <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
      </div>
    </div>
    <div className="lg:w-1/3 space-y-4">
      <div className="bg-white p-6 h-40 rounded-lg shadow-sm border"></div>
      <div className="bg-white p-6 h-60 rounded-lg shadow-sm border"></div>
    </div>
  </div>
);

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [relatedAds, setRelatedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNumber, setShowNumber] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    const getItemDetail = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "olxUseradd", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItem(data);
          fetchRelatedAds(data.adCategory, id);
        }
      } catch (error) { 
        console.error("Error:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    if (id) getItemDetail();
  }, [id]);

  const fetchRelatedAds = async (category, currentId) => {
    try {
      const q = query(
        collection(db, "olxUseradd"), 
        where("adCategory", "==", category), 
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const ads = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentId) ads.push({ id: doc.id, ...doc.data() });
      });
      setRelatedAds(ads);
    } catch (error) { 
      console.error(error); 
    }
  };

  const nextImage = () => { 
    if (item?.adImages?.length) {
      setActiveImg((prev) => (prev + 1) % item.adImages.length);
    }
  };
  
  const prevImage = () => { 
    if (item?.adImages?.length) {
      setActiveImg((prev) => (prev - 1 + item.adImages.length) % item.adImages.length);
    }
  };

  const handleImageClick = () => {
    if (item?.adImages?.length) {
      setShowZoom(true);
    }
  };

  const handleChatStart = async () => {
    if (!user) return navigate('/login');
    const sellerId = item?.uid || item?.userId || item?.userUid;
    
    if (user.uid === sellerId) {
      alert("You cannot chat with yourself!");
      return;
    }
    
    const chatId = [user.uid, sellerId].sort().join('_');
    const chatRef = doc(db, "chats", chatId);
    const chatData = {
      chatId, 
      productTitle: item.adTitle, 
      productImage: item.adImages?.[0] || item.adImage,
      productPrice: item.adPrice, 
      productId: id, 
      sellerName: item.sellerName,
      participants: [user.uid, sellerId], 
      timestamp: serverTimestamp(),
    };
    await setDoc(chatRef, chatData, { merge: true });
    navigate(`/my-chats/chat/${chatId}`, { state: chatData });
  };

  if (!loading && !item) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#002f34] mb-2">Item Not Found!</h2>
        <p className="text-gray-500 mb-4">The ad you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#002f34] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#001e22]"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f2f4f5] min-h-screen font-sans py-4">
      <div className="container mx-auto px-4 max-w-[1280px]">
        
        {/* Image Zoom Modal */}
        {showZoom && item?.adImages && (
          <ImageZoomModal 
            images={item.adImages}
            currentIndex={activeImg}
            onClose={() => setShowZoom(false)}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
        
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <span className="cursor-pointer hover:text-[#002f34]" onClick={() => navigate('/')}>Home</span>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="cursor-pointer hover:text-[#002f34]" onClick={() => navigate('/')}>All Categories</span>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-[#002f34] font-medium">{item?.adCategory || "Category"}</span>
        </div>
        
        {/* TOP BANNER AD */}
        <div className="w-full flex justify-center mb-6 bg-white p-2 rounded-lg shadow-sm">
          <img 
            src="https://tpc.googlesyndication.com/simgad/4057360645412603123" 
            className="max-w-full h-auto rounded-sm" 
            alt="advertisement" 
          />
        </div>

        {loading ? <Skeleton /> : (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* LEFT COLUMN - Main Content */}
            <div className="lg:w-2/3 space-y-4">
              
              {/* IMAGE SLIDER */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 relative group">
                <div className="bg-[#f7f8f8] flex justify-center items-center h-[500px] relative">
                  {item.adImages?.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage} 
                        className="absolute left-4 z-10 p-2 bg-white/90 text-[#002f34] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white cursor-pointer"
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={nextImage} 
                        className="absolute right-4 z-10 p-2 bg-white/90 text-[#002f34] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white cursor-pointer"
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  
                  <img 
                    src={Array.isArray(item.adImages) ? item.adImages[activeImg] : (item.adImage || item.adImages)} 
                    className="max-h-full max-w-full object-contain cursor-pointer" 
                    alt="product"
                    onClick={handleImageClick}
                  />
                  
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleImageClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Click to zoom
                  </div>
                  
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                    {activeImg + 1} / {item.adImages?.length || 1}
                  </div>
                </div>
                
                {/* Thumbnail Strip */}
                {item.adImages?.length > 1 && (
                  <div className="flex gap-2 p-3 bg-white border-t overflow-x-auto">
                    {item.adImages.map((img, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setActiveImg(idx)}
                        className={`w-16 h-16 flex-shrink-0 rounded border-2 cursor-pointer overflow-hidden ${
                          activeImg === idx ? 'border-[#3a77ff]' : 'border-transparent'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PRICE, TITLE, LOCATION */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-[38px] font-bold text-[#002f34] leading-tight">
                      Rs {Number(item.adPrice).toLocaleString()}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">Negotiable</span>
                      {item.ptaStatus && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.ptaStatus.toLowerCase() === "approved" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.ptaStatus}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ShareIcon className="h-6 w-6 text-[#002f34]" />
                    </button>
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isLiked ? (
                        <HeartSolid className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartOutline className="h-6 w-6 text-[#002f34]" />
                      )}
                    </button>
                  </div>
                </div>
                
                <h2 className="text-[22px] text-[#002f34] mt-2 font-medium capitalize">{item.adTitle}</h2>
                
                <div className="flex items-center gap-4 mt-6 text-[14px] text-gray-600 border-t pt-4">
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="h-4 w-4" /> 
                    {item.adLocation || "Pakistan"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" /> 
                    {item.createdAt ? moment(item.createdAt.toDate()).fromNow() : "Just now"}
                  </span>
                </div>
              </div>

              {/* DETAILS SECTION */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-[22px] font-bold text-[#002f34] mb-5">Details</h3>
                
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <span className="text-gray-500 text-sm">Category</span>
                    <p className="text-[#002f34] font-medium mt-1">{item.adCategory}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Condition</span>
                    <p className="text-[#002f34] font-medium mt-1 capitalize">{item.adCondition}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Brand</span>
                    <p className="text-[#002f34] font-medium mt-1">{item.adBrand || "Not specified"}</p>
                  </div>
                  {item.adModel && (
                    <div>
                      <span className="text-gray-500 text-sm">Model</span>
                      <p className="text-[#002f34] font-medium mt-1">{item.adModel}</p>
                    </div>
                  )}
                </div>
                
                {/* DESCRIPTION */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-[20px] font-bold text-[#002f34] mb-4">Description</h3>
                  <p className={`text-[#002f34] text-[16px] leading-relaxed whitespace-pre-wrap ${
                    !showFullDescription ? 'line-clamp-4' : ''
                  }`}>
                    {item.adDescription}
                  </p>
                  {item.adDescription?.length > 300 && (
                    <button 
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-[#3a77ff] font-medium mt-2 hover:underline"
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>

              {/* RELATED ADS */}
              {relatedAds.length > 0 && (
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#002f34]">Related Ads</h2>
                    <button className="text-[#3a77ff] text-sm font-medium hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {relatedAds.map(ad => (
                      <div 
                        key={ad.id} 
                        onClick={() => {
                          navigate(`/item/${ad.id}`);
                          window.scrollTo(0, 0);
                        }} 
                        className="bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer overflow-hidden hover:shadow-md transition-all hover:-translate-y-1"
                      >
                        <div className="h-36 overflow-hidden bg-gray-100">
                          <img 
                            src={ad.adImages?.[0] || ad.adImage} 
                            className="w-full h-full object-cover" 
                            alt="" 
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-bold text-base text-[#002f34]">Rs {Number(ad.adPrice).toLocaleString()}</p>
                          <p className="text-xs truncate text-gray-600 mt-1">{ad.adTitle}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{ad.adLocation || "Pakistan"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Seller Info & Actions */}
            <div className="lg:w-1/3 space-y-4">
              
              {/* SELLER CARD */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-4">
                <div className="flex items-center gap-4 mb-6">
                  {/* Direct URL use karo - ye 100% kaam karega */}
                  <img 
                    src="https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg" 
                    alt="profile"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-bold text-[#002f34]">{item?.sellerName || "OLX User"}</p>
                    </div>
                    <p className="text-[13px] text-gray-500 flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" /> Member since 2024
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowNumber(!showNumber)} 
                    className="w-full bg-[#002f34] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#001e22] transition-colors cursor-pointer text-base"
                  >
                    <PhoneIcon className="h-5 w-5" /> 
                    {showNumber ? (item?.adPhone || "Not Available") : "Show phone number"}
                  </button>
                  
                  <button 
                    onClick={handleChatStart} 
                    className="w-full border-2 border-[#002f34] text-[#002f34] font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-base"
                  >
                    <ChatBubbleLeftEllipsisIcon className="h-5 w-5" /> 
                    Chat with seller
                  </button>
                </div>
              </div>

              {/* SAFETY TIPS */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#002f34] mb-5 text-center">Your safety matters!</h3>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 1024 1024" className="text-[#3a77ff]">
                      <path fill="currentColor" d="M512 64L128 256v320c0 235.2 163.2 454.4 384 512 220.8-57.6 384-276.8 384-512V256L512 64zm0 832c-156.8-44.8-256-195.2-256-352V320l256-128 256 128v224c0 156.8-99.2 307.2-256 352z" />
                      <path fill="currentColor" d="M633.6 406.4l-160 160-70.4-70.4-44.8 44.8 115.2 115.2 204.8-204.8z" />
                    </svg>
                  </div>
                  <ul className="text-left text-[13px] text-[#002f34] space-y-3 w-full">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      Pay after seeing the item
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      Check item before buying
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      Use OLX chat for safety
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* REPORT AD */}
              <div className="text-center">
                <button className="text-sm text-gray-400 hover:text-gray-600">
                  Report this ad
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;