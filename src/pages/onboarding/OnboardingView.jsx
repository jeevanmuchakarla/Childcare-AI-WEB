import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Sparkles, Book, Building2, MapPin, 
  Clock, Star, Brain, ArrowRight, Heart, Phone, Navigation 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import aiService from '../../services/aiService';

const OnboardingView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [careType, setCareType] = useState('Preschools');
  const [childAge, setChildAge] = useState('Toddler (1-2y)');
  const [budget, setBudget] = useState('Standard');
  const [location, setLocation] = useState('Anywhere in Chennai');
  const [dropoffTime, setDropoffTime] = useState('08:00 AM');
  const [pickupTime, setPickupTime] = useState('05:00 PM');
  const [minRating, setMinRating] = useState(4);
  
  // Results State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const nextStep = async () => {
    if (step === 6) {
      setStep(7);
      await startAnalysis();
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/parent/dashboard');
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const results = await aiService.fetchRecommendations({
        type: careType,
        budget,
        location,
        age: childAge,
        timing: `${dropoffTime}-${pickupTime}`
      });
      setRecommendations(results);
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark flex flex-col items-center py-6 px-4 pb-24 overflow-x-hidden">
      {/* Header & Progress (Hide in Results) */}
      {(step < 7) && (
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevStep} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-primary">
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm font-bold text-text-secondary dark:text-text-secondary-dark">
              Step {step} of 6
            </span>
            <div className="w-10"></div>
          </div>
          <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className={`w-full ${step === 7 ? 'max-w-3xl' : 'max-w-md'} flex flex-col`}>
        <AnimatePresence mode="wait">
          {step === 1 && <TypeStep careType={careType} setCareType={setCareType} key="step1" />}
          {step === 2 && <AgeStep childAge={childAge} setChildAge={setChildAge} key="step2" />}
          {step === 3 && <BudgetStep budget={budget} setBudget={setBudget} key="step3" />}
          {step === 4 && <LocationStep location={location} setLocation={setLocation} key="step4" />}
          {step === 5 && (
            <TimingStep 
              dropoff={dropoffTime} setDropoff={setDropoffTime} 
              pickup={pickupTime} setPickup={setPickupTime} 
              key="step5" 
            />
          )}
          {step === 6 && <RatingStep rating={minRating} setRating={setMinRating} key="step6" />}
          {step === 7 && (
            <ResultsStep 
              isAnalyzing={isAnalyzing} 
              recommendations={recommendations} 
              error={error} 
              careType={careType}
              key="step7"
              onBack={() => setStep(6)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Persistence Button Bar (Hide on Step 7 analyzing or Results) */}
      {(step < 7) && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-app-bg-dark/80 backdrop-blur-xl border-t border-black/5 dark:border-white/10 flex flex-col space-y-3 z-50">
          <button 
            onClick={nextStep}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            {step === 6 ? 'Find Matches' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// S T E P  C O M P O N E N T S
// -------------------------------------------------------------

const TypeStep = ({ careType, setCareType }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="p-6 bg-white dark:bg-app-surface-dark rounded-[32px] border border-black/[0.03] dark:border-white/[0.03] shadow-premium">
      <div className="flex items-center space-x-3 mb-4">
        <Sparkles size={20} className="text-primary" />
        <h4 className="text-lg font-bold text-text-primary dark:text-text-primary-dark tracking-tight">About ChildCare AI</h4>
      </div>
      <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark leading-relaxed">
        ChildCare AI leverages advanced algorithms to match your family with the highest-rated preschools and daycares. Our platform simplifies the search process, providing real-time data and personalized recommendations centered on your child's developmental needs and your family's preferences.
      </p>
      <div className="flex items-center space-x-4 mt-6">
        <span className="px-3 py-1.5 bg-primary/10 rounded-full text-[10px] font-black uppercase text-primary tracking-widest">Verified Providers</span>
        <span className="px-3 py-1.5 bg-orange-400/10 rounded-full text-[10px] font-black uppercase text-orange-400 tracking-widest">Real-time Data</span>
      </div>
    </div>

    <div>
      <h2 className="text-[32px] font-black text-text-primary dark:text-text-primary-dark tracking-tighter leading-none mb-8">What type of care are you looking for?</h2>
      <div className="space-y-4">
        <OptionCard icon={Book} iconColor="#00A3FF" title="Preschools" subtitle="Early education focus" selected={careType === 'Preschools'} onClick={() => setCareType('Preschools')} />
        <OptionCard icon={Building2} iconColor="#34C759" title="Daycares" subtitle="Structured daily care" selected={careType === 'Daycares'} onClick={() => setCareType('Daycares')} />
      </div>
    </div>
  </motion.div>
);

const AgeStep = ({ childAge, setChildAge }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <h2 className="text-[32px] font-black text-text-primary dark:text-text-primary-dark tracking-tighter leading-none mb-4">How old is your child?</h2>
    <div className="grid grid-cols-2 gap-4">
      {["Infant (0-12m)", "Toddler (1-2y)", "Preschooler (3-4y)", "Pre-K (4-5y)", "Explorer (5-6y)", "Student (6y+)"].map(age => (
        <button key={age} onClick={() => setChildAge(age)} className={`h-24 px-4 rounded-[24px] font-black text-sm uppercase tracking-wider transition-all border ${childAge === age ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white dark:bg-app-surface-dark border-black/5 dark:border-white/5 text-text-primary dark:text-white hover:bg-black/5'}`}>
          {age}
        </button>
      ))}
    </div>
  </motion.div>
);

const BudgetStep = ({ budget, setBudget }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <h2 className="text-[32px] font-black text-text-primary dark:text-text-primary-dark tracking-tighter leading-none mb-8">What's your budget?</h2>
    <div className="space-y-4">
      {[
        { id: "Budget Friendly", title: "Budget Friendly", sub: "Basic quality care options", price: "$500 - $800 / mo" },
        { id: "Standard", title: "Standard", sub: "Balanced quality and value", price: "$800 - $1200 / mo" },
        { id: "Premium", title: "Premium", sub: "Top-tier facilities and programs", price: "$1200+ / mo" },
      ].map(b => (
        <button key={b.id} onClick={() => setBudget(b.id)} className={`w-full text-left p-6 rounded-[28px] transition-all border flex items-center justify-between group ${budget === b.id ? 'bg-primary text-white border-primary shadow-xl' : 'bg-white dark:bg-app-surface-dark border-black/5 dark:border-white/5'}`}>
          <div>
            <h4 className="font-black text-lg tracking-tight">{b.title}</h4>
            <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${budget === b.id ? 'text-white/80' : 'text-text-secondary'}`}>{b.sub}</p>
            <p className={`text-sm font-black mt-2 ${budget === b.id ? 'text-white' : 'text-primary'}`}>{b.price}</p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${budget === b.id ? 'border-white bg-white' : 'border-black/10'}`}>
            {budget === b.id && <div className="w-2 h-2 bg-primary rounded-full transition-all" />}
          </div>
        </button>
      ))}
    </div>
  </motion.div>
);

const LocationStep = ({ location, setLocation }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <h2 className="text-[32px] font-black text-text-primary dark:text-text-primary-dark tracking-tighter leading-none mb-8">Preferred location?</h2>
    <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
      {["Anywhere in Chennai", "Anna Nagar", "T Nagar", "Adyar", "Velachery", "Porur", "Tambaram", "Sholinganallur", "Medavakkam", "OMR"].map(loc => (
        <button key={loc} onClick={() => setLocation(loc)} className={`w-full text-left p-5 rounded-[20px] font-bold text-base transition-all border flex items-center justify-between ${location === loc ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white dark:bg-app-surface-dark border-black/5 dark:border-white/5 text-text-primary dark:text-white'}`}>
          <span>{loc}</span>
          {location === loc && <Star size={18} fill="white" />}
        </button>
      ))}
    </div>
  </motion.div>
);

const TimingStep = ({ dropoff, setDropoff, pickup, setPickup }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <h2 className="text-[32px] font-black text-text-primary dark:text-text-primary-dark tracking-tighter leading-none mb-8">Timing preference?</h2>
    <div className="space-y-6">
      <TimeInput label="Drop-off Time" value={dropoff} onChange={setDropoff} />
      <TimeInput label="Pick-up Time" value={pickup} onChange={setPickup} />
    </div>
  </motion.div>
);

const TimeInput = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <label className="text-sm font-black uppercase text-text-secondary tracking-widest pl-2">{label}</label>
    <div className="relative">
      <input type="time" className="w-full p-5 bg-white dark:bg-app-surface-dark rounded-[24px] border border-black/5 dark:border-white/5 font-black text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-text-primary dark:text-white" value={value} onChange={(e) => onChange(e.target.value)} />
      <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
    </div>
  </div>
);

const RatingStep = ({ rating, setRating }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center pt-8">
    <h2 className="text-[32px] font-black text-text-primary dark:text-text-primary-dark tracking-tighter leading-none mb-12">Minimum Rating?</h2>
    <div className="flex justify-center items-center space-x-3 mb-12">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} onClick={() => setRating(star)} className={`transition-all duration-300 ${rating >= star ? 'scale-110 text-yellow-400' : 'text-black/10'}`}>
          <Star size={50} fill={rating >= star ? "#FFCC00" : "none"} strokeWidth={rating >= star ? 0 : 2} />
        </button>
      ))}
    </div>
    <div className="bg-primary/5 py-4 px-8 rounded-full inline-block">
      <span className="text-xl font-black text-primary tracking-tight">{rating === 1 ? 'All Verified' : `${rating} Stars & Above`}</span>
    </div>
    <p className="text-sm font-bold text-text-secondary mt-4 uppercase tracking-[0.2em]">
      {rating === 5 ? 'Premium Excellence Only' : rating >= 4 ? 'Top Tier Experience' : 'High Quality Standards'}
    </p>
  </motion.div>
);

const ResultsStep = ({ isAnalyzing, recommendations, error, careType, onBack }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 1 }} className="w-full space-y-8 pt-4">
    {isAnalyzing ? (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-12">
        <div className="relative w-40 h-40">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Brain size={60} className="text-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-black text-text-primary dark:text-text-primary-dark tracking-tight">Analyzing Profiles...</h3>
          <p className="text-text-secondary font-medium px-12">Matching your requirements against verified providers in your area.</p>
        </div>
      </div>
    ) : error ? (
      <div className="text-center py-20 space-y-6">
        <h3 className="text-xl font-bold text-red-500">{error}</h3>
        <button onClick={onBack} className="px-8 py-3 bg-primary text-white rounded-xl font-bold">Try Again</button>
      </div>
    ) : (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <button onClick={onBack} className="flex items-center text-primary font-bold">
             <ChevronLeft size={20} /> Back
           </button>
           <h3 className="text-xl font-black text-text-primary dark:text-text-primary-dark">AI Recommendations</h3>
           <div className="w-10" />
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {recommendations.map((rec, idx) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={rec.id} className="bg-white dark:bg-app-surface-dark rounded-[32px] overflow-hidden border border-black/5 dark:border-white/5 shadow-premium flex flex-col h-full">
                <div className="relative h-48 bg-black/5">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${rec.name}&backgroundColor=00A3FF`} alt={rec.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 px-4 py-2 bg-primary/90 backdrop-blur-md rounded-full text-white text-[12px] font-black uppercase tracking-widest">
                    {rec.match_score}% Match
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-black text-text-primary dark:text-text-primary-dark mt-1 leading-tight">{rec.name}</h4>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">{rec.provider_type}</p>
                    </div>
                    <div className="flex items-center space-x-1.5 px-3 py-1 bg-yellow-400/10 rounded-full">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[13px] font-black">{rec.rating}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Distance</span>
                      <p className="font-bold flex items-center text-primary"><MapPin size={14} className="mr-1" /> {rec.distance_km} km</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Monthly Rate</span>
                      <p className="font-black text-green-500">${rec.monthly_price}</p>
                    </div>
                  </div>
  
                  <div className="mt-auto flex space-x-3">
                    <button 
                      onClick={() => navigate(`/ai-recommendation/${rec.id}`, { state: { recommendation: rec } })}
                      className="flex-1 h-12 rounded-2xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-colors"
                    >
                      Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rec.name + ' ' + (rec.address || 'Chennai'))}`, '_blank');
                      }}
                      className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-app-surface-dark rounded-[40px] p-12 text-center space-y-6 border border-black/5 shadow-premium">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
               <Sparkles size={40} className="text-primary opacity-50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-text-primary dark:text-text-primary-dark">No matches found</h3>
              <p className="text-text-secondary font-medium">Try adjusting your budget or location within Chennai for better results.</p>
            </div>
            <button 
              onClick={onBack}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
            >
              Adjust Preferences
            </button>
          </div>
        )}
      </div>
    )}
  </motion.div>
  );
};

const OptionCard = ({ icon: Icon, iconColor, title, subtitle, selected, onClick }) => (
  <button onClick={onClick} className={`w-full text-left p-6 bg-white dark:bg-app-surface-dark rounded-[28px] transition-all flex items-center space-x-5 border ${selected ? 'border-primary ring-4 ring-primary/5 shadow-xl scale-102' : 'border-black/5 dark:border-white/5 opacity-80 hover:opacity-100 hover:border-black/10'}`}>
    <div className="w-16 h-16 rounded-[20px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${iconColor}15` }}>
      <Icon size={30} style={{ color: iconColor }} />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-black text-text-primary dark:text-text-primary-dark tracking-tight leading-tight">{title}</h3>
      <p className="text-sm font-bold text-text-secondary dark:text-text-secondary-dark mt-1 tracking-tight">{subtitle}</p>
    </div>
    {selected && (
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
        <Sparkles size={14} />
      </div>
    )}
  </button>
);

export default OnboardingView;
