import React from 'react';
import { Star, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProviderCard = ({ provider, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex flex-col bg-app-surface dark:bg-app-surface-dark rounded-[24px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] overflow-hidden transition-all duration-200"
    >
      <div className="flex p-5 w-full">
        {/* Mock Image Placeholder */}
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
          <img 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${provider.center_name}&backgroundColor=00A3FF&textColor=ffffff`} 
            alt={provider.center_name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col items-start text-left">
          <div className="flex items-center justify-between w-full mb-1">
            <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark truncate">
              {provider.center_name}
            </h3>
            <div className="flex items-center space-x-1 text-yellow-500 ml-2">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-bold">{provider.rating || '5.0'}</span>
            </div>
          </div>

          <div className="flex items-center text-text-secondary dark:text-text-secondary-dark text-xs mb-3 font-medium">
            <MapPin size={12} className="mr-1" />
            <span className="truncate">{provider.address || 'Location Hidden'}</span>
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
              {provider.type}
            </span>
            <span className="text-sm font-black text-primary">
              {provider.monthly_price || provider.hourly_rate || 'Contact for Price'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between">
        <span className="text-[10px] font-bold text-text-secondary dark:text-text-secondary-dark/60 uppercase">
          {provider.review_count || 0} Reviews
        </span>
        <div className="flex items-center text-primary text-[10px] font-bold uppercase tracking-widest">
          View Details
          <ChevronRight size={12} className="ml-1" />
        </div>
      </div>
    </motion.button>
  );
};

export default ProviderCard;
