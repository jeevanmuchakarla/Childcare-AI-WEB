import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const ProviderParentStatusView = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const parents = [
    { id: 1, name: "Jeevan Muchakarla", lastSeen: "Recently", status: "Active", initial: "J" }
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-28">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate(`/${user?.role?.toLowerCase()}/dashboard`)}
          className="p-2 -ml-2 rounded-full active:scale-90 transition-all"
        >
          <ChevronLeft size={28} className="text-[#FF3B30]" strokeWidth={2.5} />
        </button>
      </header>

      <main className="px-5 py-2 space-y-4">
        {parents.map((parent, idx) => (
          <motion.div 
            key={parent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-5 shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-[46px] h-[46px] rounded-full bg-[#FF2D55]/10 flex items-center justify-center">
                <span className="text-[18px] font-bold text-[#FF2D55]">{parent.initial}</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-[17px] font-bold text-black dark:text-white leading-tight">
                  {parent.name}
                </h3>
                <span className="text-[13px] font-medium text-gray-400 mt-0.5">
                  Last seen: {parent.lastSeen}
                </span>
              </div>
            </div>
            
            <div className={`px-3 py-1.5 rounded-md text-[13px] font-bold ${
              parent.status === 'Active' ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-gray-100 text-gray-500'
            }`}>
              {parent.status}
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default ProviderParentStatusView;
