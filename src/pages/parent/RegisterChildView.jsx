import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Calendar, Save, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import childService from '../../services/childService';
import PrimaryButton from '../../components/common/PrimaryButton';
import Input from '../../components/common/Input';

const RegisterChildView = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    healthStatus: 'Healthy',
    allergies: '',
    interests: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name) return;

    setIsLoading(true);
    setError(null);
    try {
      await childService.addChild(user.id, {
        name: formData.name,
        age: formData.dob, // Back-end might expect DOB string in 'age' field for now
        allergies: formData.allergies,
        interests: formData.interests,
        medical_notes: formData.notes,
        gender: formData.gender,
        health_status: formData.healthStatus
      });
      navigate('/children');
    } catch (err) {
      setError("Failed to register child. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark ios-container pb-20">
      <header className="py-6 flex items-center px-4 sticky top-0 bg-app-bg/80 dark:bg-app-bg-dark/80 backdrop-blur-xl z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full mr-2"
        >
          <ChevronLeft size={24} className="text-primary" />
        </button>
        <h1 className="text-xl font-black text-text-primary dark:text-text-primary-dark flex-1">
          Add Child Profile
        </h1>
      </header>

      <main className="px-4 pt-4">
        <form onSubmit={handleSubmit} className="space-y-10 pb-12">
          {/* Photo Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-center bg-black/[0.02] dark:bg-white/[0.02] relative group cursor-pointer overflow-hidden">
               <Camera size={32} className="text-text-secondary/30 group-hover:scale-110 transition-transform" />
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <button type="button" className="text-sm font-black text-primary uppercase tracking-widest">
              Upload Photo
            </button>
          </div>

          <div className="space-y-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <Input 
                label="Full Name" 
                placeholder="Child's Name" 
                icon={UserIcon}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              
              <div className="space-y-4">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">Date of Birth</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-primary transition-colors">
                    <Calendar size={18} />
                  </div>
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 h-16 bg-white dark:bg-app-surface-dark rounded-[24px] border border-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Selection Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">Gender</label>
                <div className="flex p-1.5 bg-black/[0.03] dark:bg-white/[0.03] rounded-[20px] border border-black/5">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({...formData, gender: g})}
                      className={`flex-1 py-3 rounded-[16px] text-xs font-black uppercase tracking-widest transition-all ${formData.gender === g ? 'bg-white dark:bg-app-surface-dark text-primary shadow-sm' : 'text-text-secondary/60'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">Health Status</label>
                <div className="flex p-1.5 bg-black/[0.03] dark:bg-white/[0.03] rounded-[20px] border border-black/5">
                  {['Healthy', 'Attention'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, healthStatus: s})}
                      className={`flex-1 py-3 rounded-[16px] text-xs font-black uppercase tracking-widest transition-all ${formData.healthStatus === s ? 'bg-white dark:bg-app-surface-dark text-primary shadow-sm' : 'text-text-secondary/60'}`}
                    >
                      {s === 'Attention' ? 'Needs Attention' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="space-y-6">
              <Input 
                label="Food Allergies" 
                placeholder="e.g. Peanuts, Dairy (or None)" 
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
              />
              <Input 
                label="Interests / Hobbies" 
                placeholder="e.g. Dinosaurs, Painting" 
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
              />
              
              <div className="space-y-4">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">Additional Notes</label>
                <textarea 
                  className="w-full p-6 bg-white dark:bg-app-surface-dark rounded-[32px] border border-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium min-h-[150px]"
                  placeholder="List any behavioral or special needs..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-4 rounded-2xl">{error}</p>}

          <div className="pt-4">
            <PrimaryButton 
              title={isLoading ? "Saving..." : "Save Profile"} 
              onClick={handleSubmit} 
              isLoading={isLoading}
              disabled={!formData.name}
            />
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterChildView;
