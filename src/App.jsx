import { Routes, Route } from "react-router";
import Main from "./components/Main";
import SignupModal from "./components/SignupModal";
import LoginModal from "./components/LoginModal";
import { AuthProvider } from "./components/logo/authContext/authcontext.jsx";
import { ProtectedRoute } from "./components/logo/authContext/protectedRoute";
import ItemDetail from "./components/itemDetail.jsx";

// Dono alag files ko import karein
import PostAttributes from "./components/Post.jsx"; // Ye wo hai jisme Brand, Model, Price wala form hai
import PostAd from "./components/postadd.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="login" element={<LoginModal />} />
          <Route path="signup" element={<SignupModal />} />
          <Route path="item/:id" element={<ItemDetail />} />
        </Route>

        {/* --- PROTECTED ROUTES --- */}
        
        {/* Step 1: Pehle ye khulega (Category Selection) */}
        <Route 
          path="/post" 
          element={
            <ProtectedRoute>
              <PostAd />  {/* <--- Yahan PostAd hona chahiye (Icons wali file) */}
            </ProtectedRoute>
          } 
        />
        
        {/* Step 2: Category select hone ke baad ye khulega (Form Details) */}
        <Route 
          path="/postad" 
          element={
            <ProtectedRoute>
              <PostAttributes /> {/* <--- Yahan Details wala form */}
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;