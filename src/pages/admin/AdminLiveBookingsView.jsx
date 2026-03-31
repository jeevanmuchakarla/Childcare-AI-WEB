import React, { useEffect, useState } from 'react';
import { ChevronLeft, CheckCircle2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLiveBookings } from '../../services/adminService';

const statusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'confirmed': return { bg: '#34C75915', text: '#34C759' };
    case 'completed': return { bg: '#007AFF15', text: '#007AFF' };
    case 'pending':   return { bg: '#FF950015', text: '#FF9500' };
    default:          return { bg: '#8E8E9315', text: '#8E8E93' };
  }
};

const AdminLiveBookingsView = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLiveBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load live bookings:', err);
        setError('Could not load bookings. Check your connection.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-28">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center justify-between px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-black/[0.03] dark:border-white/[0.03]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E] rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} className="text-[#FF3B30] -ml-1" strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] font-black text-black dark:text-white tracking-tight">Live Bookings Today</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <CheckCircle2 size={22} className="text-[#34C759]" strokeWidth={2.5} />
        </div>
      </header>

      <main className="px-5 space-y-4 pt-6">
        {/* Stats pill */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-white dark:bg-[#1C1C1E] px-5 py-3.5 rounded-[20px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] mb-2"
          >
            <span className="text-[13px] font-black text-gray-500 uppercase tracking-wider">Total Today</span>
            <span className="text-[22px] font-black text-black dark:text-white">{bookings.length}</span>
          </motion.div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[24px] flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/3" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center pt-20 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-[#FF3B30]" strokeWidth={1.5} />
            </div>
            <p className="text-[15px] font-bold text-gray-400">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center pt-24 space-y-4"
          >
            <div className="w-[100px] h-[100px] bg-white dark:bg-[#1C1C1E] rounded-full flex items-center justify-center shadow-sm">
              <Calendar size={48} className="text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-bold text-gray-400">No Live Bookings</h2>
            <p className="text-[14px] font-medium text-gray-400">No confirmed bookings for today yet.</p>
          </motion.div>
        )}

        {/* Booking list */}
        <AnimatePresence>
          {!loading && !error && bookings.map((booking, idx) => {
            const { bg, text } = statusColor(booking.status);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="w-full bg-white dark:bg-[#1C1C1E] p-4 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex items-center space-x-4"
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${text}20`, color: text }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>

                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[17px] font-bold text-black dark:text-white leading-tight mb-0.5">{booking.child_name}</span>
                    <span className="text-[13px] font-medium text-gray-400 truncate">{booking.center_name}</span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-3">
                    <span className="text-[14px] font-bold text-black dark:text-white leading-tight mb-1">{booking.time || '—'}</span>
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md"
                      style={{ backgroundColor: bg, color: text }}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminLiveBookingsView;
