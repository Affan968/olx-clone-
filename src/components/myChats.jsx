import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router'; 
import { AuthContext } from './logo/authContext/authcontext.jsx';
import { db, collection, query, where, onSnapshot, orderBy, doc, updateDoc, getDoc } from './firebaseconfig/index.jsx';

const MyChats = () => {
  const navigate = useNavigate();
  const { chatId } = useParams(); 
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantNames, setParticipantNames] = useState({});

  // Fetch user names
  const fetchUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().displayName || userDoc.data().name || "User";
      }
      return "User";
    } catch (error) {
      console.error("Error fetching user:", error);
      return "User";
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("timestamp", "desc") 
    );
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatData);
      
      // Fetch names for all participants and last senders
      const nameMap = { ...participantNames };
      const promises = [];
      
      for (const chat of chatData) {
        // Fetch other participant's name
        const otherParticipantId = chat.participants?.find(id => id !== user.uid);
        if (otherParticipantId && !nameMap[otherParticipantId]) {
          promises.push(
            fetchUserName(otherParticipantId).then(name => {
              nameMap[otherParticipantId] = name;
            })
          );
        }
        
        // Fetch last sender's name if it's not current user
        if (chat.lastSenderId && chat.lastSenderId !== user.uid && !nameMap[chat.lastSenderId]) {
          promises.push(
            fetchUserName(chat.lastSenderId).then(name => {
              nameMap[chat.lastSenderId] = name;
            })
          );
        }
      }
      
      await Promise.all(promises);
      setParticipantNames(nameMap);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleChatClick = async (chat) => {
    navigate(`/my-chats/chat/${chat.id}`, { state: chat });
    
    if (chat.unreadCount > 0 && chat.lastSenderId !== user.uid) {
      const chatRef = doc(db, "chats", chat.id);
      await updateDoc(chatRef, { unreadCount: 0 });
    }
  };

  // Get the display name for a chat
  const getDisplayName = (chat) => {
    if (!chat.participants || !user) return chat.sellerName || "OLX User";
    
    // Pehle last sender ka name check karo agar wo current user nahi hai
    if (chat.lastSenderId && chat.lastSenderId !== user.uid) {
      return participantNames[chat.lastSenderId] || chat.sellerName || "User";
    }
    
    // Warna doosre participant ka naam do
    const otherParticipantId = chat.participants.find(id => id !== user.uid);
    return participantNames[otherParticipantId] || chat.sellerName || "OLX User";
  };

  // Get sender name for last message preview
  const getLastMessageSender = (chat) => {
    if (chat.lastSenderId === user.uid) {
      return "You";
    }
    return participantNames[chat.lastSenderId] || "";
  };

  return (
    <div className="flex h-[calc(100vh-70px)] max-w-[1280px] mx-auto bg-white border border-gray-200 shadow-sm overflow-hidden">      
      {/* LEFT SIDE: INBOX LIST */}
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
            chats.map((chat) => {
              const displayName = getDisplayName(chat);
              const lastMessageSender = getLastMessageSender(chat);
              
              return (
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
                      <h4 className="font-bold text-sm text-[#002f34] truncate">
                        {displayName}
                      </h4>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 uppercase">
                          {chat.timestamp?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        {chat.unreadCount > 0 && chat.lastSenderId !== user.uid && (
                          <span className="mt-1 bg-[#3a77ff] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[13px] font-bold text-[#002f34] truncate">{chat.productTitle}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {lastMessageSender && (
                        <span className="font-medium">{lastMessageSender}: </span>
                      )}
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDE: CHAT AREA */}
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