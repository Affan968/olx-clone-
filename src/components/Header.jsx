import React, { useContext, useState, useEffect, useRef } from 'react'; 
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router'; 
import CategoryBar from './CategoryBar';
import locationmap from './logo/locationmap.svg';
import { AuthContext } from './logo/authContext/authcontext.jsx';
import { auth } from './firebaseconfig/index.jsx';
import { signOut } from "firebase/auth"; 

function Header() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close dropdown
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
        
        {/* Blue Top Bar */}
        <div className="bg-[#EBF1FF] relative z-[41]">
          <div className="container mx-auto px-4 h-19 flex items-center justify-between">
            
            <div className="flex items-center space-x-6">
              <Link to="/">
                <div className='border-1 border-white px-4 py-5 mt-2 rounded-[20px] rounded-b-none bg-white flex items-center shadow-sm text-[#002f34]'>
                  <svg className="h-7" fill="currentColor" viewBox="0 0 36.289 20.768">
                    <path d="M18.9 20.77V0h4.93v20.77zM0 10.39a8.56 8.56 0 1 1 8.56 8.56A8.56 8.56 0 0 1 0 10.4zm5.97-.01a2.6 2.6 0 1 0 2.6-2.6 2.6 2.6 0 0 0-2.6 2.6zm27 5.2l-1.88-1.87-1.87 1.88H25.9V12.3l1.9-1.9-1.9-1.89V5.18h3.27l1.92 1.92 1.93-1.92h3.27v3.33l-1.9 1.9 1.9 1.9v3.27z"></path>
                  </svg>
                </div>
              </Link>
              <nav className="hidden sm:flex items-center space-x-9 text-gray-700 font-semibold ml-4">
                 <div className="flex items-center space-x-1 cursor-pointer"><img className="h-6" src="https://www.olx.com.pk/assets/iconMotors.6bf280165e43e55b173d0a53551e2bfb.png" alt="" /><span className='text-[16px] font-bold '>Motors</span></div>
                 <div className="flex items-center space-x-1 cursor-pointer"><img className="h-6" src="https://www.olx.com.pk/assets/iconProperty.d09c6d2e3621f900c17c9e8330a1a37b.png" alt="" /><span className='text-[16px] font-bold '>Property</span></div>
              </nav>
            </div>

            <div className="flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-3 relative gap-3">
                  
                  {/* 1. Chat Icon */}
                  <img src="https://www.olx.com.pk/assets/iconChat_noinline.31f5df4a6a21fc770ed6863958662677.svg" className="h-6 w-6 cursor-pointer" alt="Chat" />
                  
                  {/* 2. Notification (Bell) Icon */}
                  <img src="https://www.olx.com.pk/assets/iconNotifications_noinline.4444f6b42acbe30d772d80ef1225f574.svg" className="h-6 w-6 cursor-pointer" alt="Notifications" />
                  
                  {/* 3. --- TROLLEY (Bell ke baad, Profile se pehle) --- */}
                  <Link to="/cart" className="p-1 hover:bg-gray-100 rounded-full transition-all text-[#002f34]" aria-label="cart">
                    <svg width="24px" height="24px" fill="none" viewBox="2 2 20 20">
                      <path fill="currentColor" d="M18.11 14.92H9.6a2.54 2.54 0 0 1-1.58-.55 2.4 2.4 0 0 1-.87-1.4L5.47 4.87H2.83a.84.84 0 0 1-.59-.24.8.8 0 0 1-.24-.57.8.8 0 0 1 .24-.56.84.84 0 0 1 .6-.24h3.31a.85.85 0 0 1 .54.18.8.8 0 0 1 .3.46l1.79 8.77a.8.8 0 0 0 .3.47c.15.12.34.18.53.18h8.5a.85.85 0 0 0 .53-.18.8.8 0 0 0 .3-.46l1.34-6.03a.78.78 0 0 0-.17-.68.85.85 0 0 0-.66-.3h-8.31a.84.84 0 0 1-.59-.23.8.8 0 0 1-.24-.57.8.8 0 0 1 .24-.57.84.84 0 0 1 .59-.23h8.31a2.56 2.56 0 0 1 1.1.21c.34.16.64.38.88.66a2.34 2.34 0 0 1 .51 2.05l-1.35 6.04a2.4 2.4 0 0 1-.89 1.38 2.55 2.55 0 0 1-1.59.52zm-8.2 5.83a2.08 2.08 0 1 1 0-4.17 2.08 2.08 0 0 1 0 4.17zm7.5 0a2.08 2.08 0 1 1 0-4.17 2.08 2.08 0 0 1 0 4.17z"></path>
                    </svg>
                  </Link>

                  {/* 4. Profile Section */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center cursor-pointer space-x-1" onClick={() => setShowDropdown(!showDropdown)}>
                      <img src={user.photoURL || "https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg"} className="h-9 w-9 rounded-full border border-gray-200" alt="User" />
                      <svg className={`h-5 w-5 text-[#002f34] transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    {showDropdown && (
                      <div className="absolute right-0 top-[115%] w-80 bg-white rounded-md shadow-xl border border-gray-200 z-50 overflow-hidden">
                        {/* Profile Header */}
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-start space-x-3">
                            <img 
                              src={user.photoURL || "https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg"} 
                              className="h-14 w-14 rounded-full border border-gray-200" 
                              alt="" 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-500">Hello,</p>
                              <h3 className="font-bold text-[#002f34] text-lg truncate">{user.displayName || "User"}</h3>
                              <p className="text-xs text-gray-500 mt-1 truncate">{user.email || ""}</p>
                            </div>
                          </div>
                          <Link 
                            to="/profile" 
                            className="inline-block mt-3 text-[#002f34] text-sm font-bold hover:underline"
                            onClick={() => setShowDropdown(false)}
                          >
                            View Public Profile
                          </Link>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link 
                            to="/my-ads" 
                            className="flex items-center px-4 py-3 hover:bg-gray-50 text-[#002f34] text-sm"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg width="24" height="24" fill="none" className="mr-3">
                              <path fill="#002F34" fillRule="evenodd" d="m3 4 1-1h8l1 1.001V7l-1.001.999-1-.999V5H5v14h5.999v-2L12 16.001 13 17v3l-1 1H4l-1-1V4zm14.762 7.044-1.816-2.445.208-1.4 1.398.208L21 12.05l-3.453 4.556-1.402.193-.192-1.401 1.784-2.355H12l-1-1 1-1h5.762z" clipRule="evenodd"></path>
                            </svg>
                            <span className="font-medium">My Ads</span>
                          </Link>
                          
                          <Link 
                            to="/favorites" 
                            className="flex items-center px-4 py-3 hover:bg-gray-50 text-[#002f34] text-sm"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg width="24" height="24" fill="none" className="mr-3">
                              <path fill="#002F34" fillRule="evenodd" d="M12 20a8 8 0 0 1 0-16 8 8 0 0 1 0 16Zm0-18a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a3 3 0 0 0-3 3h2a1 1 0 1 1 1 1l-1 1v2h2v-1.17A3 3 0 0 0 12 7Zm-1 9a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" clipRule="evenodd"></path>
                            </svg>
                            <span className="font-medium">Favourites</span>
                          </Link>
                          
                          <Link 
                            to="/orders" 
                            className="flex items-center px-4 py-3 hover:bg-gray-50 text-[#002f34] text-sm"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg width="24" height="24" fill="none" className="mr-3">
                              <path fill="currentColor" d="M16.2 8.63H7.8v1.68h8.4V8.63zM14.52 12H7.8v1.67h6.73V12z"></path>
                            </svg>
                            <span className="font-medium">My Orders</span>
                          </Link>
                          
                          <Link 
                            to="/payments" 
                            className="flex items-center px-4 py-3 hover:bg-gray-50 text-[#002f34] text-sm"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg width="24" height="24" fill="none" className="mr-3">
                              <path d="M15.581 2.5H4.42c-1.06 0-1.919.858-1.919 1.919V15.58c0 1.06.858 1.919 1.919 1.919H15.58c1.06 0 1.919-.858 1.919-1.919V4.42c0-1.06-.858-1.919-1.919-1.919ZM3.547 4.419c0-.482.39-.872.872-.872H15.58c.482 0 .872.39.872.872v.872H3.547v-.872ZM16.453 15.58c0 .482-.39.872-.872.872H4.42a.872.872 0 0 1-.872-.872V6.337h12.906v9.244ZM5.291 8.605c0-.286.237-.524.523-.524h2.79c.287 0 .524.238.524.524a.527.527 0 0 1-.523.523H5.814a.527.527 0 0 1-.523-.523Zm0 2.79c0-.286.237-.523.523-.523h8.372c.286 0 .523.237.523.523a.527.527 0 0 1-.523.524H5.814a.527.527 0 0 1-.523-.524Zm0 2.791c0-.286.237-.523.523-.523h8.372c.286 0 .523.237.523.523a.527.527 0 0 1-.523.523H5.814a.527.527 0 0 1-.523-.523Z" strokeLinejoin="bevel" strokeWidth="0.3" stroke="currentColor"></path>
                            </svg>
                            <span className="font-medium">Payment Options</span>
                          </Link>
                          
                          <Link 
                            to="/addresses" 
                            className="flex items-center px-4 py-3 hover:bg-gray-50 text-[#002f34] text-sm"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg width="24" height="24" fill="none" className="mr-3">
                              <path fill="#002F34" d="M11 7a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
                              <path fill="#002F34" fillRule="evenodd" d="M8.365 4.18c1.817-2.424 5.453-2.424 7.27 0a4.544 4.544 0 0 1 .62 4.322l-3.319 8.849h-1.872L7.745 8.5a4.544 4.544 0 0 1 .62-4.321zm5.67 1.2A2.544 2.544 0 0 0 9.618 7.8L12 14.152 14.382 7.8a2.544 2.544 0 0 0-.347-2.42z" clipRule="evenodd"></path>
                              <path fill="#002F34" d="M3 17c0-.222.132-.581.706-1.03.564-.442 1.437-.869 2.582-1.213l-.576-1.915c-1.284.385-2.411.904-3.24 1.553C1.655 15.036 1 15.913 1 17c0 .916.468 1.687 1.099 2.283.628.595 1.484 1.084 2.459 1.473C6.512 21.538 9.144 22 12 22s5.488-.462 7.442-1.244c.975-.39 1.83-.878 2.46-1.473C22.531 18.687 23 17.916 23 17c0-1.087-.654-1.964-1.473-2.605-.828-.649-1.955-1.168-3.24-1.553l-.575 1.915c1.145.344 2.018.77 2.582 1.213.574.449.706.808.706 1.03 0 .188-.091.47-.473.83-.384.363-.992.736-1.827 1.07-1.665.665-4.033 1.1-6.7 1.1s-5.035-.435-6.7-1.1c-.835-.334-1.443-.707-1.827-1.07C3.092 17.47 3 17.188 3 17z"></path>
                            </svg>
                            <span className="font-medium">Addresses</span>
                          </Link>
                          
                          <Link 
                            to="/settings" 
                            className="flex items-center px-4 py-3 hover:bg-gray-50 text-[#002f34] text-sm border-b border-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg width="24" height="24" fill="none" className="mr-3">
                              <path fill="currentColor" d="M12 8.666a3.334 3.334 0 1 0 0 6.668 3.334 3.334 0 0 0 0-6.668zm0 5.001a1.667 1.667 0 1 1 0-3.334 1.667 1.667 0 0 1 0 3.334z"></path>
                              <path fill="currentColor" d="m19.75 13.584-.37-.213a7.587 7.587 0 0 0 0-2.743l.37-.213a2.502 2.502 0 0 0-2.501-4.335l-.371.214a7.484 7.484 0 0 0-2.375-1.369v-.427a2.5 2.5 0 0 0-5.002 0v.427a7.483 7.483 0 0 0-2.374 1.373l-.372-.216a2.502 2.502 0 0 0-2.501 4.334l.37.214a7.586 7.586 0 0 0 0 2.742l-.37.214a2.502 2.502 0 0 0 2.5 4.334l.372-.214A7.484 7.484 0 0 0 9.5 19.075v.428a2.5 2.5 0 0 0 5.002 0v-.428a7.482 7.482 0 0 0 2.374-1.372l.373.215a2.503 2.503 0 0 0 2.5-4.335v.001zm-2.124-3.148a5.875 5.875 0 0 1 0 3.126.833.833 0 0 0 .386.945l.904.522a.834.834 0 1 1-.834 1.444l-.905-.523a.834.834 0 0 0-1.013.137 5.822 5.822 0 0 1-2.703 1.563.834.834 0 0 0-.626.808v1.045a.834.834 0 0 1-1.667 0v-1.044a.834.834 0 0 0-.626-.808 5.822 5.822 0 0 1-2.703-1.566.834.834 0 0 0-1.013-.138l-.903.523a.833.833 0 1 1-.834-1.444l.904-.522a.834.834 0 0 0 .387-.944 5.875 5.875 0 0 1 0-3.126.833.833 0 0 0-.388-.941l-.904-.522a.834.834 0 1 1 .834-1.445l.905.524a.834.834 0 0 0 1.012-.134 5.822 5.822 0 0 1 2.704-1.563.834.834 0 0 0 .626-.811V4.498a.833.833 0 1 1 1.667 0V5.54a.834.834 0 0 0 .626.808 5.821 5.821 0 0 1 2.703 1.567.834.834 0 0 0 1.013.137l.904-.523a.833.833 0 1 1 .833 1.444l-.903.522a.834.834 0 0 0-.386.941z"></path>
                            </svg>
                            <span className="font-medium">Settings</span>
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-bold border-t border-gray-100"
                          >
                            <svg width="24" height="24" fill="none" className="mr-3">
                              <path fill="currentColor" d="M16 9v4h5v2h-5v4l-5-5 5-5zm-4 7h-3v-2h3v2zm0-4h-3V9h3v2z"></path>
                              <path fill="currentColor" d="M4 5h10v2H4v10h10v2H4z"></path>
                            </svg>
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

              {/* Aap ka original Sell Button */}
              <button onClick={() => user ? navigate('/post') : navigate('/login')} className="relative inline-flex items-center px-5 py-2 font-bold text-black bg-white rounded-full border-t-[6px] border-t-[#23E5DB] border-l-[5px] border-l-[#FFCE32] border-r-[5px] border-r-[#3A77FF] border-b-[5px] border-b-[#3A77FF] shadow-sm cursor-pointer">
                <PlusIcon className="h-5 w-5 mr-1 stroke-[3px]" />
                <span className="tracking-wider uppercase">Sell</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bars Section */}
        <div className="bg-white py-3 border-b border-gray-200 relative z-[40]">
          <div className="container mx-auto px-4 flex items-center space-x-4">
            <div className="relative w-1/4 flex border-2 border-[#002f34] rounded-md overflow-hidden h-14 bg-white items-center px-2">
              <img src={locationmap} className="h-6 w-6" alt="" />
              <select className="w-full h-full outline-none bg-transparent ml-2 text-[16px]"><option>Pakistan</option></select>
            </div>
            <div className="flex-grow flex items-center border-2 border-[#002f34] rounded-md overflow-hidden h-14">
              <input type="text" placeholder="Find Cars, Mobile Phones and more..." className="w-full h-full px-4 outline-none" />
              <div className="bg-[#002f34] h-full px-5 flex items-center justify-center cursor-pointer hover:bg-black transition-all">
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                <span className='text-white p-1 text-[16px] font-bold ml-1'>Search</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[145px] bg-white">
        <div className="container mx-auto px-5"><CategoryBar /></div>
      </div>
    </>
  );
}

export default Header;