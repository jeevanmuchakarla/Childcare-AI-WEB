import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Home, Users, Settings, LogOut, MessageSquare, Calendar, ShieldCheck, FileText, CheckSquare, Search, BookOpen, Building2, GraduationCap, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import messageService from '../../services/messageService';

const SidebarLayout = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const data = await messageService.getUnreadCount();
        // data.total_unread or similar depending on service implementation
        setUnreadCount(data.total_unread || 0);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const role = user.role?.toLowerCase() || '';

  const handleLogout = () => {
    logout();
    navigate('/roles');
  };

  let navItems = [];
  if (role === 'parent') {
    navItems = [
      { label: 'Home', path: '/parent/dashboard', icon: Home },
      { label: 'Bookings', path: '/bookings', icon: Calendar },
      { label: 'Children', path: '/children', icon: Users },
      { label: 'Messages', path: '/messages', icon: MessageSquare },
      { label: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (role === 'preschool' || role === 'daycare') {
    navItems = [
      { label: 'Home', path: `/${role}/dashboard`, icon: Home },
      { label: 'Bookings', path: '/bookings', icon: Calendar },
      { label: 'Children', path: '/children', icon: Smile },
      { label: 'Messages', path: '/messages', icon: MessageSquare },


      { label: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (role === 'admin') {
    navItems = [
      { label: 'Home', path: '/admin/dashboard', icon: Home },
      { label: 'Bookings', path: '/admin/bookings', icon: Calendar }, 
      { label: 'Users', path: '/admin/management', icon: Users },
      { label: 'Messages', path: '/messages', icon: MessageSquare },
      { label: 'Settings', path: '/settings', icon: Settings },
    ]
  }

  return (
    <div className="flex min-h-screen bg-app-bg dark:bg-app-bg-dark">
      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsLogoutModalOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white dark:bg-app-surface-dark w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative z-10"
          >
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <LogOut size={28} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">
              Sign Out?
            </h3>
            <p className="text-slate-500 font-medium text-center mb-8">
              Are you sure you want to log out of your account?
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Yes, Sign Out
              </button>
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sidebar - Desktop Only */}
      <aside className="w-64 bg-white dark:bg-app-surface-dark border-r border-black/5 dark:border-white/5 hidden md:flex flex-col sticky top-0 h-screen">
        <div 
          className="p-6 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate(`/${role}/dashboard`)}
        >
          <h2 className="text-2xl font-black text-primary tracking-tight">ChildCare AI</h2>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                    : 'text-text-secondary dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 font-medium'
                }`}
              >
                <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                <span className="flex-1 text-left">{item.label}</span>
                {unreadCount > 0 && (item.label === 'Chat' || item.label === 'Messages') && (
                  <span className="w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5 mt-auto">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Bottom Tab Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-app-surface-dark/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 flex items-center justify-around py-3 px-2 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center space-y-1 group relative flex-1"
            >
              <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                <item.icon 
                  size={24} 
                  className={`transition-all ${isActive ? 'text-primary scale-110' : 'text-text-secondary dark:text-text-secondary-dark group-active:scale-95'}`} 
                />
                {unreadCount > 0 && (item.label === 'Chat' || item.label === 'Messages') && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-app-surface-dark shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-black tracking-tight transition-all ${isActive ? 'text-primary' : 'text-text-secondary/60'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -top-3 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Main Content Area */}
      <main className={`flex-1 relative w-full overflow-x-hidden min-h-screen ${role ? 'pb-20 md:pb-0' : ''}`}>
        <div className="max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  )
}

export default SidebarLayout;
