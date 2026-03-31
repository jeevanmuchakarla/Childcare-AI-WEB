import React, { useState } from 'react';
import { Bell, Sparkles, Building2, UserCircle, Users, FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const ProviderDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyMsg, setEmergencyMsg] = useState("");
  
  const stats = [
    { title: "Active Classes", value: "12", color: "#AF52DE", icon: Sparkles },
    { title: "Capacity", value: "86%", color: "#34C759", icon: Users },
    { title: "Staff Ratio", value: "1:8", color: "#FF9500", icon: UserCircle },
  ];

  const actions = [
    { title: "AI Insights", subtitle: "Recommendations", icon: Sparkles, color: "#FF2D55", onClick: () => navigate('/provider/insights') },
    { title: "Center Status", subtitle: "Status: Open", icon: Building2, color: "#34C759", onClick: () => navigate('/provider/status') },
    { title: "Parent Status", subtitle: "1 Active Today", icon: UserCircle, color: "#007AFF", onClick: () => navigate('/provider/parents') },
    { title: "Staff Status", subtitle: "Management", icon: Users, color: "#FF9500", onClick: () => navigate('/provider/staff') },
    { title: "Daily Notes", subtitle: "Reports", icon: FileText, color: "#AF52DE", onClick: () => navigate('/provider/notes') },
    { title: "Emergency", subtitle: "Alert Parents", icon: AlertTriangle, color: "#FF3B30", isEmergency: true },
  ];

  const handleSendEmergency = () => {
    if (emergencyMsg.trim() !== "") {
      alert("Emergency alert sent!");
      setShowEmergency(false);
      setEmergencyMsg("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-28">
      {/* Header Section */}
      <header className="flex items-center justify-between pt-12 pb-6 px-6 sticky top-0 bg-[#F2F2F7]/95 dark:bg-black/95 backdrop-blur-xl z-20 border-b border-black/[0.03] dark:border-white/[0.03]">
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest opacity-80">
            {user?.role === 'preschool' ? "Welcome to Preschool," : "Welcome to Daycare,"}
          </span>
          <h1 className="text-[28px] font-black text-black dark:text-white tracking-tighter leading-tight mt-0.5">
            {user?.full_name || 'Care Provider'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/notifications')}
            className="w-12 h-12 rounded-full bg-white dark:bg-[#1C1C1E] shadow-premium flex items-center justify-center relative active:scale-90 transition-all"
          >
            <Bell size={24} className="text-primary" strokeWidth={2.5} />
            <div className="absolute top-[10px] right-[10px] w-3 h-3 bg-[#FF3B30] rounded-full border-2 border-white dark:border-[#1C1C1E] shadow-sm" />
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-[#1C1C1E] shadow-premium active:scale-95 transition-all"
          >
            {user?.profile_image ? (
              <img src={`http://localhost:8000${user.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                <UserCircle size={24} strokeWidth={2.5} />
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="px-6 space-y-8 pt-6">
        {/* Top Stats Row */}
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {stats.map((stat, idx) => (
            <motion.div 
               key={idx} 
               whileHover={{ y: -5 }}
               className="flex-1 min-w-[110px] bg-white dark:bg-[#1C1C1E] rounded-[24px] p-5 flex flex-col items-center justify-center shadow-sm border border-black/[0.03] dark:border-white/[0.03]"
            >
              <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center shadow-inner" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                 <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <p className="text-[22px] font-black text-black dark:text-white leading-tight tracking-tight">{stat.value}</p>
              <p className="text-[11px] font-bold mt-1 text-center uppercase tracking-wider opacity-60" style={{ color: stat.color }}>{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {actions.map((action, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (action.isEmergency) {
                  setShowEmergency(true);
                } else if (action.onClick) {
                  action.onClick();
                }
              }}
              className={`flex items-center p-6 rounded-[32px] text-left transition-all relative overflow-hidden group ${
                action.isEmergency 
                  ? 'bg-[#FF3B30] text-white shadow-xl shadow-red-500/20' 
                  : 'bg-white dark:bg-[#1C1C1E] shadow-sm border border-black/[0.03] dark:border-white/[0.03] hover:shadow-xl'
              }`}
            >
              <div 
                className={`w-14 h-14 rounded-[22px] flex items-center justify-center mr-5 shadow-lg transition-transform group-hover:rotate-6 ${
                  action.isEmergency ? 'bg-white/20' : ''
                }`}
                style={!action.isEmergency ? { backgroundColor: `${action.color}15`, color: action.color } : {}}
              >
                <action.icon size={28} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1">
                <h3 className={`text-[19px] font-black tracking-tight leading-tight ${
                  action.isEmergency ? 'text-white' : 'text-black dark:text-white'
                }`}>
                  {action.title}
                </h3>
                <p className={`text-[13px] font-bold mt-0.5 opacity-80 ${
                  action.isEmergency ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {action.subtitle}
                </p>
              </div>
              
              {!action.isEmergency && (
                <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" strokeWidth={3} />
              )}
            </motion.button>
          ))}
        </div>
      </main>

      {/* Emergency Modal Overlay */}
      <AnimatePresence>
        {showEmergency && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowEmergency(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-[40px] w-full max-w-sm p-8 relative z-10 shadow-2xl border border-white/10"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-[#FF3B30]" />
              </div>
              
              <h3 className="text-[20px] font-black text-black dark:text-white text-center mb-2 tracking-tight">Send Emergency Alert?</h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 text-center mb-8 font-medium leading-relaxed">
                This will send a high-priority notification to all parents with active bookings. Use only for real emergencies.
              </p>
              
              <div className="bg-[#F2F2F7] dark:bg-white/5 rounded-[22px] p-5 mb-8 border border-transparent focus-within:border-red-500/30 transition-all">
                <textarea 
                  placeholder="Emergency message..."
                  value={emergencyMsg}
                  onChange={(e) => setEmergencyMsg(e.target.value)}
                  className="w-full bg-transparent text-[15px] font-bold text-black dark:text-white placeholder-gray-400 outline-none resize-none h-24"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowEmergency(false)}
                  className="py-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-[15px] font-black text-black dark:text-white active:scale-95 transition-all hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendEmergency}
                  disabled={!emergencyMsg.trim()}
                  className={`py-4 rounded-2xl text-[15px] font-black transition-all active:scale-95 shadow-lg ${
                    emergencyMsg.trim() 
                      ? 'bg-[#FF3B30] text-white shadow-red-500/20 hover:bg-[#E03026]' 
                      : 'bg-[#FF3B30]/30 text-white/50 cursor-not-allowed'
                  }`}
                >
                  SEND NOW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderDashboard;
