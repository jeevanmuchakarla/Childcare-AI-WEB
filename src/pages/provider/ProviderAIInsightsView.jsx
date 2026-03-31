import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, BarChart2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const ProviderAIInsightsView = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-20">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate(`/${user?.role?.toLowerCase()}/dashboard`)}
          className="p-2 -ml-2 rounded-full active:scale-90 transition-all"
        >
          <ChevronLeft size={28} className="text-[#FF3B30]" strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-bold text-black dark:text-white flex-1 text-center -ml-8">
          AI Insights
        </h1>
      </header>

      <main className="px-5 py-2 space-y-4">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-5 shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex items-center space-x-4">
          <div className="w-[50px] h-[50px] rounded-full bg-[#FF2D55] flex items-center justify-center shadow-sm">
            <Sparkles size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#FF2D55]">ChildCare AI</h2>
            <p className="text-[13px] font-medium text-gray-400">Smart Recommendations</p>
          </div>
        </div>

        {/* Insight 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-6 shadow-sm border border-black/[0.02] dark:border-white/[0.02]"
        >
          <div className="flex items-center space-x-3 mb-3">
            <BarChart2 size={22} className="text-[#FF3B30]" strokeWidth={2.5} />
            <h3 className="text-[17px] font-bold text-black dark:text-white">Occupancy Peak</h3>
          </div>
          <p className="text-[15px] text-[#1C1C1E] dark:text-[#E5E5EA] leading-relaxed">
            Your center is 95% full on Tuesdays. Consider offering a 'Tuesday Special' for remaining spots.
          </p>
        </motion.div>

        {/* Insight 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-6 shadow-sm border border-black/[0.02] dark:border-white/[0.02]"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Heart size={22} className="text-[#FF3B30]" strokeWidth={2.5} />
            <h3 className="text-[17px] font-bold text-black dark:text-white">Parent Satisfaction</h3>
          </div>
          <p className="text-[15px] text-[#1C1C1E] dark:text-[#E5E5EA] leading-relaxed">
            Recent feedback indicates high satisfaction with the 'Art &amp; Craft' sessions. Keep it up!
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default ProviderAIInsightsView;
