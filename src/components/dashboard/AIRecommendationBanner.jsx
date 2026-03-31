import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AIRecommendationBanner = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full relative group p-8 rounded-[38px] text-white overflow-hidden text-left border border-white/20 transition-all active:shadow-inner"
      style={{
        background: 'linear-gradient(135deg, var(--primary), var(--gradient-to))',
        boxShadow: '0 15px 35px rgba(var(--primary-rgb), 0.35)'
      }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
      
      <div className="relative z-10 flex items-center">
        <div className="bg-white/20 backdrop-blur-md p-5 rounded-[22px] mr-6 shadow-lg border border-white/10">
          <Sparkles size={38} className="text-white fill-white/20" />
        </div>

        <div className="flex-1">
          <h2 className="text-[32px] font-black tracking-tighter leading-none mb-1.5 drop-shadow-sm">ChildCare AI</h2>
          <p className="text-[15px] font-bold text-white/90 leading-tight">Get instant matches & expert advice</p>
        </div>

        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 ml-4 group-hover:bg-white/20 transition-colors">
          <ChevronRight size={22} className="text-white" strokeWidth={3} />
        </div>
      </div>
    </motion.button>
  );
};

export default AIRecommendationBanner;
