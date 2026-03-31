import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Sun, Heart, MessageCircle, ShieldCheck, CheckCircle2, Clock, Calendar, Star, Verified, Plus } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

const ProfileView = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = React.useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      alert("Profile photo updated locally! (Mock upload)");
    }
  };
  
  return (
    <div className="py-6 min-h-screen bg-app-bg dark:bg-app-bg-dark">
      {/* Header */}
      <header className="py-6 flex items-center justify-between px-4 sticky top-0 bg-app-bg/80 dark:bg-app-bg-dark/80 backdrop-blur-xl z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-app-surface-dark shadow-sm border border-black/5 dark:border-white/5 transition-transform active:scale-95"
        >
          <ChevronLeft size={24} className="text-text-primary dark:text-text-primary-dark" />
        </button>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-2 rounded-full shadow-sm border border-black/5 dark:border-white/5 text-sm font-black uppercase tracking-widest transition-all active:scale-95 ${
            isEditing ? 'bg-primary text-white' : 'bg-white dark:bg-app-surface-dark text-primary'
          }`}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </header>

      <main className="px-4 pb-20 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-[40px] shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white dark:border-app-bg-dark transition-all ${isEditing ? 'scale-105 ring-4 ring-primary/20' : ''}`}>
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <User size={48} className="text-primary" />
                </div>
              )}
            </div>
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-white dark:border-app-bg-dark hover:scale-110 transition-transform"
              >
                <Plus size={20} />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoChange} 
            />
          </div>
          
          <h2 className="text-3xl font-black text-text-primary dark:text-text-primary-dark mt-6 tracking-tighter">
            {user?.full_name || 'Jeevan Kiran'}
          </h2>
          <p className="text-sm font-black text-text-secondary uppercase tracking-[0.15em] mt-1 opacity-60">
            {user?.role === 'parent' ? 'Family Lead • 2 Children' : `${user?.role} • Verified Member`}
          </p>

          <div className="flex items-center space-x-3 mt-4">
            <div className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#FF9F0A]/10 rounded-full">
              <Star size={14} className="text-[#FF9F0A] fill-[#FF9F0A]" />
              <span className="text-xs font-black text-[#FF9F0A]">4.9</span>
            </div>
            <div className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#34C759]/10 rounded-full">
              <Verified size={14} className="text-[#34C759]" />
              <span className="text-xs font-black text-[#34C759]">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-text-secondary dark:text-text-secondary-dark uppercase tracking-widest px-1 flex items-center">
            <span className="mr-2">🏆</span> Achievements
          </h3>
          
          <div className="bg-white dark:bg-app-surface-dark p-6 rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] flex justify-between px-8">
            <AchievementBadge icon={Sun} color="#FF9F0A" label="Early Bird" />
            <AchievementBadge icon={Heart} color="#FF4D4D" label="Top Parent" />
            <AchievementBadge icon={MessageCircle} color="#007AFF" label="Responsive" />
          </div>
        </section>

        {/* Certificates & Safety */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-text-secondary dark:text-text-secondary-dark uppercase tracking-widest px-1 flex items-center">
            <ShieldCheck size={18} className="mr-2" /> Certificates & Safety
          </h3>
          <div className="bg-white dark:bg-app-surface-dark rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] overflow-hidden p-6 space-y-6">
            <CertificateRow 
              title="First Aid & CPR" 
              subtitle="Red Cross • Jan 2026" 
            />
            <div className="w-full h-px bg-black/[0.05] dark:bg-white/[0.05]" />
            <CertificateRow 
              title="Verified Identity" 
              subtitle="SafePass • Mar 2024" 
            />
          </div>
        </section>

        {/* Available Timings */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-text-secondary dark:text-text-secondary-dark uppercase tracking-widest px-1 flex items-center">
            <Clock size={16} className="mr-2" /> Available Timings
          </h3>
          <div className="bg-white dark:bg-app-surface-dark rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] overflow-hidden p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-text-primary dark:text-text-primary-dark">Typical Drop-off</h4>
              <span className="font-medium text-text-secondary px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-sm">08:15 AM</span>
            </div>
            <div className="w-full h-px bg-black/[0.05] dark:bg-white/[0.05]" />
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-text-primary dark:text-text-primary-dark">Typical Pick-up</h4>
              <span className="font-medium text-text-secondary px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-sm">05:30 PM</span>
            </div>
          </div>
        </section>

        {/* Contact & Info */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-text-secondary dark:text-text-secondary-dark uppercase tracking-widest px-1 flex items-center">
            <User size={16} className="mr-2" /> Contact & Info
          </h3>
          <div className="bg-white dark:bg-app-surface-dark rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] overflow-hidden p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Calendar size={18} className="text-text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Date of Birth</p>
                  <p className="font-bold text-text-primary dark:text-text-primary-dark text-sm mt-0.5">16 Mar 2026</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={logout}
          className="w-full text-center py-5 font-bold text-red-500 rounded-3xl bg-red-500/5 active:bg-red-500/10 transition-colors border border-red-500/10"
        >
          Logout from Account
        </button>

      </main>
    </div>
  );
};

const AchievementBadge = ({ icon: Icon, color, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-sm border border-black/[0.02]" style={{ backgroundColor: `${color}10` }}>
      <Icon size={28} style={{ color: color }} weight="fill" />
    </div>
    <span className="text-xs font-bold text-text-secondary">{label}</span>
  </div>
);

const CertificateRow = ({ title, subtitle }) => (
  <div className="flex justify-between items-center">
    <div>
      <h4 className="font-bold text-text-primary dark:text-text-primary-dark text-base">{title}</h4>
      <p className="text-xs font-medium text-text-secondary mt-1">{subtitle}</p>
    </div>
    <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
      <CheckCircle2 size={14} className="text-white" />
    </div>
  </div>
);

export default ProfileView;
