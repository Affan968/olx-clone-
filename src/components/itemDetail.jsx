import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { db } from "./firebaseconfig"; 
import { doc, getDoc } from "firebase/firestore";
import { ChevronRightIcon, PhoneIcon, ChatBubbleLeftEllipsisIcon, HeartIcon, ShareIcon, MapPinIcon } from "@heroicons/react/24/outline";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getItemDetail = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "olxUseradd", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem(docSnap.data());
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getItemDetail();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading...</div>;
  if (!item) return <div className="pt-40 text-center font-bold">Item Not Found!</div>;

  return (
    <div className="bg-white min-h-screen pt-32 pb-10">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-black rounded overflow-hidden flex justify-center items-center h-[480px]">
              <img src={item.adImages?.[0]} className="max-h-full object-contain" alt="product" />
            </div>

            {/* Price & Location Area */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#002f34]">Rs {item.adPrice}</h1>
                <div className="flex gap-4">
                   <ShareIcon className="h-6 w-6 text-[#002f34] cursor-pointer" />
                   <HeartIcon className="h-6 w-6 text-[#002f34] cursor-pointer" />
                </div>
              </div>
              <p className="text-[#002f34] text-lg mt-2 font-normal capitalize">{item.adTitle}</p>
              <div className="flex justify-between mt-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4"/> {item.adLocation}</span>
                <span>45 minutes ago</span>
              </div>
            </div>

            {/* --- EXACT DETAILS GRID (Jaisa aapne screenshot mein red mark kiya) --- */}
            <div className="border border-gray-200 rounded-md p-4">
              <h2 className="text-xl font-bold text-[#002f34] mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                
                {/* Brand Item */}
                <div className="flex flex-col border-b border-gray-100 pb-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Brand</span>
                      <span className="text-[#002f34] font-medium">{item.adBrand || "Apple iPhone"}</span>
                   </div>
                </div>

                {/* Model Item */}
                <div className="flex flex-col border-b border-gray-100 pb-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Model</span>
                      <span className="text-[#002f34] font-medium">{item.adModel || "15 Pro"}</span>
                   </div>
                </div>

                {/* Condition Item */}
                <div className="flex flex-col border-b border-gray-100 pb-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Condition</span>
                      <span className="text-[#002f34] font-medium">{item.adCondition || "Used"}</span>
                   </div>
                </div>

                {/* PTA Status Item */}
                <div className="flex flex-col border-b border-gray-100 pb-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">PTA Status</span>
                      <span className="text-[#002f34] font-medium">{item.adPtaStatus || "PTA Approved"}</span>
                   </div>
                </div>

              </div>
            </div>

            {/* Description Section */}
            <div className="border border-gray-200 rounded-md p-4">
              <h2 className="text-xl font-bold text-[#002f34] mb-4">Description</h2>
              <p className="text-[#002f34] text-sm leading-relaxed whitespace-pre-wrap">
                {item.adDescription}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Seller Info */}
          <div className="lg:w-1/3">
            <div className="border border-gray-200 rounded-md p-4 sticky top-32 shadow-sm">
              <div className="flex items-center justify-between mb-6 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border overflow-hidden">
                    <img src="https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg" className="w-12 h-12" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posted by</p>
                    <p className="text-lg font-bold text-[#002f34] -mt-1">{item.sellerName || "User"}</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-6 w-6 text-[#002f34]" />
              </div>
              <button className="w-full bg-[#002f34] text-white font-bold py-3.5 rounded-md flex items-center justify-center gap-2 mb-3">
                <PhoneIcon className="h-5 w-5" /> Show phone number
              </button>
              <button className="w-full border-2 border-[#002f34] text-[#002f34] font-bold py-3.5 rounded-md flex items-center justify-center gap-2">
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5" /> Chat
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ItemDetail;