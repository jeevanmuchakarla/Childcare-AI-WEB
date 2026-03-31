import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, MessageSquare, Shield, Home, GraduationCap, 
  ChevronLeft, Send, Camera, X, Lock, Trash2, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import messageService from '../../services/messageService';
import profileService from '../../services/profileService';

const MessagesView = () => {
  const { user } = useUser();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [remoteContacts, setRemoteContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    loadInbox();
    const interval = setInterval(loadInbox, 10000); // Poll inbox every 10s
    
    // Check if we came from a "Message" button
    if (location.state?.contactId) {
      setSelectedContact({
        user_id: location.state.contactId,
        full_name: location.state.fullName,
        user_role: location.state.role || '',
        last_message: 'Starting chat...',
        is_read: true
      });
    }

    return () => clearInterval(interval);
  }, [location.state]);

  const loadInbox = async () => {
    try {
      const inbox = await messageService.getInbox();
      const unread = await messageService.getUnreadCount();
      setContacts(inbox);
      setUnreadCounts(unread.unread_by_role || {});
    } catch (error) {
      console.error("Failed to load inbox:", error);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setIsLoading(true);
    try {
      // Backend expects 'Parent', 'Preschool', 'Daycare', 'Admin'
      const users = await profileService.fetchUsersByRole(category);
      setRemoteContacts(users.map(u => ({
        user_id: u.id,
        full_name: u.full_name,
        user_role: category,
        last_message: 'Tap to chat',
        timestamp: '',
        is_read: true
      })));
    } catch (error) {
      console.error("Failed to fetch categorized contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredContacts = () => {
    if (selectedCategory) {
      // Combine inbox contacts of this role + remote contacts
      const inboxOfRole = contacts.filter(c => c.user_role === selectedCategory);
      const remoteIds = new Set(inboxOfRole.map(c => c.user_id));
      const filteredRemote = remoteContacts.filter(rc => !remoteIds.has(rc.user_id));
      return [...inboxOfRole, ...filteredRemote].filter(c => 
        (c.full_name || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return contacts.filter(c => 
      (c.full_name || '').toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const getRoleItems = () => {
    const role = user?.role?.toLowerCase() || '';
    if (role === 'parent') {
      return [
        { title: "Preschool", icon: GraduationCap, color: "#007AFF", queryRole: "Preschool" },
        { title: "Daycare", icon: Home, color: "#FF9500", queryRole: "Daycare" },
        { title: "Admin", icon: Shield, color: "#FF3B30", queryRole: "Admin" }
      ];
    } else if (role === 'admin') {
      return [
        { title: "Parent", subtitle: "Chat with registered parents", icon: Users, color: "#AF52DE", queryRole: "Parent" },
        { title: "Preschool", subtitle: "Communication with preschool centers", icon: GraduationCap, color: "#34C759", queryRole: "Preschool" },
        { title: "Daycare", subtitle: "Coordination with daycare providers", icon: Home, color: "#FF9500", queryRole: "Daycare" }
      ];
    }
    // Provider role
    return [
      { title: "Parent", icon: Users, color: "#007AFF", queryRole: "Parent" },
      { title: "Admin", icon: Shield, color: "#FF3B30", queryRole: "Admin" }
    ];
  };

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark flex flex-col items-center">
      <div className="w-full max-w-4xl p-6 space-y-8">
        {/* Header */}
        <header className="flex flex-col items-start pb-2">
          <h1 className="text-[32px] font-black text-black dark:text-white tracking-tight leading-tight">Messages</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Select a category to start real-time chat</p>
        </header>

        {/* Search Bar matching iOS Dashboard look */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search conversations..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-white dark:bg-app-surface-dark rounded-[24px] border border-black/5 dark:border-white/5 font-bold shadow-sm focus:shadow-xl focus:shadow-primary/5 focus:outline-none transition-all"
          />
        </div>

        <AnimatePresence mode="wait">
          {!selectedCategory && searchText === '' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {getRoleItems().map((item) => (
                  <QuickChatCard 
                    key={item.title}
                    {...item}
                    unreadCount={unreadCounts[item.title] || 0}
                    onClick={() => handleCategorySelect(item.queryRole || item.title)}
                  />
                ))}
              </div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-2 mb-4">
                <button 
                  onClick={() => { setSelectedCategory(null); setSearchText(''); }}
                  className="flex items-center text-primary font-black hover:opacity-80 transition-opacity"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  Back
                </button>
                <h2 className="text-xl font-black text-text-primary dark:text-text-primary-dark">
                  {selectedCategory || 'Search Results'}
                </h2>
                <div className="w-10" />
              </div>

              <div className="bg-white dark:bg-app-surface-dark rounded-[32px] shadow-xl border border-black/5 dark:border-white/5 overflow-hidden">
                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-text-secondary">Finding connections...</p>
                  </div>
                ) : getFilteredContacts().length === 0 ? (
                  <div className="py-20 text-center text-text-secondary opacity-50 font-bold">
                    No conversations found
                  </div>
                ) : (
                  <div className="divide-y divide-black/5 dark:divide-white/5">
                    {getFilteredContacts().map((contact) => (
                      <ContactRow 
                        key={contact.user_id} 
                        contact={contact} 
                        onClick={() => setSelectedContact(contact)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full Screen Chat Overlay */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white dark:bg-black md:max-w-4xl md:mx-auto md:my-10 md:rounded-[40px] md:shadow-2xl overflow-hidden flex flex-col"
          >
            <ConversationView 
              contact={selectedContact} 
              onClose={() => { setSelectedContact(null); loadInbox(); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickChatCard = ({ title, subtitle, icon: Icon, color, unreadCount, onClick }) => (
  <button 
    onClick={onClick}
    className="relative group bg-white dark:bg-app-surface-dark p-8 rounded-[38px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] flex flex-col items-center text-center space-y-5 active:scale-[0.98] transition-all hover:shadow-xl hover:border-primary/20"
  >
    <div 
      className="w-20 h-20 rounded-[28px] flex items-center justify-center shrink-0 shadow-lg"
      style={{ backgroundColor: `${color}10`, color }}
    >
      <Icon size={34} strokeWidth={2.5} />
    </div>
    
    <div className="flex-1">
      <h3 className="text-[20px] font-black text-black dark:text-white leading-tight mb-1">{title}</h3>
      {subtitle ? (
        <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 leading-tight px-4">{subtitle}</p>
      ) : unreadCount > 0 ? (
        <p className="text-[13px] text-[#FF3B30] font-black">{unreadCount} New Messages</p>
      ) : (
        <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest opacity-60">No new alerts</p>
      )}
    </div>

    {unreadCount > 0 && (
      <div className="absolute top-6 right-6 w-5 h-5 bg-[#FF3B30] rounded-full border-4 border-white dark:border-app-surface-dark shadow-xl animate-pulse" />
    )}
  </button>
);

const ContactRow = ({ contact, onClick }) => {
  const initial = (contact.full_name || 'U').substring(0, 2).toUpperCase();
  const time = contact.timestamp ? new Date(contact.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center p-6 space-x-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:bg-black/10 text-left"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-[22px] bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner border border-primary/5">
          {initial}
        </div>
        {!contact.is_read && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-4 border-white dark:border-app-surface-dark shadow-lg ring-2 ring-primary/20" />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-black text-[17px] text-text-primary dark:text-text-primary-dark truncate tracking-tight">{contact.full_name}</h4>
          <span className="text-[11px] font-black text-text-secondary/60 uppercase tracking-widest">{time}</span>
        </div>
        <p className={`text-sm truncate ${!contact.is_read ? 'text-text-primary dark:text-white font-black' : 'text-text-secondary font-medium'}`}>
          {contact.last_message || 'No messages yet'}
        </p>
      </div>
      <ChevronLeft size={18} className="text-gray-300 transform rotate-180 opacity-50" />
    </button>
  );
};

const ConversationView = ({ contact, onClose }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadConversation();
    const interval = setInterval(loadConversation, 3000); // Fast polling for active chat
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedImage]);

  const loadConversation = async () => {
    try {
      const msgs = await messageService.getConversation(contact.user_id);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!messageText.trim() && !selectedFile) || isSending) return;

    setIsSending(true);
    try {
      let imageUrl = null;
      if (selectedFile) {
        // Upload image first to backend
        const uploadRes = await messageService.uploadImage(selectedFile);
        imageUrl = uploadRes.url;
      }

      await messageService.sendMessage(
        contact.user_id, 
        messageText.trim() || (imageUrl ? "Shared a photo" : ""), 
        imageUrl
      );

      setMessageText('');
      setSelectedImage(null);
      setSelectedFile(null);
      loadConversation();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = 'http://localhost:8000'; // Default backend URL
    return `${baseUrl}${path}`;
  };

  return (
    <>
      <header className="p-6 flex items-center justify-between bg-[#F0F2F5]/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5 sticky top-0 z-10 shadow-sm transition-colors">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors active:scale-95">
            <ChevronLeft size={28} className="text-primary" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-[18px] bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/5 shadow-premium">
              {(contact.full_name || 'U').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-black text-[17px] text-text-primary dark:text-text-primary-dark tracking-tight">{contact.full_name}</h3>
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-3 text-red-500/60 hover:text-red-500 transition-colors active:scale-90">
            <Trash2 size={22} />
          </button>
        </div>
      </header>

      <main 
        className="flex-1 overflow-y-auto p-6 space-y-4 transition-all"
        style={{ backgroundColor: '#DAD3CC', backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '20px 20px' }}
      >
        <div className="flex flex-col items-center py-6">
          <div className="bg-[#FFF9C4]/80 dark:bg-yellow-900/30 px-6 py-3 rounded-xl flex items-center space-x-3 shadow-sm border border-yellow-200/50 max-w-xs md:max-w-md">
            <Lock size={12} className="text-yellow-700 dark:text-yellow-500 flex-shrink-0" />
            <p className="text-[11px] font-bold text-yellow-800 dark:text-yellow-500 text-center uppercase tracking-wider leading-tight">
              Messages are end-to-end encrypted. No one outside of this chat can read them.
            </p>
          </div>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2`}
          >
            <div className={`max-w-[85%] md:max-w-[75%] space-y-1 ${msg.sender_id === user?.id ? 'items-end' : 'items-start'} flex flex-col`}>
              {!msg.is_from_me && (
                <span className="text-[11px] font-bold text-primary px-3 uppercase tracking-wider opacity-90">{contact.full_name}</span>
              )}
              <div 
                className={`p-1.5 rounded-[18px] shadow-md relative transition-all border border-black/5 ${
                  msg.sender_id === user?.id 
                    ? 'bg-[#E7FFDB] text-black rounded-tr-none' 
                    : 'bg-white text-black rounded-tl-none'
                }`}
              >
                {msg.image_url && (
                  <div className="mb-1 overflow-hidden rounded-[14px]">
                    <img 
                      src={getFullImageUrl(msg.image_url)} 
                      alt="Shared" 
                      className="max-w-full max-h-[300px] object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="px-3 py-1.5 flex flex-col min-w-[80px]">
                  <p className="text-[15px] font-medium leading-relaxed break-words">{msg.content}</p>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter self-end mt-1 opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-6 bg-[#F0F2F5] dark:bg-app-surface-dark border-t border-black/5 dark:border-white/5 space-y-4">
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative inline-block ml-16"
            >
              <div className="relative group">
                <img src={selectedImage} alt="Selected" className="w-32 h-32 object-cover rounded-2xl border-4 border-white shadow-2xl" />
                <button 
                  onClick={() => { setSelectedImage(null); setSelectedFile(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 hover:scale-110 transition-all z-10"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center space-x-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 transition-all active:scale-90 ${selectedImage ? 'text-primary' : 'text-gray-500/60 hover:text-primary'}`}
          >
            <Camera size={28} />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder={selectedImage ? "Add a caption..." : "Type a message..."}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full py-3.5 px-6 bg-white dark:bg-black/20 rounded-full font-bold focus:shadow-xl outline-none text-text-primary dark:text-white transition-all shadow-sm border border-transparent focus:border-primary/20"
            />
          </div>
          <button 
            type="submit" 
            disabled={(!messageText.trim() && !selectedFile) || isSending}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 flex-shrink-0 ${
              (messageText.trim() || selectedFile) && !isSending ? 'bg-primary text-white scale-110' : 'bg-gray-300 dark:bg-white/5 text-gray-400 opacity-50'
            }`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={22} className="ml-1" />
            )}
          </button>
        </form>
      </footer>
    </>
  );
};


export default MessagesView;
