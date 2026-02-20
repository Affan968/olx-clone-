import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router'; 
import { AuthContext } from './logo/authContext/authcontext.jsx';
import { db, collection, query, where, onSnapshot, orderBy, doc, updateDoc } from './firebaseconfig/index.jsx';

const MyChats = () => {
  const navigate = useNavigate();
  const { chatId } = useParams(); 
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("timestamp", "desc") 
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Jab chat open ho to unread count zero karne ke liye
  const handleChatClick = async (chat) => {
    navigate(`/my-chats/chat/${chat.id}`, { state: chat });
    
    // Agar last message kisi aur ne bheja tha, to count reset kar do
    if (chat.unreadCount > 0 && chat.lastSenderId !== user.uid) {
      const chatRef = doc(db, "chats", chat.id);
      await updateDoc(chatRef, { unreadCount: 0 });
    }
  };

  return (
// Pehle: h-[calc(100vh-145px)]
// Ab (Header ke saath): h-[calc(100vh-70px)]
<div className="flex h-[calc(100vh-70px)] max-w-[1280px] mx-auto bg-white border border-gray-200 shadow-sm overflow-hidden">      
      {/* --- LEFT SIDE: INBOX LIST --- */}
      <div className="w-[400px] border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#002f34] uppercase tracking-wide">Inbox</h1>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : chats.length === 0 ? (
            <div className="p-10 text-center text-gray-500 italic">No chats found.</div>
          ) : (
            chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`flex items-center p-4 border-b border-gray-100 hover:bg-[#f2f4f5] cursor-pointer border-l-4 ${
                  chatId === chat.id ? "bg-[#f2f4f5] border-l-[#3a77ff]" : "border-l-transparent"
                }`}
              >
                <img src="https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg" className="h-12 w-12 rounded-full mr-3" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-[#002f34] truncate">{chat.sellerName || "OLX User"}</h4>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 uppercase">
                        {chat.timestamp?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      {/* BLUE BADGE: Agar unread messages hain aur aapne nahi bheje */}
                      {chat.unreadCount > 0 && chat.lastSenderId !== user.uid && (
                        <span className="mt-1 bg-[#3a77ff] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[13px] font-bold text-[#002f34] truncate">{chat.productTitle}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {chat.lastSenderId === user.uid ? "You: " : ""}{chat.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- RIGHT SIDE: CHAT AREA (The Red Zone Container) --- */}
      <div className="flex-1 flex flex-col bg-[#f2f4f5] relative">
          {chatId ? (
            <Outlet /> 
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
                <img src="https://www.olx.com.pk/assets/iconNoMessages_noinline.d914d0263309a90940306e00192e6224.svg" className="w-24 mb-4 opacity-50" alt="" />
                <h2 className="text-sm font-bold text-[#002f34]">Select a chat to view conversation</h2>
            </div>
          )}
      </div>
    </div>
  );
};

export default MyChats;