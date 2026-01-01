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
import {collection,db,addDoc} from './firebaseconfig/index.jsx'

export default function PostAttributes() {
  const { CategoriesImage } = useContext(CateogaryContext);
  const fileInputRef = useRef(null);

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

    // Limit to 20 images
    if (formData.images.length + files.length > 20) {
      alert("You can only upload up to 20 photos");
      return;
    }

    const newImageObjects = files.map(file => ({
      url: URL.createObjectURL(file), // Preview ke liye temporary URL
      file: file // Backend pe bhejne ke liye asal file
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

  // --- 4. FORM SUBMISSION ---
  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
    const docRef = await addDoc(collection(db, "olxUseradd"), {
      adPrice:formData.price,
      adImages: formData.images,
      adTitle: formData.title,
      adDescription:formData.description,
      adCateoary:formData.category,
      adbrand:formData.brand,
      adLocation:formData.location
    });
    console.log("Document written with ID: ", docRef.id);
    alert("your data has been save in local storage")
  }
  catch(err){
    console.error("failed to reload operation",err.message);
    
  }
  
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
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
          {/* MAIN FORM CONTAINER */}
          <div className="flex-1 border border-gray-300 rounded overflow-hidden shadow-sm">

            {/* SECTION 1: CATEGORY DISPLAY */}
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

            {/* SECTION 2: DYNAMIC IMAGE UPLOAD GRID */}
            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Upload up to 20 photos</h2>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-4">
                {/* Upload Plus Button */}
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-square border-2 border-dashed border-[#3A77FF] rounded flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-all"
                >
                  <PlusIcon className="h-6 w-6 text-[#3A77FF]" />
                </div>

                {/* Selected Images Preview */}
                {formData.images.map((img, index) => (
                  <div key={index} className="aspect-square border border-gray-300 rounded relative overflow-hidden bg-gray-50 group">
                    <img src={img.url} className="w-full h-full object-cover" alt="preview" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-md hover:bg-red-50"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 w-full bg-[#002f34] text-white text-[9px] text-center py-0.5 font-bold">
                        COVER PHOTO
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty Placeholder Boxes */}
                {[...Array(Math.max(0, 13 - formData.images.length))].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square border border-gray-200 rounded flex items-center justify-center bg-white">
                    <CameraIcon className="h-6 w-6 text-gray-200" />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 font-medium">For the cover picture we recommend using the landscape mode.</p>
            </div>

            {/* SECTION 3: CORE DETAILS */}
            <div className="p-6 border-b border-gray-300 space-y-6">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Include some details</h2>

              {/* Brand */}
              <div>
                <label className="block text-sm text-[#002F34] mb-2 font-bold">Brand *</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    type="text"
                    placeholder="Select brand"
                    className="w-full border border-gray-300 rounded p-3 pl-10 focus:ring-1 focus:ring-cyan-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm text-[#002F34] mb-3 font-bold">Condition *</label>
                <div className="flex gap-3">
                  {['New', 'Used'].map(cond => (
                    <button
                      key={cond}
                      onClick={() => setFormData({ ...formData, condition: cond })}
                      className={`px-5 py-2 border rounded-full text-sm font-medium transition-all ${formData.condition === cond ? 'border-cyan-500 bg-cyan-50 text-cyan-700 ring-1 ring-cyan-500' : 'border-gray-300 text-gray-600'}`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ad Title */}
              <div>
                <label className="block text-sm text-[#002F34] mb-2 font-bold">Ad title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  className="w-full border border-gray-300 rounded p-3 outline-none text-sm focus:border-cyan-500"
                />
                <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                  <p>Mention the key features of your item</p>
                  <span>{formData.title.length} / 70</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-[#002F34] mb-2 font-bold">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full border border-gray-300 rounded p-3 outline-none resize-none text-sm focus:border-cyan-500"
                ></textarea>
                <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                  <p>Include condition, features and reason for selling</p>
                  <span>{formData.description.length} / 4096</span>
                </div>
              </div>
            </div>

            {/* SECTION 4: PRICE */}
            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Set a price</h2>
              <label className="block text-sm text-[#002F34] mb-2 font-bold">Price *</label>
              <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs focus-within:border-cyan-500">
                <span className="bg-gray-100 px-4 py-3 border-r border-gray-300 text-sm text-gray-600 font-bold">Rs</span>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  className="w-full p-3 outline-none text-sm"
                />
              </div>
            </div>

            {/* SECTION 5: LOCATION */}
            <div className="p-6 border-b border-gray-300">
              <h2 className="text-sm font-bold text-[#002F34] uppercase mb-4">Confirm your location</h2>
              <div className="relative">
                <MapPinIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-3 pl-10 outline-none text-sm appearance-none bg-white focus:border-cyan-500"
                >
                  <option value="">Select Location</option>
                  <option value="Karachi, Sindh">Karachi, Sindh</option>
                  <option value="Lahore, Punjab">Lahore, Punjab</option>
                  <option value="Islamabad, ICT">Islamabad, ICT</option>
                </select>
              </div>
            </div>

            {/* FOOTER BUTTON */}
            <div className="p-6 bg-gray-50">
              <button
                onClick={handleSubmit}
                className="bg-[#002f34] text-white font-bold py-4 px-12 rounded hover:bg-[#003f45] transition-all shadow-md active:scale-95"
              >
                Post now
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: HELP BOX */}
          <div className="hidden lg:block w-[300px] bg-white border border-gray-200 rounded p-5 sticky top-24 shadow-sm">
            <h4 className="font-bold text-[#002F34] text-sm mb-4 uppercase">Helpful Tips</h4>
            <ul className="space-y-4 text-[12px] text-[#3A77FF] font-semibold leading-snug">
              <li className="flex gap-2 cursor-pointer hover:underline"><span className="text-black">•</span> Use clear photos of the item</li>
              <li className="flex gap-2 cursor-pointer hover:underline"><span className="text-black">•</span> Be honest about item condition</li>
              <li className="flex gap-2 cursor-pointer hover:underline"><span className="text-black">•</span> Set a reasonable price</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}