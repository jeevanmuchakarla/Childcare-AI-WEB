import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const SplashView = () => {
  const navigate = useNavigate();
  const [scale, setScale] = useState(0.8);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => {
      setScale(1.0);
      setOpacity(1);
    }, 100);

    // Navigate to welcome carousel after 3 seconds
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between items-center py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950 pointer-events-none" />
      
      <div /> {/* Spacer equivalent */}

      <div 
        className="flex flex-col items-center justify-center space-y-6 z-10 transition-all duration-1000 ease-out"
        style={{ transform: `scale(${scale})`, opacity: opacity }}
      >
        {/* Mock BabyDancingAnimation (Using simple SVG bouncing for web parity) */}
        <div className="relative w-40 h-40 flex justify-center items-center mb-6">
          <div className="absolute w-28 h-32 bg-white rounded-[40px] shadow-lg animate-bounce" style={{ animationDuration: '1.2s' }}>
            {/* Simple face */}
            <div className="flex justify-center space-x-4 pt-8">
              <div className="w-3 h-3 bg-slate-800 rounded-full" />
              <div className="w-3 h-3 bg-slate-800 rounded-full" />
            </div>
            <div className="flex justify-center mx-auto mt-4 w-10 h-4 border-b-4 border-red-400 rounded-full" />
          </div>
          {/* Sparkles */}
          <Sparkles className="absolute top-0 right-0 text-yellow-400 animate-pulse" size={24} />
          <Sparkles className="absolute top-4 left-2 text-yellow-400 animate-pulse delay-150" size={16} />
        </div>

        <div className="bg-white dark:bg-app-surface-dark px-6 py-3 rounded-xl shadow-md border border-black/5 dark:border-white/5">
          <h1 className="text-[28px] font-bold text-slate-800 dark:text-white">
            ChildCare AI™
          </h1>
        </div>

        <p className="text-white/70 text-sm font-medium tracking-wide">
          AI-Powered Childcare Discovery
        </p>
      </div>

      <div className="flex flex-col items-center space-y-3 mt-auto z-10">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
          Initializing AI Core...
        </p>
      </div>
    </div>
  );
};

export default SplashView;
