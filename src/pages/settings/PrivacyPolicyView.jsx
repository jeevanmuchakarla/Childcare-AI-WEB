import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

const PrivacyPolicyView = () => {
  const navigate = useNavigate();

  const dataCollected = [
    "Personal information (name, email, phone)",
    "Child profiles (names, birthdays, allergies)",
    "Real-time activity logs and photos",
    "Booking history and payment records"
  ];

  const dataUsage = [
    "Facilitate bookings with providers",
    "Deliver real-time daily updates to parents",
    "Provide AI-powered childcare recommendations",
    "Improve safety through verification processes"
  ];

  const dataProtection = [
    "End-to-end data encryption",
    "Strict access controls for providers",
    "Regular security audits"
  ];

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
          Privacy Policy
        </h1>
      </header>

      <main className="px-6 py-6">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-black dark:text-white tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400">
            Last updated: March 2026
          </p>
        </div>

        <div className="space-y-8 text-[#1C1C1E] dark:text-[#E5E5EA] text-[16px]">
          <p className="leading-[1.6]">
            At ChildCare AI, we take your privacy 100% seriously. Your data is safely stored and industry-standard encrypted.
          </p>

          <div>
            <h2 className="text-[18px] font-bold text-black dark:text-white mb-4">
              Data We Collect
            </h2>
            <div className="space-y-3">
              {dataCollected.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 size={20} className="text-[#34C759] mt-0.5 flex-shrink-0" />
                  <span className="leading-snug text-[15px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-black dark:text-white mb-4">
              How We Use Data
            </h2>
            <div className="space-y-3">
              {dataUsage.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 size={20} className="text-[#34C759] mt-0.5 flex-shrink-0" />
                  <span className="leading-snug text-[15px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-black dark:text-white mb-4">
              Data Protection
            </h2>
            <div className="space-y-3">
              {dataProtection.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 size={20} className="text-[#34C759] mt-0.5 flex-shrink-0" />
                  <span className="leading-snug text-[15px]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyView;
