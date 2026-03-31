import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, AlertTriangle, FileText, Phone, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import childService from '../../services/childService';

const ChildProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChild = async () => {
      setIsLoading(true);
      if (user?.id) {
        try {
          const children = await childService.fetchChildren(user.id);
          const found = children.find(c => c.id === parseInt(id));
          if (found) setChild(found);
        } catch (error) {
          console.error("Error fetching child:", error);
        }
      }
      setIsLoading(false);
    };
    loadChild();
  }, [id, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark ios-container pb-20">
      {/* Dynamic Header Gradient */}
      <div className="relative h-[240px] w-full bg-gradient-to-b from-primary to-primary/60 overflow-hidden rounded-b-[48px] shadow-sm">
        <header className="absolute top-0 w-full pt-8 pb-4 flex flex-row items-center justify-between px-6 z-20">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all active:scale-95">
             <ChevronLeft size={22} className="text-white" />
          </button>
          
          <h1 className="text-lg font-black text-white uppercase tracking-widest opacity-90">Profile</h1>

          {user?.role === 'parent' ? (
             <button className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full font-black text-white text-[11px] uppercase tracking-widest backdrop-blur-md transition-all active:scale-95">
               Edit
             </button>
          ) : <div className="w-10" />}
        </header>

        <div className="absolute top-[90px] w-full flex flex-col items-center justify-center">
          <div className="w-[96px] h-[96px] rounded-[32px] bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-2xl backdrop-blur-md rotate-3">
             <span className="text-4xl font-black text-white -rotate-3">{child?.name?.charAt(0) || 'C'}</span>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-[28px] font-black text-white tracking-tighter leading-none">{child?.name || 'Child Profile'}</h2>
            <div className="flex items-center justify-center space-x-2 mt-2 text-white/70">
              <Calendar size={14} strokeWidth={2.5} />
              <span className="text-xs font-black uppercase tracking-widest">{child?.age || 'Age Not Set'}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 space-y-6 -mt-4 relative z-10">
        
        {/* Information Grid */}
        <div className="grid grid-cols-1 gap-4 px-2">
          {/* Important Info Card */}
          <div className="bg-white dark:bg-app-surface-dark p-6 rounded-[32px] shadow-sm border border-black/5 flex items-center space-x-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
               <Heart size={28} className="text-red-500 fill-red-500/20" />
            </div>
            <div className="flex-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Food Allergies</p>
               <h4 className="text-lg font-black text-text-primary dark:text-text-primary-dark leading-tight">
                 {child?.allergies || "No active allergies"}
               </h4>
            </div>
          </div>

          {/* Medical Notes Card */}
          <div className="bg-white dark:bg-app-surface-dark p-6 rounded-[32px] shadow-sm border border-black/5 flex items-center space-x-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
               <FileText size={28} className="text-blue-500" />
            </div>
            <div className="flex-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Medical History</p>
               <h4 className="text-lg font-black text-text-primary dark:text-text-primary-dark leading-tight">
                 {child?.medical_notes || "All records clear"}
               </h4>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="bg-white dark:bg-app-surface-dark p-6 rounded-[32px] shadow-sm border border-black/5 flex items-center space-x-6">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0">
               <Phone size={28} className="text-green-500" />
            </div>
            <div className="flex-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Emergency Contact</p>
               <h4 className="text-lg font-black text-text-primary dark:text-text-primary-dark leading-tight">
                 {child?.emergency_contact || "+1 234 567 890"}
               </h4>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ChildProfileView;
