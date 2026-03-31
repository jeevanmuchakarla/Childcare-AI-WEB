import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2, ChevronLeft, CheckCircle2, Utensils, Moon, Gamepad2, Camera, FileText, Send, User, RotateCw, AlertTriangle, Users, IdCard, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import childService from '../../services/childService';
import activityService from '../../services/activityService';
import mealService from '../../services/mealService';
import notificationService from '../../services/notificationService';
import photoService from '../../services/photoService';
import ChildProfileCard from '../../components/children/ChildProfileCard';
import PrimaryButton from '../../components/common/PrimaryButton';

const ChildrenTabView = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuickAction, setActiveQuickAction] = useState(null);
  const [isPushing, setIsPushing] = useState(false);

  const isProvider = user?.role?.toLowerCase() === 'preschool' || user?.role?.toLowerCase() === 'daycare';

  useEffect(() => {
    loadChildren();
  }, [user, isProvider]);

  const loadChildren = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      let data;
      if (isProvider) {
        data = await childService.fetchProviderChildren(user.id);
      } else {
        data = await childService.fetchChildren(user.id);
      }
      setChildren(data);
    } catch (error) {
      console.error("Failed to load children:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendUpdate = async (child, summary) => {
    try {
      // Build a rich message — try to fetch today's meals for context
      let richMessage = summary || `Daily report for ${child.name} has been finalized by your provider.`;
      try {
        const todayMeals = await mealService.fetchChildMeals(child.id);
        const now = new Date();
        const recentMeals = (todayMeals || []).filter(m => {
          if (!m.created_at) return false;
          const d = new Date(m.created_at);
          return !isNaN(d) && (now - d) < 24 * 60 * 60 * 1000;
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        if (recentMeals.length > 0) {
          const uniqueMeals = [];
          const seenTypes = new Set();
          for (const m of recentMeals) {
            if (!seenTypes.has(m.meal_type)) {
               seenTypes.add(m.meal_type);
               uniqueMeals.push(m);
            }
          }
          const mealSummary = uniqueMeals.map(m => `${m.meal_type}: ${m.food_item}`).join(', ');
          richMessage = `${child.name}'s daily report is ready! Today's meals: ${mealSummary}.`;
        }
      } catch (_) { /* use default message if meals fail */ }

      await notificationService.createNotification({
        user_id: child.parent_id,
        title: `📋 Daily Report Ready — ${child.name}`,
        message: richMessage,
        type: "success",
        child_id: child.id
      });
      await activityService.logActivity(child.id, {
        child_id: child.id,
        provider_id: user.id,
        activity_type: 'Report',
        notes: richMessage
      });
    } catch (error) {
      console.error("Failed to send daily report notification:", error);
      throw error;
    }
  };

  const handlePushDirect = async (child) => {
    setIsPushing(true);
    try {
      await handleSendUpdate(child, "Daily Report Finalized");
      setActiveQuickAction({ type: 'success_popup', child });
    } catch (error) {
      console.error(error);
      alert("Failed to send update.");
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-28">
      {/* Header */}
      <header className="pt-12 flex flex-col px-5 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-30 pb-2">
        {!isProvider && (
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm rounded-full mb-2 active:scale-95 transition-transform"
          >
            <ChevronLeft size={22} className="text-[#FF3B30]" />
          </button>
        )}
        <h1 className="text-[28px] font-bold text-black dark:text-white tracking-tight">
          {isProvider ? 'Children' : 'My Children'}
        </h1>
      </header>

      <main className="px-5 space-y-6 pt-2">
        {isProvider && (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-5 shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-[17px] font-bold text-black dark:text-white leading-tight">
                Classroom Overview
              </h2>
              <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="px-3 py-1.5 bg-[#34C759]/10 text-[#34C759] rounded-full flex items-center space-x-1.5 font-bold text-[13px]">
              <div className="w-1.5 h-1.5 bg-[#34C759] rounded-full"></div>
              <span>{children.length} Present</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 size={30} className="text-[#FF3B30] animate-spin" />
          </div>
        ) : children.length > 0 ? (
          <div className="space-y-4">
            {isProvider && (
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[16px] font-bold text-black dark:text-white">
                  Currently in Care
                </h3>
                <button onClick={loadChildren} className="text-[#FF3B30] active:scale-90 transition-transform">
                  <RotateCw size={18} strokeWidth={2.5} />
                </button>
              </div>
            )}
            
            <div className="space-y-4">
              {children.map((child) => (
                isProvider ? (
                  <ProviderChildCard 
                    key={child.id} 
                    child={child} 
                    isPushing={isPushing}
                    onAction={(type) => setActiveQuickAction({ type, child })}
                    onSendUpdate={() => handlePushDirect(child)}
                    onViewProfile={() => navigate(`/child/${child.id}`)}
                  />
                ) : (
                  <div className="relative group" key={child.id}>
                    <ChildProfileCard 
                      name={child.name} 
                      age={child.age || 'Child'} 
                      onClick={() => navigate(`/child/${child.id}`)}
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/child/${child.id}/daily-report`); }}
                      className="absolute top-4 right-4 px-3 py-1.5 bg-[#FF3B30]/10 text-[#FF3B30] rounded-xl text-[12px] font-bold transition-colors"
                    >
                      Daily Report
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-[#1C1C1E] rounded-2xl flex items-center justify-center text-gray-300">
              <Users size={32} />
            </div>
            <div className="text-center px-6">
              <p className="text-[17px] font-bold text-black dark:text-white">
                {isProvider ? 'Classroom is Empty' : 'No children enrolled yet'}
              </p>
              <p className="text-[14px] text-gray-500 mt-1">
                {isProvider 
                  ? 'Students will appear here automatically.' 
                  : 'Children appear here when a booking is confirmed.'}
              </p>
            </div>
          </div>
        )}

        {!isProvider && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/add-child')}
            className="w-full h-[54px] flex items-center justify-center space-x-2 text-[#FF3B30] font-bold border-2 border-dashed border-[#FF3B30]/30 rounded-[16px] bg-[#FF3B30]/5 active:bg-[#FF3B30]/10 transition-colors"
          >
            <PlusCircle size={20} />
            <span className="text-[15px]">Register New Child</span>
          </motion.button>
        )}
      </main>

      {/* Quick Action Overlay (Modal) */}
      <AnimatePresence>
        {activeQuickAction && (
          <QuickActionModal 
            action={activeQuickAction} 
            isPushing={isPushing}
            setIsPushing={setIsPushing}
            handleSendUpdate={handleSendUpdate}
            onClose={() => setActiveQuickAction(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==========================================================
                    PROVIDER CHILD CARD
   ========================================================== */
const ProviderChildCard = ({ child, isPushing, onAction, onSendUpdate, onViewProfile }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1C1C1E] rounded-[24px] shadow-sm border border-black/[0.02] overflow-hidden p-5 relative"
    >
      <div className="flex items-start space-x-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-[#FF2D55]/10 flex items-center justify-center text-[#FF2D55] font-bold text-[20px] shadow-sm shrink-0 mt-1">
          {(child.name || 'J').substring(0, 1).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <h3 className="text-[17px] font-bold text-black dark:text-white tracking-tight">{child.name || "Jeevan"}</h3>
          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
            {child.age || "5"} • {child.parent_name || 'Jeevan Muchakarla'}
          </p>
          <div className="flex items-center space-x-1.5 mt-2 bg-[#FF9500]/10 text-[#FF9500] px-2 py-0.5 rounded-full w-max">
            <AlertTriangle size={12} strokeWidth={2.5} />
            <span className="text-[11px] font-bold tracking-tight">Vegetables</span>
          </div>
        </div>
      </div>

      <button 
        onClick={onViewProfile}
        className="w-full flex items-center justify-center space-x-2 bg-[#FF3B30] text-white py-3.5 rounded-[14px] font-bold text-[15px] shadow-sm active:scale-[0.98] transition-all mb-4"
      >
        <IdCard size={20} />
        <span>Child Profile</span>
      </button>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <ActionButton icon={CheckCircle2} label="Attendance" color="#FF2D55" onClick={() => onAction('attendance')} />
        <ActionButton icon={Utensils} label="Meals" color="#FF9500" onClick={() => onAction('meals')} />
        <ActionButton icon={Moon} label="Nap Time" color="#AF52DE" onClick={() => onAction('nap')} />
        <ActionButton icon={Gamepad2} label="Games Period" color="#FF2D55" onClick={() => onAction('play')} />
        <ActionButton icon={Camera} label="Add Photo" color="#007AFF" onClick={() => onAction('photo')} />
        <ActionButton icon={FileText} label="Add Note" color="#AF52DE" onClick={() => onAction('notes')} />
      </div>

      <button 
        onClick={onSendUpdate}
        disabled={isPushing}
        className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-[#1C1C1E] border-[1.5px] border-[#FF3B30]/20 text-[#FF3B30] py-4 rounded-[16px] font-bold text-[15px] active:bg-[#FF3B30]/5 transition-all text-center leading-tight disabled:opacity-50"
      >
        {isPushing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        <span>{isPushing ? 'Sending...' : 'Send Daily Update to Parent'}</span>
      </button>
    </motion.div>
  );
};

const ActionButton = ({ icon: Icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center min-h-[110px] py-5 px-3 rounded-[24px] bg-[#F9F9F9] dark:bg-[#2C2C2E] border border-black/[0.02] dark:border-white/5 active:bg-gray-200 dark:active:bg-gray-700 transition-colors shadow-sm"
  >
    <div 
      className="w-[46px] h-[46px] rounded-[16px] flex items-center justify-center mb-4"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <span className="text-[13px] font-bold text-black dark:text-white tracking-tight leading-none text-center">{label}</span>
  </button>
);

const QuickActionModal = ({ action, onClose, isPushing, setIsPushing }) => {
  const { user } = useUser();
  const [saveStatus, setSaveStatus] = useState(null); 
  const [statusMsg, setStatusMsg] = useState('');

  // Fields
  const [value, setValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Meals specific
  const [meals, setMeals] = useState({ breakfast: '', lunch: '', snack: '', dinner: '' });
  
  // Nap specific
  const [napDuration, setNapDuration] = useState('0 h 30 m');
  
  // Game specific
  const [where, setWhere] = useState('');
  const [what, setWhat] = useState('');
  const [mood, setMood] = useState('Happy');

  // Attendance specific
  const [attNotes, setAttNotes] = useState('');

  if (action.type === 'success_popup') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-3xl border border-white/20 rounded-[32px] p-8 pb-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] text-center w-full max-w-[340px]">
          <h3 className="text-[20px] font-bold text-black dark:text-white mb-2 tracking-tight">Daily Update Sent</h3>
          <p className="text-[14px] font-medium text-gray-500 leading-relaxed mb-6">The daily report for {action.child.name} has been sent to their parents successfully.</p>
          <button onClick={onClose} className="w-full py-3.5 bg-black/5 dark:bg-white/10 rounded-[16px] font-bold text-[16px] text-black dark:text-white active:scale-95 transition-transform">Nice!</button>
        </motion.div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaveStatus(null);
    setIsPushing(true);
    try {
      if (action.type === 'meals') {
        const mealPromises = [];
        if (meals.breakfast) mealPromises.push(mealService.logMeal(action.child.id, { child_id: action.child.id, provider_id: user.id, meal_type: 'Breakfast', food_item: meals.breakfast, amount_eaten: 'All' }));
        if (meals.lunch) mealPromises.push(mealService.logMeal(action.child.id, { child_id: action.child.id, provider_id: user.id, meal_type: 'Lunch', food_item: meals.lunch, amount_eaten: 'All' }));
        if (meals.snack) mealPromises.push(mealService.logMeal(action.child.id, { child_id: action.child.id, provider_id: user.id, meal_type: 'Snack', food_item: meals.snack, amount_eaten: 'All' }));
        if (meals.dinner) mealPromises.push(mealService.logMeal(action.child.id, { child_id: action.child.id, provider_id: user.id, meal_type: 'Dinner', food_item: meals.dinner, amount_eaten: 'All' }));
        await Promise.all(mealPromises);
      } else if (action.type === 'attendance') {
        await activityService.logActivity(action.child.id, { child_id: action.child.id, provider_id: user.id, activity_type: 'Attendance', notes: `Checked In. Notes: ${attNotes}` });
      } else if (action.type === 'nap') {
        await activityService.logActivity(action.child.id, { child_id: action.child.id, provider_id: user.id, activity_type: 'Nap', notes: `Duration: ${napDuration}. Obs: ${value}` });
      } else if (action.type === 'play') {
        await activityService.logActivity(action.child.id, { child_id: action.child.id, provider_id: user.id, activity_type: 'Game', notes: `Played ${what} at ${where}. Mood: ${mood}. ${value}` });
      } else if (action.type === 'photo') {
        if (!selectedFile) throw new Error("Select a photo.");
        await photoService.uploadChildPhoto(action.child.id, selectedFile, value.trim());
      } else {
        await activityService.logActivity(action.child.id, { child_id: action.child.id, provider_id: user.id, activity_type: 'Note', notes: value.trim() });
      }
      setSaveStatus('success');
      setStatusMsg(`Saved successfully!`);
      setTimeout(onClose, 1200);
    } catch (error) {
      setSaveStatus('error');
      setStatusMsg(error.message || `Failed to save.`);
    } finally {
      setIsPushing(false);
    }
  };

  const gradientButton = `w-full py-4 rounded-[16px] font-bold text-[16px] text-white flex items-center justify-center transition-all bg-gradient-to-r from-[#FF6B6B] to-[#FF8A65] active:scale-[0.98] shadow-sm disabled:opacity-50`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4 pb-0 sm:pb-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded-t-[32px] sm:rounded-[32px] shadow-2xl iOS-modal flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md z-10 shrink-0 rounded-t-[32px]">
          <button onClick={onClose} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full active:bg-gray-200 transition text-[13px] font-bold text-black dark:text-white">
            Close
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <h3 className="text-[17px] font-bold text-black dark:text-white capitalize tracking-tight">
              {action.type === 'photo' ? 'Send Photo' : action.type === 'notes' ? 'Add Note' : `Log ${action.type}`}
            </h3>
            <span className="text-[11px] text-gray-400">For: {action.child.name}</span>
          </div>
          <div className="w-[60px]"></div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {action.type === 'attendance' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-[#FF3B30]">
                <CheckCircle2 size={16} /><span className="text-[14px] font-bold">Select Date & Time</span>
              </div>
              <div className="p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[24px]">
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="font-bold text-[14px]">March 2026</span>
                  <div className="flex space-x-2"><ChevronLeft size={16} className="text-[#007AFF]"/><ChevronLeft size={16} className="text-[#007AFF] rotate-180"/></div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-gray-400 font-bold mb-2">
                  {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-y-3 text-center text-[14px] font-medium text-black dark:text-white">
                  {Array.from({length: 31}, (_, i) => (
                    <div key={i} className={`flex justify-center items-center w-8 h-8 rounded-full mx-auto ${i+1 === 26 ? 'bg-[#007AFF] text-white shadow-md' : ''}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px]">
                <span className="font-bold text-[15px]">Time</span>
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full font-bold text-[13px]">4:00 AM</span>
              </div>
              <div>
                <span className="text-[12px] font-bold text-gray-500 mb-2 block">Notes (Optional)</span>
                <input className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px] px-5 py-4 text-[15px] outline-none" placeholder="e.g. Arrived on time" value={attNotes} onChange={e => setAttNotes(e.target.value)} />
              </div>
            </div>
          )}

          {action.type === 'meals' && (
            <div className="space-y-4">
              {[
                { label: 'Breakfast', icon: "🌅", color: "text-[#FF9500]" },
                { label: 'Lunch', icon: "☀️", color: "text-[#FFCC00]" },
                { label: 'Snack', icon: "🌿", color: "text-[#34C759]" },
                { label: 'Dinner', icon: "🌙", color: "text-[#5E5CE6]" }
              ].map(meal => (
                <div key={meal.label}>
                  <div className={`flex items-center space-x-2 text-[14px] font-bold ${meal.color} mb-2`}>
                    <span>{meal.icon}</span><span>{meal.label}</span>
                  </div>
                  <input className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px] px-5 py-4 text-[15px] outline-none" placeholder={`What did they have for ${meal.label.toLowerCase()}?`} value={meals[meal.label.toLowerCase()]} onChange={e => setMeals({...meals, [meal.label.toLowerCase()]: e.target.value})} />
                </div>
              ))}
            </div>
          )}

          {action.type === 'nap' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-[#5E5CE6] mb-2"><Moon size={16} /><span className="font-bold">Sleep Duration</span></div>
              <div className="flex items-center justify-between bg-[#F2F2F7] dark:bg-[#2C2C2E] p-6 rounded-[24px]">
                <div className="flex-1 text-center font-bold text-[24px]">0 h</div>
                <div className="flex-1 text-center font-bold text-[24px]">30 m</div>
              </div>
              <div>
                <span className="text-[12px] font-bold text-gray-500 mb-2 block">Observation</span>
                <input className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px] px-5 py-4 text-[15px] outline-none" placeholder="e.g. Fell asleep quickly" value={value} onChange={e => setValue(e.target.value)} />
              </div>
            </div>
          )}

          {action.type === 'play' && (
            <div className="space-y-4">
              <div><span className="text-[12px] font-bold text-gray-500 mb-2 block">⛑ Where?</span><input className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px] px-5 py-4 text-[15px] outline-none" placeholder="e.g. Playground, Playroom" value={where} onChange={e => setWhere(e.target.value)} /></div>
              <div><span className="text-[12px] font-bold text-gray-500 mb-2 block">🎮 What?</span><input className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px] px-5 py-4 text-[15px] outline-none" placeholder="e.g. Building Blocks, Tag" value={what} onChange={e => setWhat(e.target.value)} /></div>
              <div>
                <span className="text-[12px] font-bold text-gray-500 mb-2 block">Mood During Activity</span>
                <div className="flex flex-wrap gap-2">
                  {['Happy','Energetic','Calm','Focused','Fussy'].map(m => (
                    <button key={m} onClick={() => setMood(m)} className={`px-4 py-2 rounded-full text-[12px] font-bold ${mood === m ? 'bg-[#FF3B30] text-white' : 'bg-[#F2F2F7] text-gray-500'}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div><span className="text-[12px] font-bold text-gray-500 mb-2 block">How they played</span><textarea className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px] px-5 py-4 text-[15px] outline-none min-h-[100px] resize-none" value={value} onChange={e => setValue(e.target.value)} /></div>
            </div>
          )}

          {action.type === 'photo' && (
            <div className="space-y-4">
              <label className={`block w-full h-[200px] border-2 border-dashed rounded-[32px] cursor-pointer transition-all ${selectedFile ? 'border-[#FF3B30] bg-[#FF3B30]/5' : 'border-gray-200 dark:border-gray-700 bg-[#F2F2F7] dark:bg-[#2C2C2E]'}`}>
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera size={40} className="text-[#FF3B30] mb-3" />
                  <span className="font-bold text-[#FF3B30]">{selectedFile ? selectedFile.name : 'Select Photo'}</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} />
              </label>
            </div>
          )}

          {action.type === 'notes' && (
            <div className="space-y-2">
              <span className="text-[12px] font-bold text-gray-500 block">Notes</span>
              <textarea autoFocus className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[16px] px-5 py-4 text-[15px] outline-none resize-none min-h-[160px]" placeholder="e.g. Arrived happy, ate well today" value={value} onChange={e => setValue(e.target.value)} />
            </div>
          )}

          <div className="pt-2">
             <button onClick={handleSave} disabled={isPushing} className={gradientButton}>
               {isPushing ? <Loader2 size={20} className="animate-spin" /> : saveStatus === 'success' ? 'Saved!' : action.type === 'photo' ? 'Upload & Send' : 'Save'}
             </button>
             {saveStatus === 'error' && <p className="text-center text-[12px] font-bold text-[#FF3B30] mt-3">{statusMsg}</p>}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ChildrenTabView;
