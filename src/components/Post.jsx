import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  ChevronLeftIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate, useParams } from 'react-router'; 
import { CateogaryContext } from './context';
import { collection, db, addDoc, auth, doc, getDoc, updateDoc } from './firebaseconfig/index.jsx'

export default function PostAttributes() {
  const { id } = useParams(); // URL se ID pakre ga
  const { CategoriesImage } = useContext(CateogaryContext);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: CategoriesImage?.name || "",
    images: [], 
    brand: "",
    model: "",      
    ptaStatus: "",  
    condition: "",
    title: "",
    description: "",
    price: "",
    location: "",
    sellerName: "", 
    phone: ""       
  });

  // Mobile category check karne ke liye logic (Safe for Edit mode)
  const isMobileCategory = (CategoriesImage?.name?.toUpperCase() === "MOBILES") || (formData.category?.toUpperCase() === "MOBILES");

  // --- EDIT LOGIC: Purana data fetch karna ---
  useEffect(() => {
    if (id) {
      const getAdData = async () => {
        try {
          const docRef = doc(db, "olxUseradd", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              category: data.adCategory || "",
              brand: data.adBrand || "",
              model: data.adModel || "",
              ptaStatus: data.adPtaStatus || "",
              condition: data.adCondition || "",
              title: data.adTitle || "",
              description: data.adDescription || "",
              price: data.adPrice || "",
              location: data.adLocation || "",
              sellerName: data.sellerName || "",
              phone: data.adPhone || "",
              // Purani images ko isOld flag ke sath set karna
              images: data.adImages?.map(url => ({ url, file: null, isOld: true })) || []
            });
          }
        } catch (err) {
          console.error("Fetch Error:", err);
        }
      };
      getAdData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 20) {
      alert("You can only upload up to 20 photos");
      return;
    }
    const newImageObjects = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      isOld: false 
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageObjects]
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadToCloudinary = async (imageFile) => {
    const cloudName = "dwwwdxicz"; 
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "olx_appads");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: data
    });
    if (!response.ok) throw new Error("Cloudinary Upload Failed");
    const resData = await response.json();
    return resData.secure_url; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }
    if (formData.images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setLoading(true);
    try {
      // Images handling logic
      const imageUrls = await Promise.all(
        formData.images.map(async (img) => {
          if (img.isOld) return img.url; 
          return await uploadToCloudinary(img.file); 
        })
      );

      const cleanData = {
        userId: auth.currentUser.uid,
        adPrice: formData.price,
        adImages: imageUrls, 
        adTitle: formData.title,
        adDescription: formData.description,
        adCategory: formData.category,
        adBrand: formData.brand,
        adModel: formData.model,      
        adCondition: formData.condition,
        adPtaStatus: formData.ptaStatus,
        adLocation: formData.location,
        sellerName: formData.sellerName, 
        adPhone: formData.phone,      
        updatedAt: new Date()
      };

      if (id) {
        // UPDATE LOGIC
        await updateDoc(doc(db, "olxUseradd", id), cleanData);
      } else {
        // NEW POST LOGIC
        cleanData.createdAt = new Date();
        await addDoc(collection(db, "olxUseradd"), cleanData);
      }
      
      navigate("/my-ads"); 

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-[#F7F8F8] border-b border-gray-200 py-3 px-4 flex items-center sticky top-0 z-50">
        <Link to={id ? "/my-ads" : "/post"} className="flex items-center text-[#002F34]">
          <ChevronLeftIcon className="h-6 w-6 mr-2" />
          <svg className="h-7" fill="currentColor" viewBox="0 0 36.289 20.768">
            <path d="M18.9 20.77V0h4.93v20.77zM0 10.39a8.56 8.56 0 1 1 8.56 8.56A8.56 8.56 0 0 1 0 10.4zm5.97-.01a2.6 2.6 0 1 0 2.6-2.6 2.6 2.6 0 0 0-2.6 2.6zm27 5.2l-1.88-1.87-1.87 1.88H25.9V12.3l1.9-1.9-1.9-1.89V5.18h3.27l1.92 1.92 1.93-1.92h3.27v3.33l-1.9 1.9 1.9 1.9v3.27z"></path>
          </svg>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#002F34] text-center mb-8 uppercase tracking-tight">
          {id ? "Edit Your Ad" : "Post Your Ad"}
        </h1>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 border border-gray-300 rounded overflow-hidden shadow-sm">
            
            {/* Category (Hidden in Edit mode) */}
            {!id && (
              <div className="p-6 border-b border-gray-300">
                <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4 tracking-wide">Selected Category</h2>
                <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center gap-4">
                    <img src={CategoriesImage?.icon} className="h-10 w-10 object-contain" alt="cat" />
                    <p className="font-bold text-[#002F34] text-sm uppercase">{CategoriesImage?.name}</p>
                  </div>
                  <Link to="/post" className="text-[#3A77FF] font-bold underline text-xs">Change</Link>
                </div>
              </div>
            )}

            {/* Photos Section */}
            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Upload up to 20 photos</h2>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-4">
                <div onClick={() => fileInputRef.current.click()} className="aspect-square border-2 border-dashed border-[#3A77FF] rounded flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-all">
                  <PlusIcon className="h-6 w-6 text-[#3A77FF]" />
                </div>
                {formData.images.map((img, index) => (
                  <div key={index} className="aspect-square border border-gray-300 rounded relative overflow-hidden bg-gray-50 group">
                    <img src={img.url} className="w-full h-full object-cover" alt="preview" />
                    <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-md hover:bg-red-50">
                      <XMarkIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    {index === 0 && <div className="absolute bottom-0 w-full bg-[#002f34] text-white text-[9px] text-center py-0.5 font-bold">COVER PHOTO</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Details */}
            <div className="p-6 border-b border-gray-300 space-y-6">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Include some details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#002F34] mb-2 font-bold">Brand *</label>
                  <input name="brand" value={formData.brand || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-3 outline-none text-sm focus:border-cyan-500" />
                </div>

                {isMobileCategory && (
                  <>
                    <div>
                      <label className="block text-sm text-[#002F34] mb-2 font-bold">Model *</label>
                      <input name="model" value={formData.model} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-3 outline-none text-sm focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-[#002F34] mb-2 font-bold">PTA Status *</label>
                      <input name="ptaStatus" value={formData.ptaStatus} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-3 outline-none text-sm focus:border-cyan-500" />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm text-[#002F34] mb-3 font-bold">Condition *</label>
                  <div className="flex gap-3">
                    {['New', 'Used'].map(cond => (
                      <button key={cond} type="button" onClick={() => setFormData({ ...formData, condition: cond })} className={`px-5 py-2 border rounded-full text-sm font-medium transition-all ${formData.condition === cond ? 'border-cyan-500 bg-cyan-50 text-cyan-700 ring-1 ring-cyan-500' : 'border-gray-300 text-gray-600'}`}>
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#002F34] mb-2 font-bold">Ad title *</label>
                <input name="title" value={formData.title|| ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-3 outline-none text-sm focus:border-cyan-500" />
              </div>

              <div>
                <label className="block text-sm text-[#002F34] mb-2 font-bold">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full border border-gray-300 rounded p-3 outline-none resize-none text-sm focus:border-cyan-500"></textarea>
              </div>
            </div>

            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Set a price</h2>
              <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs focus-within:border-cyan-500">
                <span className="bg-gray-100 px-4 py-3 border-r border-gray-300 text-sm text-gray-600 font-bold">Rs</span>
                <input name="price" value={formData.price || ""} onChange={handleChange} type="number" className="w-full p-3 outline-none text-sm" />
              </div>
            </div>

            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Review your details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#002F34] mb-2 font-bold">Name *</label>
                  <input name="sellerName" value={formData.sellerName} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-3 max-w-sm outline-none text-sm focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm text-[#002F34] mb-2 font-bold">Phone number *</label>
                  <input name="phone" value={formData.phone || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-3 max-w-sm outline-none text-sm focus:border-cyan-500" />
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Confirm your location</h2>
              <select name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 outline-none text-sm bg-white focus:border-cyan-500">
                <option value="">Select Location</option>
                <option value="Karachi, Sindh">Karachi, Sindh</option>
                <option value="Lahore, Punjab">Lahore, Punjab</option>
                <option value="Islamabad, ICT">Islamabad, ICT</option>
              </select>
            </div>

            <div className="p-6 bg-gray-50">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`${loading ? 'bg-gray-400' : 'bg-[#002f34]'} text-white font-bold py-4 px-12 rounded hover:bg-[#003f45] transition-all shadow-md active:scale-95 uppercase`}
              >
                {loading ? "Processing..." : id ? "Update now" : "Post now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}