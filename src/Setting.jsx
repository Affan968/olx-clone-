import React, { useState, useContext, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { AuthContext } from './components/logo/authContext/authcontext.jsx';
import { auth, db, doc, setDoc } from './components/firebaseconfig/index.jsx';

function Settings() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // Load existing name
  useEffect(() => {
    if (user) setName(user.displayName || "");
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) return alert("Please enter a name");
    
    setSaving(true);
    try {
      // 1. Auth Profile Update
      await updateProfile(auth.currentUser, { displayName: name });

      // 2. Firestore Update (Taaki chat mein fetch ho sake)
      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        uid: user.uid,
        email: user.email,
        updatedAt: new Date()
      }, { merge: true });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-48 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-[#002f34] mb-6">Edit Profile</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-md focus:border-[#002f34] outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#002f34] text-white px-8 py-3 rounded-md font-bold hover:bg-[#003d44] disabled:bg-gray-400 transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;