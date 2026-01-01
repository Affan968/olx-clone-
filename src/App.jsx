import { Routes,Route } from "react-router";
import Main from "./components/Main";
import PostAd from "./components/postadd";
import PostAttributes from "./components/Post";
function App() {
  
  return(
<Routes>
  <Route path='/home' element={<Main/>}/>
  <Route path="post" element={<PostAd/>}/>
  <Route path="postad" element={<PostAttributes/>}/>
</Routes>
  )
}

export default App;