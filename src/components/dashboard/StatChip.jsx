import React from 'react';

const StatChip = ({ title, value, color, icon: Icon }) => {
  return (
    <div className="flex-1 flex flex-col items-center p-3 bg-app-surface dark:bg-app-surface-dark rounded-2xl shadow-sm border border-black/5 dark:border-white/5 min-w-0">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={16} style={{ color: color }} />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm font-bold text-text-primary dark:text-text-primary-dark truncate w-full text-center">
          {value}
        </span>
        <span className="text-[10px] font-medium text-text-secondary dark:text-text-secondary-dark truncate w-full text-center">
          {title}
        </span>
      </div>
    </div>
  );
};

export default StatChip;
