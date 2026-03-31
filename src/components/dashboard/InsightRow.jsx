import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const InsightRow = ({ title, sub, icon: Icon, color, onClick }) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className="w-full flex items-center p-4 bg-app-surface dark:bg-app-surface-dark rounded-2xl shadow-sm border border-black/[0.03] dark:border-white/[0.03] transition-all duration-200"
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={20} style={{ color: color }} />
      </div>
      
      <div className="flex flex-col items-start truncate flex-1">
        <h4 className="text-base font-bold text-text-primary dark:text-text-primary-dark truncate w-full">
          {title}
        </h4>
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark truncate w-full font-medium">
          {sub}
        </p>
      </div>
      
      <ChevronRight size={14} className="text-gray-400/50 ml-2" />
    </motion.button>
  );
};

export default InsightRow;
