import React from 'react';
import { motion } from 'framer-motion';

const PrimaryButton = ({ title, onClick, disabled, isLoading, className = "" }) => {
  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02, opacity: 0.9 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full h-[56px] flex items-center justify-center rounded-app font-bold text-white
        bg-primary shadow-premium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        title
      )}
    </motion.button>
  );
};

export default PrimaryButton;
