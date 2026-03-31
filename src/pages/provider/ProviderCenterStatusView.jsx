import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, DoorOpen, DoorClosed, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const ProviderCenterStatusView = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState('open'); // open, closed, special
  const [message, setMessage] = useState('');

  const handleUpdate = () => {
    // In a real app we'd trigger API call
    alert("Center status updated successfully");
    navigate(`/${user?.role?.toLowerCase()}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-32">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate(`/${user?.role?.toLowerCase()}/dashboard`)}
          className="p-2 -ml-2 rounded-full active:scale-90 transition-all"
        >
          <ChevronLeft size={28} className="text-[#FF3B30]" strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-bold text-black dark:text-white flex-1 text-center -ml-8">
          Center Status
        </h1>
      </header>

      <main className="px-5 py-4 space-y-6">
        <div>
          <h2 className="text-[20px] font-bold text-black dark:text-white mb-1">
            Operational Status
          </h2>
          <p className="text-[14px] text-gray-500 dark:text-gray-400">
            Update your center's availability for parents
          </p>
        </div>

        <div className="space-y-3">
          {/* Card: Open */}
          <button 
            onClick={() => setStatus('open')}
            className={`w-full flex items-center justify-between p-5 rounded-[20px] transition-all border ${
              status === 'open' 
                ? 'bg-[#FF3B30] border-[#FF3B30] text-white shadow-md' 
                : 'bg-white dark:bg-[#1C1C1E] border-transparent'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                status === 'open' ? 'bg-white/20' : 'bg-[#FF3B30]/10 text-[#FF3B30]'
              }`}>
                <DoorOpen size={20} />
              </div>
              <div className="text-left">
                <h3 className={`text-[17px] font-bold leading-tight ${status === 'open' ? 'text-white' : 'text-black dark:text-white'}`}>Open</h3>
                <p className={`text-[13px] font-medium mt-0.5 ${status === 'open' ? 'text-white/80' : 'text-gray-400'}`}>Currently accepting children</p>
              </div>
            </div>
            {status === 'open' && <CheckCircle2 size={24} className="text-white fill-white/20" />}
          </button>

          {/* Card: Closed */}
          <button 
            onClick={() => setStatus('closed')}
            className={`w-full flex items-center justify-between p-5 rounded-[20px] transition-all border ${
              status === 'closed' 
                ? 'bg-[#FF3B30] border-[#FF3B30] text-white shadow-md' 
                : 'bg-white dark:bg-[#1C1C1E] border-transparent'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                status === 'closed' ? 'bg-white/20' : 'bg-[#FF3B30]/10 text-[#FF3B30]'
              }`}>
                <DoorClosed size={20} />
              </div>
              <div className="text-left">
                <h3 className={`text-[17px] font-bold leading-tight ${status === 'closed' ? 'text-white' : 'text-black dark:text-white'}`}>Closed</h3>
                <p className={`text-[13px] font-medium mt-0.5 ${status === 'closed' ? 'text-white/80' : 'text-gray-400'}`}>Not operating at this time</p>
              </div>
            </div>
            {status === 'closed' && <CheckCircle2 size={24} className="text-white fill-white/20" />}
          </button>

          {/* Card: Special Event */}
          <button 
            onClick={() => setStatus('special')}
            className={`w-full flex items-center justify-between p-5 rounded-[20px] transition-all border ${
              status === 'special' 
                ? 'bg-[#FF3B30] border-[#FF3B30] text-white shadow-md' 
                : 'bg-white dark:bg-[#1C1C1E] border-transparent'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                status === 'special' ? 'bg-white/20' : 'bg-[#FF9500]/10 text-[#FF9500]'
              }`}>
                <Star size={20} />
              </div>
              <div className="text-left">
                <h3 className={`text-[17px] font-bold leading-tight ${status === 'special' ? 'text-white' : 'text-black dark:text-white'}`}>Special Event</h3>
                <p className={`text-[13px] font-medium mt-0.5 ${status === 'special' ? 'text-white/80' : 'text-gray-400'}`}>Special schedule or event in progress</p>
              </div>
            </div>
            {status === 'special' && <CheckCircle2 size={24} className="text-white fill-white/20" />}
          </button>
        </div>

        <div className="pt-2">
          <label className="block text-[14px] font-bold text-black dark:text-white mb-2 ml-1">
            Status Message (Optional)
          </label>
          <input 
            type="text" 
            placeholder="e.g. Back to normal tomorrow" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/5 rounded-[16px] px-5 py-4 text-[16px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#FF3B30]/20 transition-all font-medium placeholder-gray-400"
          />
        </div>

        <div className="pt-6">
          <button 
            onClick={handleUpdate}
            className="w-full bg-[#FF3B30] text-white rounded-[20px] py-4 flex flex-col items-center justify-center text-[17px] font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Update Status
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProviderCenterStatusView;
