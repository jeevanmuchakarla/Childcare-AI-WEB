import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Paintbrush, Moon, FileText, ShieldCheck, 
  HelpCircle, LogOut, ChevronRight, UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';

import { useTheme } from '../../context/ThemeContext';

const SettingsView = () => {
  const { user, logout } = useUser();
  const { isDarkMode, toggleDarkMode, primaryColor } = useTheme();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    logout();
  };

  const sections = [
    {
      title: "Account",
      items: [
        { label: "Profile", icon: User, color: "#007AFF", path: "/profile" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { label: "Appearance", icon: Paintbrush, color: primaryColor, path: "/settings/appearance", showRedDot: true },
        { label: "Dark Mode", icon: Moon, color: "#5E5CE6", isToggle: true },
      ]
    },
    {
      title: "About & Support",
      items: [
        { label: "Terms & Conditions", icon: FileText, color: "#8E8E93", path: "/settings/terms" },
        { label: "Privacy Policy", icon: ShieldCheck, color: "#007AFF", path: "/settings/privacy" },
        { label: "Help & Support", icon: HelpCircle, color: "#FF9500", path: "/settings/support" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-28">
      {/* Header */}
      <header className="pt-12 pb-6 flex justify-center items-center sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-xl z-10 border-b border-black/[0.03] dark:border-white/[0.03]">
        <h1 className="text-[17px] font-black text-black dark:text-white uppercase tracking-widest">Settings</h1>
      </header>

      <div className="px-6 space-y-10 mt-6">
        {/* Profile Area */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#1C1C1E] shadow-premium overflow-hidden mb-4 ring-4 ring-primary/5">
            {user?.profile_image ? (
              <img src={`http://localhost:8000${user.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={48} strokeWidth={2.5} />
              </div>
            )}
          </div>
          <h2 className="text-[24px] font-black text-black dark:text-white tracking-tighter leading-tight">
            {user?.full_name || 'Jeevan Muchakarla'}
          </h2>
          <p className="text-[15px] font-bold text-gray-400 dark:text-gray-500 mt-1">
            {user?.email || 'jeevanmuchakarla107@gmail.com'}
          </p>
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-[13px] font-black text-gray-400 dark:text-gray-500 pl-4 uppercase tracking-[0.1em]">{section.title}</h3>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-[22px] overflow-hidden shadow-sm border border-black/[0.03] dark:border-white/[0.03]">
                {section.items.map((item, i) => (
                  <div key={i}>
                    <button
                      onClick={() => item.isToggle ? toggleDarkMode() : item.path && navigate(item.path)}
                      className="w-full flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-[#2C2C2E] transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div 
                           className="w-8 h-8 rounded-[10px] flex items-center justify-center shadow-sm" 
                           style={{ backgroundColor: item.color }}
                        >
                          <item.icon size={18} strokeWidth={2.5} className="text-white" />
                        </div>
                        <span className="text-[17px] font-bold text-black dark:text-white tracking-tight">{item.label}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {item.showRedDot && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] mr-1" />
                        )}
                        {item.isToggle ? (
                           <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${isDarkMode ? 'bg-[#34C759]' : 'bg-gray-200 dark:bg-gray-700'}`}>
                              <motion.div 
                                animate={{ x: isDarkMode ? 20 : 0 }}
                                className="absolute left-[2px] top-[2px] w-6 h-6 bg-white rounded-full shadow-lg" 
                              />
                           </div>
                        ) : (
                          <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    {/* Divider except last item */}
                    {i !== section.items.length - 1 && (
                      <div className="pl-[60px]">
                        <div className="h-px bg-gray-50 dark:bg-gray-800/50" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="pb-16 pt-4 space-y-4">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center p-5 bg-white dark:bg-[#1C1C1E] rounded-[22px] shadow-sm active:bg-red-50 dark:active:bg-red-900/10 transition-all border border-black/[0.02] dark:border-white/[0.02] group"
            >
              <LogOut size={20} className="text-[#FF3B30] mr-2 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
              <span className="text-[17px] font-black text-[#FF3B30]">Sign Out</span>
            </button>
            
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center p-5 bg-transparent rounded-[22px] active:scale-95 transition-all group"
            >
              <UserX size={18} className="text-[#FF3B30] opacity-30 mr-2 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
              <span className="text-[15px] font-bold text-[#FF3B30] opacity-30 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Delete Account</span>
            </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-[340px] bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[24px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserX size={24} className="text-[#FF3B30]" />
                </div>
                <h3 className="text-[17px] font-bold text-black dark:text-white mb-2">Delete Account?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be securely erased.
                </p>
              </div>
              
              <div className="flex flex-col border-t border-black/5 dark:border-white/5">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-4 text-[17px] font-bold text-[#FF3B30] active:bg-black/5 dark:active:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 text-[17px] font-medium text-[#007AFF] active:bg-black/5 dark:active:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsView;
