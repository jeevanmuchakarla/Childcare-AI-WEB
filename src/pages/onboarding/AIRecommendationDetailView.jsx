import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, DollarSign, MapPin, Clock, Users, 
  Sparkles, ShieldCheck, Calendar, Phone, Navigation 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AIRecommendationDetailView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recommendation } = location.state || {};

  if (!recommendation) {
    return <div className="p-20 text-center">No recommendation data found.</div>;
  }

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark ios-container pb-32">
      {/* Header Section */}
      <div className="relative h-[300px] bg-gradient-to-b from-primary/80 to-primary flex flex-col pt-8 px-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="px-4 py-2 bg-white rounded-full text-primary text-[14px] font-black shadow-lg">
            {recommendation.match_score}% Match
          </div>
        </div>

        <div className="mt-auto mb-10 self-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
            {recommendation.provider_type?.toLowerCase().includes('daycare') ? (
              <Building2 size={40} className="text-white" />
            ) : (
              <Book size={40} className="text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-app-bg dark:bg-app-bg-dark -mt-8 rounded-t-[32px] px-6 pt-8 space-y-8 relative z-10"
      >
        {/* Title & Type */}
        <div className="space-y-3">
          <h1 className="text-[28px] font-black text-text-primary dark:text-text-primary-dark leading-tight tracking-tight">
            {recommendation.name}
          </h1>
          <div className="flex items-center justify-between">
            <span className="px-3 py-1.5 bg-primary/10 rounded-xl text-primary text-xs font-black uppercase tracking-wider">
              {recommendation.provider_type}
            </span>
            <div className="flex items-center space-x-1.5">
              <Star size={16} fill="#FFCC00" className="text-yellow-400" />
              <span className="font-black text-sm">{recommendation.rating}</span>
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">(AI Verified)</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-app-surface dark:bg-app-surface-dark rounded-3xl shadow-sm">
          <DetailItem icon={DollarSign} label="Price" value={`$${recommendation.monthly_price}/mo`} color="#34C759" />
          <DetailItem icon={MapPin} label="Distance" value={`${recommendation.distance_km} km`} color="#007AFF" />
          <DetailItem icon={Clock} label="Timing" value={recommendation.timing || 'Standard'} color="#FF9F0A" />
          <DetailItem icon={Users} label="Age Group" value={recommendation.age_range || '1-6 years'} color="#00A3FF" />
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-text-primary tracking-tight">Location</h3>
          <div className="p-4 bg-app-surface dark:bg-app-surface-dark rounded-2xl flex items-start space-x-4 shadow-sm border border-black/5 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
               <MapPin size={20} />
            </div>
            <p className="text-sm font-medium text-text-secondary leading-relaxed">
              {recommendation.address || "123 Main St, Chennai"}
            </p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-text-primary tracking-tight">AI Match Insights</h3>
          <div className="p-5 bg-primary/5 rounded-2xl space-y-4">
            <InsightRow icon={Sparkles} text="High match score based on your search filters." />
            {recommendation.experience && (
              <InsightRow icon={Calendar} text={`Established provider with ${recommendation.experience} experience.`} />
            )}
            <InsightRow icon={ShieldCheck} text="Ranked favorably for safety and quality of care." />
          </div>
        </div>
      </motion.div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-app-bg-dark/80 backdrop-blur-xl border-t border-black/5 dark:border-white/10 flex items-center space-x-4 z-50">
        <button className="flex-1 h-14 bg-app-surface dark:bg-app-surface-dark rounded-2xl flex items-center justify-center text-primary font-bold shadow-md active:scale-95 transition-transform border border-black/5">
          <Phone size={18} className="mr-2" />
          Call
        </button>
        <button 
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recommendation.name + ' ' + (recommendation.address || 'Chennai'))}`, '_blank')}
          className="flex-1 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-transform"
        >
          <Navigation size={18} className="mr-2" />
          Directions
        </button>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
      <Icon size={18} style={{ color: color }} />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-text-primary">{value}</span>
    </div>
  </div>
);

const InsightRow = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-3 text-text-secondary">
    <Icon size={18} className="text-primary" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

const Book = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const Building2 = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);

export default AIRecommendationDetailView;
