import React, { useState, useEffect } from 'react';
import { ChevronLeft, Cpu, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminAIEfficiencyView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-28">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E] rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} className="text-[#FF3B30] -ml-1" strokeWidth={2.5} />
        </button>
        <h1 className="text-[20px] font-bold text-black dark:text-white tracking-tight ml-4 flex-1">
          AI Efficiency
        </h1>
      </header>

      <main className="px-5 space-y-4 pt-4">
        {/* Match Accuracy Gradient Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] overflow-hidden p-6 relative shadow-[0_8px_30px_rgba(175,82,222,0.25)]"
          style={{ background: 'linear-gradient(135deg, #8A2BE2 0%, #AF52DE 100%)' }}
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Cpu size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col text-white">
              <h3 className="text-[16px] font-bold tracking-tight">Match Accuracy</h3>
              <p className="text-[12px] font-medium text-white/70 mt-0.5">Based on user acceptance</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[42px] font-black text-white leading-none tracking-tight">94%</span>
            <div className="px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-md">
              <span className="text-[12px] font-bold text-white tracking-tight">+ 2.4%</span>
            </div>
          </div>
        </motion.div>

        {/* Small Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02]">
            <p className="text-[12px] font-bold text-gray-500 mb-2">Avg Response</p>
            <p className="text-[20px] font-bold text-black dark:text-white tracking-tight">1.2s</p>
          </div>
          <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02]">
            <p className="text-[12px] font-bold text-gray-500 mb-2">Queries/Day</p>
            <p className="text-[20px] font-bold text-black dark:text-white tracking-tight">15.4k</p>
          </div>
        </div>

        {/* AI Training & Optimization Card */}
        <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[32px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] mt-8">
          <h3 className="text-[17px] font-bold text-black dark:text-white tracking-tight mb-2 pt-1">AI Training & Optimization</h3>
          <p className="text-[13px] font-medium text-gray-500 leading-relaxed mb-6">
            Update the AI model using newly verified provider data and parent preference patterns to improve match accuracy.
          </p>

          <button className="w-full flex items-center justify-between bg-[#FF3B30] p-4 px-5 rounded-[20px] active:scale-[0.98] transition-transform shadow-sm mb-6">
            <span className="text-[16px] font-bold text-white tracking-tight">Train AI System</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight size={18} className="text-white" strokeWidth={2.5} />
            </div>
          </button>

          <div className="flex justify-between items-center text-[12px] font-medium">
            <div className="flex flex-col">
              <span className="text-gray-400">Last Trained</span>
              <span className="text-black dark:text-white font-bold mt-0.5">Today, 10:45 AM</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-gray-400">Dataset Size</span>
              <span className="text-black dark:text-white font-bold mt-0.5">1,248 Verified Points</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAIEfficiencyView;
