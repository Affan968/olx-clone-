import React, { useContext, useState, useEffect, useRef } from 'react'; 
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router'; 
import CategoryBar from './CategoryBar';
import locationmap from './logo/locationmap.svg';
import { AuthContext } from './logo/authContext/authcontext.jsx';
import { db, auth, collection, query, where, onSnapshot } from './firebaseconfig/index.jsx'; 
import { signOut } from "firebase/auth"; 

function Header() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false); 
  const dropdownRef = useRef(null);

  // --- SEARCH STATE & FUNCTION (Added only this) ---
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  // ------------------------------------------------

  useEffect(() => {
    if (!user) {
      setHasNotifications(false);
      return;
    }
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      where("hasUnread", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unreadForMe = snapshot.docs.some(doc => doc.data().lastSenderId !== user.uid);
      setHasNotifications(unreadForMe);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setShowDropdown(false);
      await signOut(auth); 
      window.location.href = "/"; 
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[40] bg-white shadow-sm">
        <div className="bg-[#EBF1FF] relative z-[41]">
          <div className="container mx-auto px-4 h-16 md:h-19 flex items-center justify-between">
            
            <div className="flex items-center space-x-2 md:space-x-6">
              <Link to="/">
                <div className='border-1 border-white px-3 md:px-4 py-3 md:py-5 mt-2 rounded-[20px] rounded-b-none bg-white flex items-center shadow-sm text-[#002f34] cursor-pointer'>
                  <svg className="h-6 md:h-7" fill="#3A77FF" viewBox="0 0 36.289 20.768">
                    <path d="M18.9 20.77V0h4.93v20.77zM0 10.39a8.56 8.56 0 1 1 8.56 8.56A8.56 8.56 0 0 1 0 10.4zm5.97-.01a2.6 2.6 0 1 0 2.6-2.6 2.6 2.6 0 0 0-2.6 2.6zm27 5.2l-1.88-1.87-1.87 1.88H25.9V12.3l1.9-1.9-1.9-1.89V5.18h3.27l1.92 1.92 1.93-1.92h3.27v3.33l-1.9 1.9 1.9 1.9v3.27z"></path>
                  </svg>
                </div>
              </Link>
              <nav className="hidden sm:flex items-center space-x-9 text-gray-700 font-semibold ml-4">
                  <Link to="/search?q=Motors" className="flex items-center space-x-1 cursor-pointer hover:text-[#3A77FF] transition-colors">
                    <img className="h-6" src="https://www.olx.com.pk/assets/iconMotors.6bf280165e43e55b173d0a53551e2bfb.png" alt="Motors" />
                    <span className='text-[16px] font-bold '>Motors</span>
                  </Link>
                  <Link to="/search?q=Property" className="flex items-center space-x-1 cursor-pointer hover:text-[#3A77FF] transition-colors">
                    <img className="h-6" src="https://www.olx.com.pk/assets/iconProperty.d09c6d2e3621f900c17c9e8330a1a37b.png" alt="Property" />
                    <span className='text-[16px] font-bold '>Property</span>
                  </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
              {user ? (
                <div className="flex items-center space-x-2 md:space-x-3 relative gap-1 md:gap-3">
                  <div className="relative cursor-pointer" onClick={() => navigate('/my-chats')}>
                    <img src="https://www.olx.com.pk/assets/iconChat_noinline.31f5df4a6a21fc770ed6863958662677.svg" className="h-6 w-6" alt="Chat" />
                    {hasNotifications && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                  
                  <img src="https://www.olx.com.pk/assets/iconNotifications_noinline.4444f6b42acbe30d772d80ef1225f574.svg" className="h-6 w-6 cursor-pointer" alt="Notifications" />
                  
                  <Link to="/cart" className="p-1 hover:bg-gray-100 rounded-full transition-all text-[#002f34] cursor-pointer">
                    <svg width="24px" height="24px" fill="none" viewBox="2 2 20 20">
                      <path fill="currentColor" d="M18.11 14.92H9.6a2.54 2.54 0 0 1-1.58-.55 2.4 2.4 0 0 1-.87-1.4L5.47 4.87H2.83a.84.84 0 0 1-.24-.57.8.8 0 0 1 .24-.56.84.84 0 0 1 .6-.24h3.31a.85.85 0 0 1 .54.18.8.8 0 0 1 .3.46l1.79 8.77a.8.8 0 0 0 .3.47c.15.12.34.18.53.18h8.5a.85.85 0 0 0 .53-.18.8.8 0 0 0 .3-.46l1.34-6.03a.78.78 0 0 0-.17-.68.85.85 0 0 0-.66-.3h-8.31a.84.84 0 0 1-.59-.23.8.8 0 0 1-.24-.57.8.8 0 0 1 .24-.57.84.84 0 0 1 .59-.23h8.31a2.56 2.56 0 0 1 1.1.21c.34.16.64.38.88.66a2.34 2.34 0 0 1 .51 2.05l-1.35 6.04a2.4 2.4 0 0 1-.89 1.38 2.55 2.55 0 0 1-1.59.52zm-8.2 5.83a2.08 2.08 0 1 1 0-4.17 2.08 2.08 0 0 1 0 4.17zm7.5 0a2.08 2.08 0 1 1 0-4.17 2.08 2.08 0 0 1 0 4.17z"></path>
                    </svg>
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center cursor-pointer space-x-1" onClick={() => setShowDropdown(!showDropdown)}>
                      <img src={user.photoURL || "https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg"} className="h-8 w-8 md:h-9 md:w-9 rounded-full border border-gray-200" alt="User" />
                      <svg className={`h-5 w-5 text-[#002f34] transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    {showDropdown && (
                      <div className="absolute right-0 top-[115%] w-80 bg-white rounded-md shadow-xl border border-gray-200 z-50 overflow-hidden text-[#002f34]">
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-start space-x-3">
                            <img src={user.photoURL || "https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg"} className="h-14 w-14 rounded-full border border-gray-200" alt="" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-500">Hello,</p>
                              <h3 className="font-bold text-lg truncate">{user.displayName || "User"}</h3>
                              <p className="text-xs text-gray-500 mt-1 truncate">{user.email || ""}</p>
                            </div>
                          </div>
                          <Link to="/profile" className="inline-block mt-3 text-sm font-bold hover:underline cursor-pointer" onClick={() => setShowDropdown(false)}>View Public Profile</Link>
                        </div>

                        <div className="py-2">
                          <Link to="/my-ads" className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer" onClick={() => setShowDropdown(false)}>
                              <img src="https://www.olx.com.pk/assets/iconMyAds_noinline.7b01301ec3451389504d4955892ef5b2.svg" className="h-6 w-6 mr-3" alt="My Ads" />
                              <span className="font-medium">My Ads</span>
                          </Link>
                          <Link to="/settings" className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer" onClick={() => setShowDropdown(false)}>
                              <img src="https://www.olx.com.pk/assets/iconSettings_noinline.d16f9b7532fa141768c19078642fdf00.svg" className="h-6 w-6 mr-3" alt="Settings" width="24" />
                              <span className="font-medium">Settings</span>
                          </Link>
                          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-bold border-t border-gray-100 mt-1 cursor-pointer">
                            <img src="https://www.olx.com.pk/assets/logout_noinline.ae614d258a91df474a1d0a7c93ac2344.svg" className="h-6 w-6 mr-3" alt="Logout link" width="24" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button onClick={() => navigate('/login')} className="font-bold text-[#002f34] underline cursor-pointer">Login</button>
              )}

              <button onClick={() => user ? navigate('/post') : navigate('/login')} className="relative inline-flex items-center px-3 py-1 md:px-5 md:py-2 font-bold text-black bg-white rounded-full border-t-[4px] md:border-t-[6px] border-t-[#23E5DB] border-l-[3px] md:border-l-[5px] border-l-[#FFCE32] border-r-[3px] md:border-r-[5px] border-r-[#3A77FF] border-b-[3px] md:border-b-[5px] border-b-[#3A77FF] shadow-sm cursor-pointer scale-90 md:scale-100">
                <PlusIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 stroke-[3px]" />
                <span className="text-xs md:text-base tracking-wider uppercase">Sell</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white py-2 md:py-3 border-b border-gray-200 relative z-[40]">
          <div className="container mx-auto px-4 flex items-center space-x-4">
            <div className="relative w-full md:w-1/4 flex border border-[#002f34] rounded-md overflow-hidden h-12 md:h-14 bg-white items-center px-2 cursor-pointer">
              <img src={locationmap} className="h-5 w-5 md:h-6 md:w-6" alt="" />
              <select className="w-full h-full outline-none bg-transparent ml-2 text-sm md:text-[16px] cursor-pointer"><option>Pakistan</option></select>
            </div>
            
            {/* --- UPDATED SEARCH INPUT --- */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-grow items-center border border-[#002f34] rounded-md overflow-hidden h-14">
              <input 
                type="text" 
                placeholder="Find Cars, Mobile Phones and more..." 
                className="w-full h-full px-4 outline-none" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="bg-[#002f34] h-full px-5 flex items-center justify-center cursor-pointer hover:bg-black transition-all">
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                <span className='text-white p-1 text-[16px] font-bold ml-1'>Search</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="pt-[115px] md:pt-[145px] bg-white">
        <div className="container mx-auto px-5"><CategoryBar /></div>
      </div>
    </>
  );
}

export default Header;