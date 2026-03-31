import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Briefcase, DollarSign, MessageCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import discoveryService from '../../services/discoveryService';

const ProviderDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const data = await discoveryService.getProviderDetails(id);
        setProvider(data);
      } catch (error) {
        console.error("Failed to load provider details:", error);
        // Fallback for demo if backend is not ready
        setProvider({
          center_name: "Mock Provider",
          type: "Preschool",
          rating: 4.8,
          monthly_price: "$1200",
          bio: "This is a beautiful and safe environment for your children to learn and grow. We offer AI-powered matches and expert care.",
          address: "123 Main St, Silicon Valley",
          experience: "5+ Years",
          certifications: ["First Aid", "Early Education", "Background Checked"],
          amenities: ["Nutritious Meals", "Outdoor Play", "Daily Reports"]
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg dark:bg-app-bg-dark">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!provider) return null;

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark ios-container pb-40">
      {/* Header */}
      <header className="py-6 flex items-center px-4 sticky top-0 bg-transparent z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      {/* Hero Image Section */}
      <div className="relative h-[40vh] -mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img 
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${provider.center_name}&backgroundColor=00A3FF`} 
          alt={provider.center_name}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-6 left-6 z-20">
          <h1 className="text-3xl font-black text-white">{provider.center_name}</h1>
          <div className="flex items-center space-x-3 mt-2">
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-black">{provider.rating}</span>
            </div>
            <span className="text-white/60 text-sm font-medium">•</span>
            <span className="text-white/90 text-sm font-black uppercase tracking-wider">{provider.type}</span>
          </div>
        </div>
      </div>

      <main className="px-6 space-y-8 mt-8">
        {/* Info Grid */}
        <div className="flex items-center justify-between space-x-4">
          <InfoItem label="Experience" value={provider.experience || '5+ Years'} icon={Briefcase} color="#007AFF" />
          <InfoItem label="Rate" value={provider.monthly_price || '$1200/mo'} icon={DollarSign} color="#34C759" />
        </div>

        <hr className="border-black/[0.05] dark:border-white/[0.05]" />

        {/* About Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-text-primary dark:text-text-primary-dark">About</h2>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark font-medium leading-relaxed">
            {provider.bio}
          </p>
        </section>

        {/* Certifications */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-text-primary dark:text-text-primary-dark">Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {(provider.certifications || ["AI Verified"]).map((cert, idx) => (
              <Badge key={idx} text={cert} color="#007AFF" />
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-text-primary dark:text-text-primary-dark">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {(provider.amenities || ["SafeZone"]).map((item, idx) => (
              <Badge key={idx} text={item} color="#34C759" />
            ))}
          </div>
        </section>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-app-bg-dark/80 backdrop-blur-xl border-t border-black/[0.05] dark:border-white/[0.05] p-6 pb-10 flex items-center space-x-4 z-50">
        <button 
          onClick={() => navigate('/messages', { state: { contactId: provider.user_id, fullName: provider.center_name, role: provider.type } })}
          className="w-14 h-14 bg-primary rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
        >
          <MessageCircle size={24} fill="currentColor" />
        </button>
        
        <button 
          onClick={() => navigate(`/booking/${id}`, { state: { isVisit: true, providerName: provider.center_name, providerType: provider.type } })}
          className="flex-1 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-sm uppercase tracking-widest active:scale-95 transition-transform"
        >
          Book Visit
        </button>
        
        <button 
          onClick={() => navigate(`/booking/${id}`, { state: { isVisit: false, providerName: provider.center_name, providerType: provider.type } })}
          className="flex-1 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-sm uppercase tracking-widest shadow-premium active:scale-95 transition-transform"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
      <Icon size={18} style={{ color: color }} />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-text-secondary dark:text-text-secondary-dark uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-text-primary dark:text-text-primary-dark">{value}</span>
    </div>
  </div>
);

const Badge = ({ text, color }) => (
  <div 
    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider"
    style={{ backgroundColor: `${color}10`, color: color }}
  >
    {text}
  </div>
);

export default ProviderDetailView;
