import React from 'react';
import { User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ChildProfileCard = ({ name, age, provider = "Daycare Center", onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center p-5 bg-app-surface dark:bg-app-surface-dark rounded-[24px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] text-left transition-all duration-200"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
        <User size={30} className="text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-black text-text-primary dark:text-text-primary-dark truncate tracking-tight">
          {name}
        </h3>
        <div className="flex items-center space-x-2 mt-1.5">
          <span className="text-sm font-bold text-text-secondary dark:text-text-secondary-dark">
            {age}
          </span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
            Active Update
          </span>
        </div>
      </div>
      
      <ChevronRight size={14} className="text-gray-400 opacity-40 ml-2" />
    </motion.button>
  );
};

export default ChildProfileCard;
