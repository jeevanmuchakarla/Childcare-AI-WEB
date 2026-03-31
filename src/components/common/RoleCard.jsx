import React from 'react';
import { ChevronRight } from 'lucide-react';

const RoleCard = ({ title, subtitle, icon: Icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full h-[82px] p-5 bg-app-surface dark:bg-app-surface-dark rounded-app shadow-card border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div 
        className="flex items-center justify-center w-12 h-12 rounded-full mr-4"
        style={{ backgroundColor: `${color}26` }} // 15% opacity hex
      >
        <Icon size={20} style={{ color: color }} />
      </div>
      
      <div className="flex flex-col items-start text-left flex-1 min-w-0">
        <h3 className="text-base font-bold text-text-primary dark:text-text-primary-dark truncate w-full">
          {title}
        </h3>
        <p className="text-xs text-text-secondary dark:text-text-secondary-dark truncate w-full">
          {subtitle}
        </p>
      </div>
      
      <ChevronRight size={14} className="text-gray-400 opacity-50 ml-2" />
    </button>
  );
};

export default RoleCard;
