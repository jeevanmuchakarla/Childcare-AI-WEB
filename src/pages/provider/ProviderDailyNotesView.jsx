import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Camera } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const ProviderDailyNotesView = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [note, setNote] = useState("");

  const handlePost = () => {
    if (!note.trim()) return;
    alert("Note posted!");
    setNote("");
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-28">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate(`/${user?.role?.toLowerCase()}/dashboard`)}
          className="p-2 -ml-2 rounded-full active:scale-90 transition-all"
        >
          <ChevronLeft size={28} className="text-[#FF3B30]" strokeWidth={2.5} />
        </button>
      </header>

      <main className="px-5 py-4 space-y-8">
        {/* New Note Card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none border border-black/[0.02] dark:border-white/[0.02]">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="w-[28px] h-[28px] rounded-lg bg-[#FF3B30]/10 flex items-center justify-center">
              <FileText size={16} className="text-[#FF3B30]" strokeWidth={2.5} />
            </div>
            <h2 className="text-[17px] font-bold text-black dark:text-white">New Note</h2>
          </div>

          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note for parents..."
            className="w-full h-[120px] bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px] p-4 text-[15px] text-black dark:text-white placeholder-gray-400 outline-none resize-none mb-4"
          />

          <div className="flex items-center justify-between">
            <button className="w-[46px] h-[46px] rounded-[14px] border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
              <Camera size={22} strokeWidth={2} />
            </button>
            <button 
              onClick={handlePost}
              className={`px-8 h-[46px] rounded-[14px] font-bold text-[15px] transition-all ${
                note.trim() 
                  ? 'bg-[#FF3B30] text-white shadow-md active:scale-95' 
                  : 'bg-[#FF3B30]/50 text-white cursor-not-allowed'
              }`}
            >
              Post Note
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex justify-center pt-8">
          <p className="text-[15px] font-medium text-gray-400">
            No notes posted yet.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProviderDailyNotesView;
