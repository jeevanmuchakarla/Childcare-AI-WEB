import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Calendar as CalendarIcon, Clock, MessageSquare, User, CheckCircle2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import bookingService from '../../services/bookingService';
import childService from '../../services/childService';
import PrimaryButton from '../../components/common/PrimaryButton';
import Input from '../../components/common/Input';

const BookingFormView = () => {
  const { id } = useParams(); // providerId
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isVisit = state?.isVisit || false;
  const providerName = state?.providerName || 'Provider';
  const providerType = state?.providerType || 'ChildCare';

  const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];

  useEffect(() => {
    const fetchChildrenData = async () => {
      if (user?.id) {
        try {
          const data = await childService.fetchChildren(user.id);
          setChildren(data);
          if (data.length > 0) setSelectedChildId(data[0].id);
        } catch (err) {
          console.error("Error fetching children:", err);
        }
      }
    };
    fetchChildrenData();
  }, [user]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await bookingService.createBooking({
        parent_id: user.id,
        provider_id: parseInt(id),
        child_id: selectedChildId,
        booking_date: formData.date,
        start_time: formData.startTime,
        notes: formData.notes,
        status: 'pending'
      });
      setStep(3); // Success step
    } catch (err) {
      setError("Failed to create booking. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark ios-container pb-12">
      {/* Header */}
      <header className="py-6 flex items-center px-4 sticky top-0 bg-app-bg/80 dark:bg-app-bg-dark/80 backdrop-blur-xl z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full mr-2"
        >
          <ChevronLeft size={24} className="text-primary" />
        </button>
        <h1 className="text-xl font-black text-text-primary dark:text-text-primary-dark">
          {isVisit ? 'Book a Visit' : `Book ${providerType}`}
        </h1>
      </header>

      <main className="px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 mt-4"
            >
              <div className="bg-app-surface dark:bg-app-surface-dark p-6 rounded-[32px] border border-black/5 shadow-sm">
                <h2 className="text-sm font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Booking for</h2>
                <p className="text-2xl font-black text-text-primary dark:text-text-primary-dark leading-tight">{providerName}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{providerType}</span>
                </div>
              </div>

              {/* Child Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-text-secondary uppercase tracking-widest px-1">Select Child</h3>
                <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex-shrink-0 flex items-center space-x-3 p-3 pr-6 rounded-2xl transition-all border ${selectedChildId === child.id ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-app-surface-dark border-black/5'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedChildId === child.id ? 'bg-white/20' : 'bg-primary/10'}`}>
                        <User size={18} className={selectedChildId === child.id ? 'text-white' : 'text-primary'} />
                      </div>
                      <span className={`text-sm font-black ${selectedChildId === child.id ? 'text-white' : 'text-text-primary dark:text-text-primary-dark'}`}>
                        {child.name}
                      </span>
                      {selectedChildId === child.id && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                  <button 
                    onClick={() => navigate('/children')}
                    className="flex-shrink-0 w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-dashed border-black/10"
                  >
                    <span className="text-xl text-text-secondary">+</span>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-text-secondary uppercase tracking-widest px-1">Choose Date</h3>
                  <div className="p-1 bg-white dark:bg-app-surface-dark rounded-[24px] shadow-sm border border-black/5 overflow-hidden">
                    <input 
                      type="date" 
                      className="w-full p-4 bg-transparent focus:outline-none font-bold text-text-primary dark:text-text-primary-dark"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-text-secondary uppercase tracking-widest px-1">Select Time</h3>
                  <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({...formData, startTime: time})}
                        className={`flex-shrink-0 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.startTime === time ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-app-surface-dark text-text-secondary border border-black/5'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <PrimaryButton 
                  title="Continue to Notes" 
                  onClick={() => setStep(2)} 
                  disabled={!formData.date || !formData.startTime || !selectedChildId}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 mt-4"
            >
              <div className="space-y-4">
                <label className="text-sm font-black text-text-secondary uppercase tracking-widest px-1">Special Requirements / Notes</label>
                <div className="relative group">
                  <div className="absolute left-4 top-5 text-text-secondary/50 group-focus-within:text-primary transition-colors">
                    <MessageSquare size={18} />
                  </div>
                  <textarea 
                    className="w-full pl-12 pr-4 py-5 bg-white dark:bg-app-surface-dark rounded-[32px] border border-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium min-h-[180px]"
                    placeholder="Tell us about your child's needs, allergies, or any specific questions you have..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-4 rounded-2xl">{error}</p>}

              <div className="flex space-x-3 pt-6">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 h-16 bg-black/5 dark:bg-white/5 rounded-[24px] text-text-primary dark:text-text-primary-dark font-black text-sm uppercase tracking-widest"
                >
                  Back
                </button>
                <div className="flex-[2]">
                  <PrimaryButton 
                    title={isLoading ? "Booking..." : "Confirm Booking"} 
                    onClick={handleSubmit} 
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 px-6 bg-white dark:bg-app-surface-dark rounded-[40px] shadow-2xl border border-black/5 text-center space-y-8 mt-8 relative overflow-hidden"
            >
              {/* Confetti decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-green-400 to-purple-500" />
              
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <CheckCircle2 size={56} className="text-green-500" />
                </motion.div>
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-green-500/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-text-primary dark:text-text-primary-dark tracking-tight">Booking Sent!</h2>
                <div className="p-4 bg-green-50 dark:bg-green-500/5 rounded-2xl border border-green-100 dark:border-green-500/10">
                  <p className="text-sm text-green-700 dark:text-green-400 font-bold leading-relaxed">
                    Your request has been sent to <span className="underline decoration-2">{providerName}</span>. 
                    They will review it and update you shortly.
                  </p>
                </div>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark font-medium px-4">
                  A confirmation email will be sent to <span className="text-text-primary font-bold">{user?.email}</span> once approved.
                </p>
              </div>

              <div className="pt-4">
                <PrimaryButton title="Great! Take me Home" onClick={() => navigate('/parent/dashboard')} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BookingFormView;
