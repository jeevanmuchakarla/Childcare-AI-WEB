import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllBookings } from '../../services/adminService';

import api from '../../services/api';

const AdminBookingsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookingClick = async (id) => {
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/admin/bookings/${id}`);
      setSelectedBooking(res.data);
    } catch (err) {
      console.error("Failed to fetch booking details:", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const filteredData = bookings.filter(item => {
    return (item.child_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (item.center_name || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-28">
      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedBooking(null)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-t-[32px] md:rounded-[32px] p-8 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white leading-tight">Booking Details</h3>
                  <p className="text-gray-500 font-bold mt-1">ID: #{selectedBooking.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <section>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">Child & Provider</label>
                  <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-black/[0.03] dark:border-white/[0.03] space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Child Name</span>
                      <span className="text-black dark:text-white font-black">{selectedBooking.child?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Facility</span>
                      <span className="text-black dark:text-white font-black">{selectedBooking.provider?.name}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">Schedule & Status</label>
                  <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-black/[0.03] dark:border-white/[0.03] space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Date</span>
                      <span className="text-black dark:text-white font-black">{selectedBooking.booking_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Status</span>
                      <span className={`px-2 py-0.5 text-[11px] font-black rounded-md ${
                        selectedBooking.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                </section>

                <section>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">Parent Contacts</label>
                  <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-black/[0.03] dark:border-white/[0.03] space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Parent</span>
                      <span className="text-black dark:text-white font-black">{selectedBooking.parent?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Phone</span>
                      <span className="text-black dark:text-white font-black">{selectedBooking.parent?.phone}</span>
                    </div>
                  </div>
                </section>

                {selectedBooking.notes && (
                  <section>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">Notes</label>
                    <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-black/[0.03] dark:border-white/[0.03]">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{selectedBooking.notes}</p>
                    </div>
                  </section>
                )}

                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                >
                  Close Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="pt-12 pb-4 flex items-center justify-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <h1 className="text-[17px] font-bold text-black dark:text-white tracking-tight">
          All Bookings
        </h1>
      </header>

      <main className="space-y-6 pt-2">
        {/* Search */}
        <div className="px-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              className="w-full bg-white dark:bg-[#1C1C1E] border border-black/[0.02] dark:border-white/[0.02] rounded-[16px] py-3.5 pl-11 pr-4 text-[15px] font-medium text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3B30]/20 shadow-sm"
              placeholder="Search child or center..."
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
                  onClick={() => handleBookingClick(item.id)}
                  className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex items-center space-x-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
                >
                  <div className="w-[46px] h-[46px] rounded-[16px] bg-[#34C759]/10 flex items-center justify-center shrink-0">
                    <Calendar size={22} className="text-[#34C759]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-bold text-black dark:text-white truncate">{item.child_name || 'Unknown Child'}</h3>
                    <p className="text-[13px] font-medium text-gray-500 truncate mt-0.5">{item.center_name} • {item.booking_date}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                      item.status === 'Pending' && new Date(item.booking_date) < new Date('2026-03-27')
                        ? 'bg-gray-400/10 text-gray-500'
                        : item.status !== 'Confirmed' 
                          ? 'bg-[#FF9500]/10 text-[#FF9500]' 
                          : 'bg-[#34C759]/10 text-[#34C759]'
                    }`}>
                      {item.status === 'Pending' && new Date(item.booking_date) < new Date('2026-03-27') ? 'Expired' : item.status}
                    </span>
                    <ChevronRight size={18} className="text-gray-300" strokeWidth={2.5} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-20 text-center">
              <p className="text-[15px] font-bold text-gray-400">No bookings found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminBookingsView;
