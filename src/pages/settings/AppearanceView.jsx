import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AppearanceView = () => {
  const navigate = useNavigate();
  const { primaryColor, setPrimaryColor, gradientTo, setGradientTo } = useTheme();
  const [activeTab, setActiveTab] = useState('combinations');
  
  const solidPresets = [
    { id: "azure", name: "Azure Blue", hex: "#007AFF" },
    { id: "mint", name: "Mint Green", hex: "#34C759" },
    { id: "lavender", name: "Lavender", hex: "#AF52DE" },
    { id: "coral", name: "Coral Red", hex: "#FF3B30" },
    { id: "sunset", name: "Sunset", hex: "#FF9500" },
    { id: "stealth", name: "Stealth", hex: "#1C1C1E" },
    { id: "prussian", name: "Prussian", hex: "#FF2D55" },
    { id: "tropical", name: "Tropical", hex: "#5AC8FA" },
    { id: "indigo", name: "Indigo Night", hex: "#5E5CE6" },
    { id: "emerald", name: "Emerald", hex: "#32ADE0" },
    { id: "ruby", name: "Ruby Red", hex: "#D6336C" },
    { id: "sapphire", name: "Sapphire", hex: "#00A3FF" },
  ];

  const combinationPresets = [
    { id: "ocean", name: "Ocean Breeze", hex: "#00A3FF", gradientTo: "#34C759", isGradient: true },
    { id: "dusk", name: "Dusk Sky", hex: "#7D61FF", gradientTo: "#5A3FE0", isGradient: true },
    { id: "peach", name: "Peach Glow", hex: "#FF9500", gradientTo: "#FF2D55", isGradient: true },
    { id: "neon", name: "Neon Lights", hex: "#AF52DE", gradientTo: "#FF2D55", isGradient: true },
    { id: "berry", name: "Berry Burst", hex: "#D6336C", gradientTo: "#5E5CE6", isGradient: true },
    { id: "forest", name: "Deep Forest", hex: "#32ADE0", gradientTo: "#34C759", isGradient: true },
  ];

  const handleSelect = (preset) => {
    setPrimaryColor(preset.hex);
    if (preset.isGradient) {
      setGradientTo(preset.gradientTo);
    } else {
      setGradientTo(preset.hex); // Same color makes it solid
    }
  };

  const isActive = (preset) => {
    if (preset.isGradient) {
      return primaryColor === preset.hex && gradientTo === preset.gradientTo;
    }
    return primaryColor === preset.hex && gradientTo === preset.hex;
  };

  const visiblePresets = activeTab === 'combinations' ? combinationPresets : solidPresets;

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-20">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 -ml-2 rounded-full relative z-50 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft size={28} style={{ color: primaryColor }} strokeWidth={2.5} />
        </button>
      </header>

      <main className="px-4 pt-2">
        <div className="mb-6">
          <h1 className="text-[28px] font-black text-black dark:text-white tracking-tight mb-2">
            Choose Your Theme
          </h1>
          <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400 mb-6">
            Select a color palette that fits your style
          </p>
          
          <div className="flex p-1 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl max-w-[240px]">
            <button
              onClick={() => setActiveTab('combinations')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'combinations' ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Combinations
            </button>
            <button
              onClick={() => setActiveTab('solid')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'solid' ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Solid Colors
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-6 shadow-sm border border-black/5 dark:border-white/5">
          <div className="grid grid-cols-3 gap-y-8 gap-x-2 pb-2">
            {visiblePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelect(preset)}
                className="flex flex-col items-center group relative"
              >
                <div 
                  className={`w-[60px] h-[60px] rounded-full mb-3 flex items-center justify-center transition-all ${
                    isActive(preset) ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1C1C1E] scale-105' : 'hover:scale-105 opacity-90 hover:opacity-100'
                  }`}
                  style={{ 
                    background: preset.isGradient ? `linear-gradient(135deg, ${preset.hex}, ${preset.gradientTo})` : preset.hex,
                    borderColor: isActive(preset) ? preset.hex : 'transparent'
                  }}
                >
                  {isActive(preset) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={26} className="text-white drop-shadow-md" strokeWidth={3.5} />
                    </motion.div>
                  )}
                </div>
                <span className={`text-[12px] font-bold text-center px-1 leading-tight tracking-wide ${
                  isActive(preset) ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppearanceView;

