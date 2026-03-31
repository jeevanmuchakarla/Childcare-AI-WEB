import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck } from 'lucide-react';

const pages = [
  {
    title: "Intelligent Matching",
    description: "Finding the perfect childcare is easier than ever with AI-driven recommendations tailored to your child's needs.",
    color: "#007AFF" // Blue
  },
  {
    title: "Comprehensive Care",
    description: "Whether you're a parent seeking education or a center managing growth, ChildCare AI streamlines every interaction.",
    color: "#34C759" // Green
  },
  {
    title: "Safety & Peace of Mind",
    description: "Verified providers, real-time updates, and secure communication ensure peace of mind for every family.",
    color: "#AF52DE" // Purple
  }
];

const WelcomeCarousel = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Navigate to role selection after onboarding carousel
    navigate('/roles');
  };

  const page = pages[currentPage];

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark flex flex-col items-center overflow-hidden">
      {/* Top Bar with Skip */}
      <div className="w-full flex justify-end p-6">
        <button 
          onClick={handleComplete}
          className="font-bold text-primary opacity-80 active:scale-95 transition-transform"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-sm px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-centertext-center w-full"
          >
            {/* Animated Icon Container */}
            <div className="mb-10 relative flex justify-center w-full text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg"
                style={{ 
                  backgroundColor: page.color,
                  boxShadow: `0 10px 25px ${page.color}60`
                }}
              >
                {currentPage === 0 && (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12h.01M15 12h.01M10 16c.5.5 1.5.5 2 0M21 12A9 9 12 0 1 12 3a9 9 12 0 1 9 9Z" />
                  </svg>
                )}
                {currentPage === 1 && <Users size={32} color="white" />}
                {currentPage === 2 && <ShieldCheck size={32} color="white" />}
              </motion.div>
            </div>

            <h2 className="text-[24px] font-bold text-text-primary dark:text-text-primary-dark text-center mb-4 min-h-[64px] flex items-end justify-center">
              {page.title}
            </h2>
            
            <p className="text-text-secondary dark:text-text-secondary-dark text-center leading-relaxed h-[80px]">
              {page.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page Indicators */}
      <div className="flex space-x-2 mb-10">
        {pages.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentPage 
                ? 'w-6 bg-primary' 
                : 'w-2 bg-text-secondary/20'
            }`}
          />
        ))}
      </div>

      {/* Bottom Action */}
      <div className="w-full px-8 pb-12 block">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white font-bold tracking-wide active:scale-95 transition-transform"
        >
          {currentPage === pages.length - 1 ? "Get Started" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default WelcomeCarousel;
