import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Loader2, RefreshCw, CheckCircle2, XCircle, Phone, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import bookingService from '../../services/bookingService';

const BookingsView = () => {
  const { user } = useUser();
  const isProvider = user?.role?.toLowerCase() === 'preschool' || user?.role?.toLowerCase() === 'daycare';

  return isProvider ? <ProviderBookings /> : <ParentBookings />;
};

/* ==========================================================
                    PROVIDER BOOKINGS
   ========================================================== */
const ProviderBookings = () => {
  const { user } = useUser();
  const [selectedFilter, setSelectedFilter] = useState('confirmed');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [user?.id]);

  const loadBookings = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = await bookingService.fetchProviderBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    // Basic filter logic. Extend as needed per backend state.
    const bookingDate = new Date(b.booking_date).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
    const isPast = bookingDate < today;
    const isPending = b.status?.toLowerCase() === 'pending';
    const isConfirmed = b.status?.toLowerCase() === 'confirmed';
    
    if (selectedFilter === 'past') return isPast;
    if (selectedFilter === 'pending') return isPending && !isPast;
    return isConfirmed && !isPast; // confirmed
  });

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-24">
      <header className="pt-12 pb-4 flex justify-between items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-10">
        <h1 className="text-[28px] font-bold text-black dark:text-white tracking-tight ml-2">Bookings</h1>
        <button onClick={loadBookings} className="p-2 text-[#FF3B30] active:opacity-50 transition-opacity">
          <RefreshCw size={22} className={isLoading ? "animate-spin" : ""} strokeWidth={2.5} />
        </button>
      </header>

      {/* Floating Pill Tabs */}
      <div className="px-5 mb-6">
        <div className="bg-[#E5E5EA] dark:bg-[#1C1C1E] rounded-full p-1 flex">
          {['confirmed', 'pending', 'past'].map(tab => (
            <button 
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`flex-1 py-1.5 text-[13px] font-bold capitalize rounded-full transition-all ${
                selectedFilter === tab 
                  ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-black dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 pb-10">
        {isLoading ? (
          <div className="py-20 flex justify-center text-[#FF3B30]">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400">
              <Calendar size={32} />
            </div>
            <p className="text-[15px] font-medium text-gray-400">No {selectedFilter} bookings</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <ProviderBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const ProviderBookingCard = ({ booking }) => {
  const isPending = booking.status?.toLowerCase() === 'pending';
  const isConfirmed = booking.status?.toLowerCase() === 'confirmed';
  
  const handleAction = (action) => {
    alert(`Booking ${action}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1C1C1E] rounded-[24px] overflow-hidden p-5 shadow-sm border border-black/[0.02] dark:border-white/[0.02]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-[50px] h-[50px] rounded-full bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30] font-bold text-[20px]">
            {booking.child_name ? booking.child_name.charAt(0).toUpperCase() : 'B'}
          </div>
          <div className="flex flex-col">
            <h4 className="text-[17px] font-bold text-[#FF3B30] leading-tight mb-1">
              {booking.child_name ? `Booking for ${booking.child_name.split(' ')[0]}` : "New Booking"}
            </h4>
            <div className="flex">
              <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                isConfirmed ? 'bg-green-100 text-green-600' : 'bg-[#FF9500]/20 text-[#FF9500]'
              }`}>
                {booking.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-[17px] font-bold text-[#FF3B30]">
          ${booking.price || "1500"}
        </div>
      </div>

      <div className="space-y-3 mb-5 pl-1">
        <div className="flex items-center space-x-6 text-[13px] font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar size={14} className="text-gray-400" />
            <span>{new Date(booking.booking_date).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={14} className="text-gray-400" />
            <span>{booking.check_in || 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-[13px] font-medium text-gray-500 dark:text-gray-400">
          <UserIcon size={14} className="text-gray-400" />
          <span>Age/Name: {booking.child_name || "Unknown"}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-[13px] font-bold text-[#FF3B30]">
          <Phone size={14} />
          <span>Parent: {booking.parent_name || "Contact"}</span>
        </div>
      </div>

      {isPending && (
        <div className="flex space-x-3 pt-2">
          <button 
            onClick={() => handleAction('Accepted')}
            className="flex-1 bg-[#FF3B30] text-white py-3 rounded-[12px] flex items-center justify-center space-x-2 font-bold text-[15px] active:scale-[0.98] transition-all shadow-sm"
          >
            <CheckCircle2 size={18} />
            <span>Accept</span>
          </button>
          <button 
            onClick={() => handleAction('Declined')}
            className="flex-1 bg-white dark:bg-[#1C1C1E] border border-[#FF3B30] text-[#FF3B30] py-3 rounded-[12px] flex items-center justify-center space-x-2 font-bold text-[15px] active:bg-[#FF3B30]/5 transition-all"
          >
            <XCircle size={18} />
            <span>Decline</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

/* ==========================================================
                    PARENT BOOKINGS
   ========================================================== */
const ParentBookings = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [user?.id]);

  const loadBookings = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = await bookingService.fetchBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const bookingDate = new Date(b.booking_date).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
    const isPast = bookingDate < today;
    return selectedFilter === 'upcoming' ? !isPast : isPast;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black ios-container pb-24">
      <header className="pt-12 pb-4 flex justify-center items-center bg-white dark:bg-black sticky top-0 z-10">
        <h1 className="text-[17px] font-bold text-black dark:text-white">My Bookings</h1>
      </header>

      <div className="px-6 flex border-b border-black/5 dark:border-white/5 mx-4 mt-2">
        <button 
          onClick={() => setSelectedFilter('upcoming')}
          className={`flex-1 pb-3 text-[15px] font-bold text-center transition-all ${
            selectedFilter === 'upcoming' 
              ? 'text-[#FF3B30] border-b-[2.5px] border-[#FF3B30]' 
              : 'text-gray-400'
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setSelectedFilter('past')}
          className={`flex-1 pb-3 text-[15px] font-bold text-center transition-all ${
            selectedFilter === 'past' 
              ? 'text-[#FF3B30] border-b-[2.5px] border-[#FF3B30]' 
              : 'text-gray-400'
          }`}
        >
          Past
        </button>
      </div>

      <main className="px-5 py-6">
        <h3 className="text-[18px] font-bold text-black dark:text-white mb-4">
          {selectedFilter === 'upcoming' ? 'Upcoming Bookings' : 'Past Bookings'}
        </h3>

        {isLoading ? (
          <div className="py-20 flex justify-center text-[#FF3B30]">
            <Loader2 size={32} className="animate-spin" />
          </div>
         ) : filteredBookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-300">
              <Calendar size={32} />
            </div>
            <p className="text-[15px] font-medium text-gray-400">No {selectedFilter} bookings</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <ParentBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const ParentBookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const isConfirmed = booking.status?.toLowerCase() === 'confirmed';
  const badgeClass = isConfirmed ? 'bg-green-100 text-green-600' : 'bg-green-50 text-green-600'; 
    
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1C1C1E] rounded-[24px] overflow-hidden p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.03] dark:border-white/[0.03]"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-[50px] h-[50px] rounded-[16px] bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
          <div className="flex flex-col">
            <h4 className="text-[17px] font-bold text-black dark:text-white leading-tight">
              {booking.provider_name || "Provider Center"}
            </h4>
            <span className="text-[13px] font-medium text-gray-400 mt-1">
              Booking ID: #{booking.id}
            </span>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
          {isConfirmed ? 'Confirmed' : 'Pending'}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
          <Calendar size={16} className="text-[#FF3B30]" strokeWidth={2.5} />
          <span className="text-[14px] font-medium">{new Date(booking.booking_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
          <Clock size={16} className="text-[#FF3B30]" strokeWidth={2.5} />
          <span className="text-[14px] font-medium">{booking.check_in || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
          <MapPin size={16} className="text-[#FF3B30]" strokeWidth={2.5} />
          <span className="text-[14px] font-medium">{booking.location || "Verified Location"}</span>
        </div>
      </div>

      <button 
        onClick={() => booking.provider_id ? navigate(`/provider/${booking.provider_id}`) : null}
        className="w-full py-3.5 border border-gray-200 dark:border-gray-700 rounded-[14px] font-bold text-[14px] text-black dark:text-white active:bg-gray-50 dark:active:bg-gray-800 transition-all"
      >
        View Details
      </button>
    </motion.div>
  );
};

export default BookingsView;
