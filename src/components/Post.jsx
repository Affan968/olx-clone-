import { useContext, useState, useRef } from 'react';
import {
  ChevronLeftIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MapPinIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router';
import { CateogaryContext } from './context';
import { collection, db, addDoc } from './firebaseconfig/index.jsx'

export default function PostAttributes() {
  const { CategoriesImage } = useContext(CateogaryContext);
  const fileInputRef = useRef(null);

  // --- LOADING STATE (Jo error aa raha tha uske liye) ---
  const [loading, setLoading] = useState(false);

  // --- 1. SINGLE STATE OBJECT FOR ALL DATA ---
  const [formData, setFormData] = useState({
    category: CategoriesImage?.name || "",
    images: [], // Ismein images ke objects (url aur file) honge
    brand: "",
    condition: "",
    title: "",
    description: "",
    price: "",
    location: ""
  });

  // --- 2. HANDLER FOR TEXT & SELECT INPUTS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 3. IMAGE UPLOAD LOGIC ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 20) {
      alert("You can only upload up to 20 photos");
      return;
    }

    const newImageObjects = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
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

  // --- CLOUDINARY UPLOAD FUNCTION ---
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

  // --- 4. FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setLoading(true);

    try {
      // 1. Cloudinary par images bhej kar Link lena
      const uploadPromises = formData.images.map(img => uploadToCloudinary(img.file));
      const imageUrls = await Promise.all(uploadPromises);

      // 2. FIREBASE CLEAN DATA
      const cleanData = {
        adPrice: formData.price,
        adImages: imageUrls, 
        adTitle: formData.title,
        adDescription: formData.description,
        adCategory: formData.category,
        adBrand: formData.brand,
        adCondition: formData.condition,
        adLocation: formData.location,
        createdAt: new Date()
      };

      // 3. Firebase mein save karna
      const docRef = await addDoc(collection(db, "olxUseradd"), cleanData);

      alert("Mubarak ho! Ad post ho gaya.");
      setFormData({ ...formData, images: [], title: "", description: "", price: "" });

    } catch (err) {
      console.error("Error Detail:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-[#F7F8F8] border-b border-gray-200 py-3 px-4 flex items-center sticky top-0 z-50">
        <Link to="/post" className="flex items-center text-[#002F34]">
          <ChevronLeftIcon className="h-6 w-6 mr-2" />
          <svg className="h-7" fill="currentColor" viewBox="0 0 36.289 20.768">
            <path d="M18.9 20.77V0h4.93v20.77zM0 10.39a8.56 8.56 0 1 1 8.56 8.56A8.56 8.56 0 0 1 0 10.4zm5.97-.01a2.6 2.6 0 1 0 2.6-2.6 2.6 2.6 0 0 0-2.6 2.6zm27 5.2l-1.88-1.87-1.87 1.88H25.9V12.3l1.9-1.9-1.9-1.89V5.18h3.27l1.92 1.92 1.93-1.92h3.27v3.33l-1.9 1.9 1.9 1.9v3.27z"></path>
          </svg>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#002F34] text-center mb-8 uppercase tracking-tight">Post Your Ad</h1>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 border border-gray-300 rounded overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4 tracking-wide">Selected Category</h2>
              <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                <div className="flex items-center gap-4">
                  <img src={CategoriesImage?.icon} className="h-10 w-10 object-contain" alt="cat" />
                  <div>
                    <p className="font-bold text-[#002F34] text-sm uppercase">{CategoriesImage?.name}</p>
                    <p className="text-[11px] text-gray-500">Mobiles / Mobile Phones</p>
                  </div>
                </div>
                <Link to="/post" className="text-[#3A77FF] font-bold underline text-xs">Change</Link>
              </div>
            </div>

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
                {[...Array(Math.max(0, 13 - formData.images.length))].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square border border-gray-200 rounded flex items-center justify-center bg-white">
                    <CameraIcon className="h-6 w-6 text-gray-200" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-b border-gray-300 space-y-6">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Include some details</h2>
              <div>
                <label className="block text-sm text-[#002F34] mb-2 font-bold">Brand *</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input name="brand" value={formData.brand} onChange={handleChange} type="text" placeholder="Select brand" className="w-full border border-gray-300 rounded p-3 pl-10 focus:ring-1 focus:ring-cyan-500 outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#002F34] mb-3 font-bold">Condition *</label>
                <div className="flex gap-3">
                  {['New', 'Used'].map(cond => (
                    <button key={cond} onClick={() => setFormData({ ...formData, condition: cond })} className={`px-5 py-2 border rounded-full text-sm font-medium transition-all ${formData.condition === cond ? 'border-cyan-500 bg-cyan-50 text-cyan-700 ring-1 ring-cyan-500' : 'border-gray-300 text-gray-600'}`}>
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#002F34] mb-2 font-bold">Ad title *</label>
                <input name="title" value={formData.title} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-3 outline-none text-sm focus:border-cyan-500" />
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
                <input name="price" value={formData.price} onChange={handleChange} type="number" className="w-full p-3 outline-none text-sm" />
              </div>
            </div>

            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Confirm your location</h2>
              <select name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 pl-10 outline-none text-sm appearance-none bg-white focus:border-cyan-500">
                <option value="">Select Location</option>
                <option value="Karachi, Sindh">Karachi, Sindh</option>
                <option value="Lahore, Punjab">Lahore, Punjab</option>
                <option value="Islamabad, ICT">Islamabad, ICT</option>
              </select>
            </div>

            <div className="p-6 bg-gray-50">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${loading ? 'bg-gray-400' : 'bg-[#002f34]'} text-white font-bold py-4 px-12 rounded hover:bg-[#003f45] transition-all shadow-md active:scale-95`}
              >
                {loading ? "Posting..." : "Post now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}