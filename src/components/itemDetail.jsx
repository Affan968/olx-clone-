import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./logo/authContext/authcontext.jsx";
import { ChevronRightIcon, ChevronLeftIcon, PhoneIcon, ChatBubbleLeftEllipsisIcon, HeartIcon, ShareIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { db, doc, getDoc, serverTimestamp, setDoc, collection, query, where, getDocs, limit } from "./firebaseconfig/index.jsx";
import moment from "moment"; 

// --- REAL SKELETON LOADING ---
const Skeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6 animate-pulse mt-6">
    <div className="lg:w-2/3 space-y-4">
      <div className="bg-gray-300 h-[480px] rounded"></div>
      <div className="bg-white p-6 space-y-4 rounded shadow-sm">
        <div className="h-10 bg-gray-200 w-1/4 rounded"></div>
        <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
      </div>
    </div>
    <div className="lg:w-1/3 space-y-4">
      <div className="bg-white p-6 h-40 rounded shadow-sm"></div>
      <div className="bg-white p-6 h-60 rounded shadow-sm"></div>
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
      } catch (error) { console.error("Error:", error); } 
      finally { setLoading(false); }
    };
    if (id) getItemDetail();
  }, [id]);

  const fetchRelatedAds = async (category, currentId) => {
    try {
      const q = query(collection(db, "olxUseradd"), where("adCategory", "==", category), limit(4));
      const querySnapshot = await getDocs(q);
      const ads = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentId) ads.push({ id: doc.id, ...doc.data() });
      });
      setRelatedAds(ads);
    } catch (error) { console.error(error); }
  };

  const nextImage = () => { if (item?.adImages?.length) setActiveImg((prev) => (prev + 1) % item.adImages.length); };
  const prevImage = () => { if (item?.adImages?.length) setActiveImg((prev) => (prev - 1 + item.adImages.length) % item.adImages.length); };

  const handleChatStart = async () => {
    if (!user) return navigate('/login');
    const sellerId = item?.uid || item?.userId || item?.userUid;
    const chatId = [user.uid, sellerId].sort().join('_');
    const chatRef = doc(db, "chats", chatId);
    const chatData = {
      chatId, productTitle: item.adTitle, productImage: item.adImages?.[0],
      productPrice: item.adPrice, productId: id, sellerName: item.sellerName,
      participants: [user.uid, sellerId], timestamp: serverTimestamp(),
    };
    await setDoc(chatRef, chatData, { merge: true });
    navigate(`/my-chats/chat/${chatId}`, { state: chatData });
  };

  if (!loading && !item) return <div className="pt-40 text-center font-bold">Item Not Found!</div>;

  return (
    <div className="bg-[#f2f4f5] min-h-screen   font-sans">
      <div className="container mx-auto px-4 max-w-[1200px]">
        
        {/* BANNER */}
        <div className="w-full flex justify-center mb-6">
           <img src="https://tpc.googlesyndication.com/simgad/4057360645412603123" className="max-w-full h-auto rounded-sm shadow-sm" alt="advertisement" />
        </div>

        {loading ? <Skeleton /> : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="lg:w-2/3 space-y-4">
              {/* IMAGE SLIDER */}
              <div className="bg-white rounded overflow-hidden shadow-sm relative group">
                <div className="bg-black flex justify-center items-center h-[480px] relative">
                  {item.adImages?.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><ChevronLeftIcon className="h-8 w-8" /></button>
                      <button onClick={nextImage} className="absolute right-4 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><ChevronRightIcon className="h-8 w-8" /></button>
                    </>
                  )}
                  <img src={Array.isArray(item.adImages) ? item.adImages[activeImg] : (item.adImage || item.adImages)} className="max-h-full object-contain" alt="product" />
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-bold">{activeImg + 1} / {item.adImages?.length || 1}</div>
                </div>
              </div>

              {/* PRICE, TITLE, LOCATION */}
              <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <h1 className="text-[32px] font-bold text-[#002f34]">Rs {Number(item.adPrice).toLocaleString()}</h1>
                  <div className="flex gap-4">
                    <ShareIcon className="h-6 w-6 text-[#002f34] cursor-pointer" />
                    <HeartIcon className="h-6 w-6 text-[#002f34] cursor-pointer" />
                  </div>
                </div>
                <h2 className="text-[20px] text-[#002f34] mt-1 font-normal capitalize">{item.adTitle}</h2>
                <div className="flex justify-between mt-6 text-[14px] text-gray-600">
                  <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" /> {item.adLocation}</span>
                  <span>{item.createdAt ? moment(item.createdAt.toDate()).fromNow() : "Just now"}</span>
                </div>
              </div>

              {/* DETAILS SECTION */}
              <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                <h3 className="text-[20px] font-bold text-[#002f34] mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t border-gray-100 pt-4">
                  <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Brand</span><span className="text-[#002f34] font-semibold">{item.adBrand || "N/A"}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Condition</span><span className="text-[#002f34] font-semibold">{item.adCondition}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Category</span><span className="text-[#002f34] font-semibold">{item.adCategory}</span></div>
                  
                  {item.ptaStatus && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">PTA Status</span>
                      <span className={`font-semibold ${item.ptaStatus.toLowerCase() === "approved" ? "text-green-600" : "text-red-500"}`}>
                        {item.ptaStatus}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-[20px] font-bold text-[#002f34] mb-4">Description</h3>
                  <p className="text-[#002f34] text-[16px] leading-relaxed whitespace-pre-wrap">{item.adDescription}</p>
                </div>
              </div>

              {/* RELATED ADS */}
              {relatedAds.length > 0 && (
                <div className="pt-6">
                  <h2 className="text-xl font-bold text-[#002f34] mb-4">Related Ads</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedAds.map(ad => (
                      <div key={ad.id} onClick={() => navigate(`/item/${ad.id}`)} className="bg-white rounded shadow-sm cursor-pointer overflow-hidden  hover:shadow-md transition-shadow">
                        <img src={ad.adImages?.[0] || ad.adImage} className="h-32 w-full object-cover" alt="" />
                        <div className="p-2">
                          <p className="font-bold text-sm text-[#002f34]">Rs {Number(ad.adPrice).toLocaleString()}</p>
                          <p className="text-xs truncate text-gray-600">{ad.adTitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="lg:w-1/3 space-y-4">
              <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden">
                    <img src="https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg" className="w-12 h-12" alt="profile" />
                  </div>
                  <div><p className="text-lg font-bold text-[#002f34]">{item.sellerName || "User"}</p><p className="text-[12px] text-gray-400">Member since 2024</p></div>
                </div>
                <button onClick={() => setShowNumber(!showNumber)} className="w-full bg-[#002f34] text-white font-bold py-3.5 rounded flex items-center justify-center gap-2 mb-3 cursor-pointer"><PhoneIcon className="h-5 w-5" /> {showNumber ? (item.adPhone || "Not Available") : "Show phone number"}</button>
                <button onClick={handleChatStart} className="w-full border-2 border-[#002f34] text-[#002f34] font-bold py-3.5 rounded flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer"> <ChatBubbleLeftEllipsisIcon className="h-5 w-5" /> Chat</button>
              </div>

              {/* SAFETY TIPS */}
              <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#002f34] mb-4 text-center">Your safety matters!</h3>
                <div className="flex flex-col items-center">
                  <svg width="60" height="60" viewBox="0 0 1024 1024" className="mb-4 text-[#3a77ff]">
                    <path fill="currentColor" d="M512 64L128 256v320c0 235.2 163.2 454.4 384 512 220.8-57.6 384-276.8 384-512V256L512 64zm0 832c-156.8-44.8-256-195.2-256-352V320l256-128 256 128v224c0 156.8-99.2 307.2-256 352z" /><path fill="currentColor" d="M633.6 406.4l-160 160-70.4-70.4-44.8 44.8 115.2 115.2 204.8-204.8z" />
                  </svg>
                  <ul className="text-left text-[13px] text-[#002f34] space-y-3 px-2 font-medium">
                    <li>• Pay after seeing the item.</li>
                    <li>• Check item before buying.</li>
                    <li>• Use OLX chat for safety.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;