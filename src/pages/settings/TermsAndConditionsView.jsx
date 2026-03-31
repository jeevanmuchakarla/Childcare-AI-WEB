import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TermsAndConditionsView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black ios-container pb-20">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 -ml-2 rounded-full relative z-50 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft size={28} className="text-[#FF3B30]" strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-bold text-black dark:text-white flex-1 text-center -ml-8 pointer-events-none">
          Terms & Conditions
        </h1>
      </header>

      <main className="px-6 py-6">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-black dark:text-white tracking-tight mb-2">
            Terms & Conditions
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400">
            Last updated: March 2026
          </p>
        </div>

        <div className="space-y-6 text-[#1C1C1E] dark:text-[#E5E5EA] text-[16px] leading-[1.6]">
          <p>
            Welcome to ChildCare AI. By using this application, you agree to the following terms:
          </p>

          <div>
            <h2 className="text-[18px] font-bold text-black dark:text-white mb-2">
              1. Service Purpose
            </h2>
            <p>
              ChildCare AI is a platform connecting parents with childcare providers. We facilitate bookings, communication, and real-time updates but do not provide childcare services directly.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-black dark:text-white mb-2">
              2. User Responsibilities
            </h2>
            <p>
              Users must provide accurate information. Parents are responsible for verifying provider credentials, although we provide verification badges for convenience.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-black dark:text-white mb-2">
              3. Real-time Data
            </h2>
            <p>
              Daily reports and activities are provided by childcare centers. We ensure the secure transmission of this data but are not ultimately responsible for content inaccuracies submitted by providers.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditionsView;
