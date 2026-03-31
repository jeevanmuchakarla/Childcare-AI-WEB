import React from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({ title, count, subtitle, icon: Icon, color, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-1 flex flex-col items-center p-5 bg-app-surface dark:bg-app-surface-dark rounded-3xl shadow-md border border-black/5 dark:border-white/5 transition-all duration-200"
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={20} style={{ color: color }} />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-base font-bold text-text-primary dark:text-text-primary-dark">
          {title}
        </h3>
        <p className="text-xs text-text-secondary dark:text-text-secondary-dark font-medium">
          {subtitle || `${count} Available`}
        </p>
      </div>
    </motion.button>
  );
};

export default CategoryCard;
