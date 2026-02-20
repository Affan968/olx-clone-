import { Routes, Route } from "react-router";
import Main from "./components/Main";
import SignupModal from "./components/SignupModal";
import LoginModal from "./components/LoginModal";
import { AuthProvider } from "./components/logo/authContext/authcontext.jsx";
import { ProtectedRoute } from "./components/logo/authContext/protectedRoute";
import ItemDetail from "./components/itemDetail.jsx";

import PostAttributes from "./components/Post.jsx"; 
import PostAd from "./components/postadd.jsx";
import CategoryPage from "./components/categoayPage.jsx";
import SearchResults from "./components/search.jsx";
import ChatPage from "./components/ChatPage.jsx";
import MyChats from "./components/myChats.jsx";
import Settings from "./Setting.jsx";
import MyAds from "./components/Myads.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* --- MAIN LAYOUT (Header isi ke andar hai) --- */}
        <Route path="/" element={<Main />}>
          <Route path="login" element={<LoginModal />} />
          <Route path="signup" element={<SignupModal />} />
          <Route path="item/:id" element={<ItemDetail />} />
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="search" element={<SearchResults/>}/>
          
          <Route 
            path="settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          {/* ✅ MY ADS ROUTE: Jahan user ko apne ads ki list dikhegi aur Edit button hoga */}
          <Route 
            path="my-ads" 
            element={
              <ProtectedRoute>
                <MyAds />
              </ProtectedRoute>
            } 
          />

          {/* ✅ MY CHATS ROUTES */}
          <Route 
            path="my-chats" 
            element={
              <ProtectedRoute>
                <MyChats />
              </ProtectedRoute>
            } 
          >
            <Route path="chat/:chatId" element={<ChatPage />} />
          </Route>
        </Route>

        {/* --- POST AD ROUTES --- */}
        <Route 
          path="/post" 
          element={
            <ProtectedRoute>
              <PostAd />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/postad" 
          element={
            <ProtectedRoute>
              <PostAttributes />
            </ProtectedRoute>
          } 
        />

        {/* ✅ EDIT AD ROUTE: Ye same PostAttributes ko open karega lekin ID ke sath */}
        {/* Is se interface wahi rahega jo post karte waqt tha */}
        <Route 
          path="/edit-ad/:id" 
          element={
            <ProtectedRoute>
              <PostAttributes />
            </ProtectedRoute>
          } 
        />

        {/* 404 Page */}
        <Route path="*" element={<div className="pt-40 text-center text-2xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;