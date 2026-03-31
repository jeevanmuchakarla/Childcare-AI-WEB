import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpSupportView = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I find a verified childcare?",
      answer: "You can browse verified providers on the Discovery page. Look for the green 'Verified' badge on their profiles."
    },
    {
      id: 2,
      question: "Is my data safe?",
      answer: "Yes, all personal data and child records are encrypted end-to-end and stored securely on our servers."
    },
    {
      id: 3,
      question: "How do real-time updates work?",
      answer: "Childcare centers use their Provider dashboard to log meals, naps, and activities. These updates are pushed instantly to your Children tab."
    },
    {
      id: 4,
      question: "What is the 'Go' button for?",
      answer: "The 'Go' button allows quick access to high-priority actions or AI-driven recommendations from your dashboard."
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-20">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 -ml-2 rounded-full relative z-50 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft size={28} className="text-[#FF3B30]" strokeWidth={2.5} />
        </button>
      </header>

      <main className="px-4 py-2">
        {/* Contact Us Section */}
        <div className="mb-8">
          <h2 className="text-[13px] font-bold text-gray-500 dark:text-gray-400 pl-4 mb-2 uppercase tracking-wide">
            Contact Us
          </h2>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[10px] overflow-hidden">
            <a 
              href="mailto:jeevankiran14341@gmail.com"
              className="w-full flex items-center p-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
            >
              <Mail size={20} className="text-[#FF3B30] mr-3" />
              <span className="text-[16px] font-medium text-[#FF3B30]">
                jeevankiran14341@gmail.com
              </span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-[13px] font-bold text-gray-500 dark:text-gray-400 pl-4 mb-2 uppercase tracking-wide">
            FAQ
          </h2>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[10px] overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={faq.id}>
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors bg-white dark:bg-[#1C1C1E]"
                >
                  <span className="text-[16px] font-medium text-black dark:text-white text-left pr-4">
                    {faq.question}
                  </span>
                  {openFaq === faq.id ? (
                    <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-[#1C1C1E]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider except last item */}
                {index !== faqs.length - 1 && (
                  <div className="pl-4">
                    <div className="h-px bg-gray-200 dark:bg-gray-800" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpSupportView;
