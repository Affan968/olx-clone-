import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router'; // Ensure correct router import
import { collection,db,getDocs } from './firebaseconfig/index.jsx';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const queryText = searchParams.get('q') || ""; // URL se 'q' nikal raha hai
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResults = async () => {
      if (!queryText.trim()) return; // Khali search par fetch na karo
      
      setLoading(true);
      try {
        console.log("Searching for:", queryText); // Debugging
        const snapshot = await getDocs(collection(db, "olxUseradd"));
        const all = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter logic
        const filtered = all.filter(p => 
          p.adTitle?.toLowerCase().includes(queryText.toLowerCase()) ||
          p.adCategory?.toLowerCase().includes(queryText.toLowerCase()) ||
          p.adDescription?.toLowerCase().includes(queryText.toLowerCase())
        );
        
        setResults(filtered);
      } catch (error) {
        console.error("Firebase Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getResults();
  }, [queryText]); // Jab bhi query badle, ye chale

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002f34] mb-4"></div>
      <p className="text-xl font-bold text-[#002f34]">Searching ads...</p>
    </div>
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-10 mt-20">
      <h1 className="text-2xl font-bold mb-8 text-[#002f34]">
        Showing results for: <span className="text-cyan-600">"{queryText}"</span>
      </h1>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((p) => (
            <Link to={`/item/${p.id}`} key={p.id} className="border rounded bg-white hover:shadow-md transition-shadow block overflow-hidden group">
              <div className="h-48 w-full bg-gray-50 flex items-center justify-center p-2">
                <img 
                  src={p.adImages && p.adImages[0] ? p.adImages[0] : (p.adImage || "https://via.placeholder.com/300")} 
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                  alt={p.adTitle} 
                />
              </div>
              <div className="p-3">
                <p className="text-xl font-bold text-[#002f34]">Rs {Number(p.adPrice).toLocaleString()}</p>
                <h3 className="text-[#002f34] truncate text-sm mt-1">{p.adTitle}</h3>
                <div className="flex justify-between mt-4 text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                    <span>{p.adCategory}</span>
                    <span>{p.location || "Pakistan"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <img src="https://www.olx.com.pk/assets/iconNoResults_noinline.0028e5c83f9828e83b8b.svg" className="mx-auto w-40 opacity-40 mb-4" alt="no-results" />
          <p className="text-2xl font-bold text-[#002f34]">Oops! No results found.</p>
          <p className="text-gray-500 mt-2">Check the spelling or try searching for something else.</p>
          <Link to="/" className="mt-6 inline-block bg-[#002f34] text-white px-6 py-2 rounded font-bold">Back to Home</Link>
        </div>
      )}
    </div>
  );
}

export default SearchResults;