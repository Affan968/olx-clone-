import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { 
  db, 
  auth, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  serverTimestamp, 
  addDoc, 
  updateDoc, 
  increment,
  getDoc
} from './firebaseconfig/index.jsx'; 

// Fallback Image URL
const NO_IMAGE_URL = "https://www.olx.com.pk/assets/noPhoto_noinline.2996960d70364f8c679a8117730e2343.svg";

function ChatPage() {
  const { chatId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderNames, setSenderNames] = useState({});
  const [chatData, setChatData] = useState(null);
  const [otherParticipantName, setOtherParticipantName] = useState(state?.sellerName || "Loading...");
  
  const [adInfo, setAdInfo] = useState({
    title: state?.productTitle || "Loading...",
    price: state?.productPrice || "",
    image: state?.productImage || "",
    id: state?.productId || "",
    seller: state?.sellerName || "User"
  });

  const scrollRef = useRef();

  // Function to fetch user name
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

  // Chat document listener
  useEffect(() => {
    if (!chatId || !auth.currentUser) return;

    const chatDocRef = doc(db, "chats", chatId);
    const unsubscribeChat = onSnapshot(chatDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setChatData(data);
        setAdInfo({
          title: data.productTitle || "No Title",
          price: data.productPrice || "0",
          image: data.productImage || "", 
          id: data.productId || "",
          seller: data.sellerName || "User"
        });

        // Fetch other participant's name immediately
        const otherParticipantId = data.participants?.find(id => id !== auth.currentUser.uid);
        if (otherParticipantId) {
          const name = await fetchUserName(otherParticipantId);
          setOtherParticipantName(name);
        }

        if (data.lastSenderId !== auth.currentUser.uid && data.hasUnread) {
            updateDoc(chatDocRef, { hasUnread: false, unreadCount: 0 });
        }
      }
    }, (err) => console.error("Firestore Error:", err));

    return () => unsubscribeChat();
  }, [chatId]);

  // Messages listener with sender names
  useEffect(() => {
    if (!chatId || !auth.currentUser) return;

    const msgQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribeMsgs = onSnapshot(msgQuery, async (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(allMsgs);
      
      // Fetch sender names for all unique senders
      const uniqueSenderIds = [...new Set(allMsgs.map(msg => msg.senderId))];
      const namePromises = uniqueSenderIds.map(async (senderId) => {
        const name = await fetchUserName(senderId);
        return { senderId, name };
      });
      
      const names = await Promise.all(namePromises);
      const nameMap = {};
      names.forEach(item => {
        nameMap[item.senderId] = item.name;
      });
      setSenderNames(nameMap);
      
      setTimeout(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
    });

    return () => unsubscribeMsgs();
  }, [chatId]);

  // Send Message Logic
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !auth.currentUser) return;

    const currentUserId = auth.currentUser.uid;
    const currentMsg = message;
    setMessage("");

    try {
      const chatRef = doc(db, "chats", chatId);
      
      await updateDoc(chatRef, {
        lastMessage: currentMsg,
        timestamp: serverTimestamp(),
        lastSenderId: currentUserId,
        unreadCount: increment(1),
        hasUnread: true
      });

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: currentMsg,
        senderId: currentUserId,
        timestamp: serverTimestamp()
      });
    } catch (error) { console.error("Send Error:", error); }
  };

  return (
    <>
      {/* 1. Seller Header - with immediate name from state, then updated from Firestore */}
      <div className="p-3 border-b border-gray-200 flex items-center bg-white shrink-0 z-10 shadow-sm">
        <img src="https://www.olx.com.pk/assets/iconProfilePicture_noinline.6327fd8895807f09fafb0ad1e3d99b83.svg" className="h-10 w-10 mr-3" alt="avatar" />
        <div>
          <h4 className="font-bold text-[#002f34] text-sm">{otherParticipantName}</h4>
          <p className="text-[10px] text-green-500 font-bold">Online</p>
        </div>
      </div>

      {/* 2. Product Info Bar */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 z-10">
        <div className="flex items-center overflow-hidden">
          <div className="w-12 h-12 bg-gray-100 rounded mr-3 flex items-center justify-center border overflow-hidden shrink-0">
             {adInfo.image ? (
               <img 
                 src={adInfo.image} 
                 className="w-full h-full object-cover" 
                 alt="ad" 
                 onError={(e) => { e.target.src = NO_IMAGE_URL; e.target.className = "w-6 opacity-40"; }}
               />
             ) : (
               <div className="flex flex-col items-center">
                 <img src={NO_IMAGE_URL} className="w-5 opacity-40" alt="no-pic" />
               </div>
             )}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#002f34] text-[13px] truncate">{adInfo.title}</h4>
            <p className="text-[#002f34] text-xs font-bold">Rs {adInfo.price}</p>
          </div>
        </div>
        
        <button 
          onClick={() => adInfo.id && navigate(`/item/${adInfo.id}`)}
          className="px-3 py-1.5 bg-[#4081ec] text-white rounded-[4px] font-bold text-[13px] hover:bg-[#3572d4] transition-colors ml-2 shadow-sm cursor-pointer"
        >
          View Ad
        </button>
      </div>

      {/* 3. Messages Area - with sender names */}
      <div className="flex-1 overflow-y-auto bg-[#f2f4f5] p-4 flex flex-col gap-3 no-scrollbar">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.senderId === auth.currentUser?.uid;
          const showSenderName = !isCurrentUser && 
            (index === 0 || messages[index - 1].senderId !== msg.senderId);
          
          return (
            <div key={msg.id} className="flex flex-col">
              {/* Show sender name only for other users' messages and when it's a new sender */}
              {!isCurrentUser && showSenderName && (
                <span className="text-xs font-semibold text-gray-600 ml-1 mb-1">
                  {senderNames[msg.senderId] || "User"}
                </span>
              )}
              <div className={`max-w-[85%] p-2.5 rounded-lg text-[13px] shadow-sm ${
                isCurrentUser 
                  ? "bg-[#e2f7ff] self-end rounded-tr-none text-[#002f34]" 
                  : "bg-white self-start rounded-tl-none text-[#002f34] border border-gray-100"
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* 4. Input Section */}
      <div className="bg-white border-t sticky bottom-0 left-0 right-0 z-20">
        {/* Tabs */}
        <div className="flex border-b text-[10px] font-bold text-[#002f34] uppercase tracking-wider relative bg-white">
           <div className="flex-1 py-3 flex items-center justify-center gap-2 border-b-2 border-[#002f34] cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98 1 4.28L2 22l5.72-1c1.3.64 2.74 1 4.28 1 5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
              QUESTIONS
           </div>
           <div className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-400 cursor-pointer hover:bg-gray-50">
              <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M11.8 2.1c-.5 0-.8.3-.8.8V4h-1V3c0-.6-.4-1-1-1H5c-.6 0-1 .4-1 1v1H3c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1h-1V3c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v1h-1V2.9c0-.5-.3-.8-.8-.8h-.4zM6 4h2v1H6V4zm10 0h2v1h-2V4zM4 6h16v12H4V6z"/></svg>
              OFFER
           </div>
        </div>

        {/* Input Field Form */}
        <form onSubmit={sendMessage} className="p-3 flex items-center gap-3 bg-white">
          <button type="button" className="text-gray-500 hover:text-[#002f34] cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M15.17 6L8.13 13.04a3 3 0 1 0 4.24 4.24l7.07-7.07a5 5 0 0 0-7.07-7.07l-7.07 7.07a7 7 0 1 0 9.9 9.9L21 14"/></svg>
          </button>

          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type a message" 
            className="flex-1 py-2 text-sm outline-none placeholder:text-gray-400" 
          />

          <button 
            type="submit" 
            disabled={!message.trim()} 
            className={`transition-opacity ${message.trim() ? "opacity-100 cursor-pointer text-[#002f34]" : "opacity-30 cursor-default"}`}
          >
            <svg viewBox="0 0 1024 1024" className="w-9 h-9">
              <path fill="currentColor" d="M512 0c281.6 0 512 230.4 512 512s-230.4 512-512 512S0 793.6 0 512 230.4 0 512 0zM284.44 256l93.87 256-93.87 256 568.9-256-568.9-256zm102.4 110.93l290.14 130.85H435.2l-48.36-130.85zm48.36 159.3h241.78L386.84 657.06l48.36-130.85z"></path>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatPage;