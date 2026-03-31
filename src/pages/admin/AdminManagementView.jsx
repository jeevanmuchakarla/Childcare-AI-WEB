import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import profileService from '../../services/profileService';
import { fetchAllBookings } from '../../services/adminService';

const AdminManagementView = () => {
  const [activeTab, setActiveTab] = useState('parents');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState({ parents: [], preschools: [], daycares: [] });
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'parents', label: 'Parents' },
    { id: 'preschools', label: 'Preschools' },
    { id: 'daycares', label: 'Daycares' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [parentsResponse, preschoolsResponse, daycaresResponse] = await Promise.all([
          profileService.fetchUsersByRole('Parent'),
          profileService.fetchUsersByRole('Preschool'),
          profileService.fetchUsersByRole('Daycare'),
        ]);
        
        setData({ 
          parents: parentsResponse, 
          preschools: preschoolsResponse,
          daycares: daycaresResponse,
        });
      } catch (error) {
        console.error("Failed to fetch management data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeData = data[activeTab] || [];
  const filteredData = activeData.filter(item => {
    if (activeTab === 'bookings') {
      return (item.child_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
             (item.center_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    }
    return (item.full_name || item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (item.email || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-28">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center justify-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <h1 className="text-[17px] font-bold text-black dark:text-white tracking-tight">
          Management
        </h1>
      </header>

      <main className="space-y-6 pt-2">
        {/* Scrollable Tabs */}
        <div className="flex px-5 space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-all shadow-sm border border-black/[0.02] dark:border-white/[0.02] ${
                activeTab === tab.id 
                  ? 'bg-[#FF3B30] text-white' 
                  : 'bg-white dark:bg-[#1C1C1E] text-black dark:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              className="w-full bg-white dark:bg-[#1C1C1E] border border-black/[0.02] dark:border-white/[0.02] rounded-[16px] py-3.5 pl-11 pr-4 text-[15px] font-medium text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3B30]/20 shadow-sm"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="px-5 space-y-3">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 size={30} className="text-[#FF3B30] animate-spin" />
            </div>
          ) : filteredData.length > 0 ? (
            <AnimatePresence>
              {filteredData.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex items-center space-x-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
                >
                  <div className="w-[46px] h-[46px] rounded-[16px] bg-[#AF52DE]/10 flex items-center justify-center shrink-0">
                    <span className="text-[18px] font-bold text-[#AF52DE]">
                      {activeTab === 'bookings' 
                        ? (item.child_name || 'B').substring(0,1).toUpperCase()
                        : (item.full_name || item.name || 'U').substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {activeTab === 'bookings' ? (
                      <>
                        <h3 className="text-[16px] font-bold text-black dark:text-white truncate">{item.child_name || 'Unknown Child'}</h3>
                        <p className="text-[13px] font-medium text-gray-500 truncate mt-0.5">{item.center_name} • {item.booking_date || item.time}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-[16px] font-bold text-black dark:text-white truncate">{item.full_name || item.name}</h3>
                        <p className="text-[13px] font-medium text-gray-500 truncate mt-0.5">{item.email || 'Email missing'}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${activeTab === 'bookings' && item.status !== 'Confirmed' ? 'bg-[#FF9500]/10 text-[#FF9500]' : 'bg-[#34C759]/10 text-[#34C759]'}`}>
                      {activeTab === 'bookings' ? item.status : 'Active'}
                    </span>
                    <ChevronRight size={18} className="text-gray-300" strokeWidth={2.5} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-20 text-center">
              <p className="text-[15px] font-bold text-gray-400">No {activeTab} found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminManagementView;
