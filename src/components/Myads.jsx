import React, { useEffect, useState } from 'react';
import { db, auth } from './firebaseconfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';

// --- SKELETON LOADING COMPONENT ---
const AdsSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded p-4 flex flex-col md:flex-row gap-4 animate-pulse">
                <div className="w-full md:w-48 h-32 bg-gray-200 rounded shrink-0"></div>
                <div className="flex-1 space-y-3 py-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
                </div>
                <div className="flex gap-2 items-end">
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        ))}
    </div>
);

function MyAds() {
    const [myAds, setMyAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/login');
            return;
        }

        const q = query(
            collection(db, "olxUseradd"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const adsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMyAds(adsData);
            setLoading(false);
        }, (error) => {
            console.error("Snapshot Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleDelete = async (adId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this ad?")) {
            try {
                await deleteDoc(doc(db, "olxUseradd", adId));
                alert("Ad deleted successfully!");
            } catch (error) {
                console.error("Delete Error:", error);
                alert("Failed to delete ad.");
            }
        }
    };

    const handleEditClick = (adId, e) => {
        e.stopPropagation();
        // App.jsx mein /edit-ad/:id route hai jo PostAttributes ko open karega
        navigate(`/edit-ad/${adId}`);
    };

const handleCardClick = (adId) => {
    console.log("🔵 Card clicked, going to:", `/my-ad/${adId}`);
    navigate(`/my-ad/${adId}`);
};

    const handleSellFasterClick = (e) => {
        e.stopPropagation();
        alert("Sell faster feature coming soon!");
    };

    return (
        <div className="bg-[#f2f4f5] min-h-screen pt-32 pb-10">
            <div className="container mx-auto px-4 max-w-[1000px]">
                <h1 className="text-2xl font-bold text-[#002f34] mb-6 uppercase">Manage and view your Ads</h1>

                {loading ? (
                    <AdsSkeleton />
                ) : (
                    <div className="space-y-4">
                        {myAds.length > 0 ? myAds.map((ad) => (
                            <div 
                                key={ad.id} 
                                onClick={() => handleCardClick(ad.id)}
                                className="bg-white border border-gray-300 rounded overflow-hidden flex flex-col md:flex-row p-4 gap-4 shadow-sm relative group hover:shadow-md transition-all cursor-pointer"
                            >
                                
                                {/* Ad Image */}
                                <div className="w-full md:w-48 h-32 bg-gray-100 rounded overflow-hidden shrink-0">
                                    <img 
                                        src={ad.adImages?.[0] || ad.adImage} 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                                        alt={ad.adTitle}
                                        onError={(e) => {
                                            e.target.src = "https://www.olx.com.pk/assets/noPhoto_noinline.2996960d70364f8c679a8117730e2343.svg";
                                        }}
                                    />
                                </div>

                                {/* Ad Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#002f34] uppercase truncate">{ad.adTitle}</h3>
                                        <p className="text-xl font-bold text-[#002f34] mt-1">
                                            Rs {Number(ad.adPrice).toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span>
                                                Active from: {ad.createdAt?.toDate().toLocaleDateString() || "Today"}
                                            </span>
                                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">
                                                Active
                                            </span>
                                        </div>
                                        
                                        {/* Location */}
                                        {ad.adLocation && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                📍 {ad.adLocation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Buttons Section */}
                                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:justify-end items-center">
                                        <button 
                                            onClick={(e) => handleDelete(ad.id, e)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            title="Delete Ad"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>

                                        <button 
                                            onClick={(e) => handleEditClick(ad.id, e)}
                                            className="px-8 py-2 border-2 border-[#002f34] text-[#002f34] font-bold rounded hover:bg-gray-50 transition-all text-sm"
                                        >
                                            Edit
                                        </button>
                                        
                                        <button 
                                            onClick={handleSellFasterClick}
                                            className="px-6 py-2 bg-[#002f34] text-white font-bold rounded hover:bg-[#002f34]/90 transition-all text-sm"
                                        >
                                            Sell faster now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white p-20 text-center border rounded">
                                <p className="text-gray-500 font-bold">You haven't posted any ads yet.</p>
                                <button 
                                    onClick={() => navigate('/post')} 
                                    className="mt-4 text-blue-600 font-bold underline hover:text-blue-800"
                                >
                                    Post an ad now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyAds;