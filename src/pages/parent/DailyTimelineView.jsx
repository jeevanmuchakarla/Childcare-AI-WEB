import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Play, Book, Star, Utensils, Clock, Camera, Smile, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import activityService from '../../services/activityService';
import mealService from '../../services/mealService';
import childService from '../../services/childService';
import photoService from '../../services/photoService';
import { useUser } from '../../context/UserContext';

const DailyTimelineView = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!childId || !user?.id) return;
      setIsLoading(true);
      try {
        const [m, a, p, allChildren] = await Promise.all([
          mealService.fetchChildMeals(childId),
          activityService.fetchChildActivities(childId),
          photoService.fetchChildPhotos(childId),
          childService.fetchChildren(user.id)
        ]);

        const c = allChildren.find(child => child.id === parseInt(childId));
        setChild(c);

        // Timezone-safe filter: show anything within the last 24 hours
        // This avoids the UTC vs local date string mismatch on IST and other timezones
        const now = new Date();
        const withinToday = (dateStr) => {
          if (!dateStr) return false;
          const d = new Date(dateStr);
          return !isNaN(d) && (now - d) < 24 * 60 * 60 * 1000;
        };

        const todayMeals = Array.isArray(m) ? m.filter(item => withinToday(item.created_at)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
        const todayActivities = Array.isArray(a) ? a.filter(item => withinToday(item.created_at)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
        const todayPhotos = Array.isArray(p) ? p.filter(item => withinToday(item.created_at)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];

        console.log(`[DailyTimeline] child=${childId} meals=${todayMeals.length} activities=${todayActivities.length} photos=${todayPhotos.length}`);

        setMeals(todayMeals);
        setActivities(todayActivities);
        setPhotos(todayPhotos);
      } catch (error) {
        console.error("Failed to load report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000); // near-realtime refresh every 10s
    return () => clearInterval(interval);
  }, [childId, user]);

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calcDuration = (checkInDate, checkOutDate) => {
    if (!checkInDate) return '--';
    const start = new Date(checkInDate);
    const end = checkOutDate ? new Date(checkOutDate) : new Date();
    const diffMs = end - start;
    if (diffMs <= 0) return '--';
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const attendance = activities.filter(a => a.activity_type === 'Attendance');
  const checkIn = attendance.find(a => a.notes?.includes('Checked In'));
  const checkOut = attendance.find(a => a.notes?.includes('Checked Out'));

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark ios-container pb-20">
      <header className="py-6 flex items-center px-4 sticky top-0 bg-app-bg/80 dark:bg-app-bg-dark/80 backdrop-blur-xl z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full mr-2"
        >
          <ChevronLeft size={24} className="text-primary" />
        </button>
        <h1 className="text-xl font-black text-text-primary dark:text-text-primary-dark">
          Daily Report
        </h1>
      </header>

      <main className="px-4 space-y-6 pt-2">
        {/* Child Header */}
        <div className="flex justify-between items-start px-2">
          <div>
            <h2 className="text-2xl font-black text-text-primary dark:text-text-primary-dark">{child?.name || 'Loading...'}</h2>
            <p className="text-sm font-bold text-text-secondary opacity-60">ChildCare Center</p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/5 flex items-center space-x-2">
            <CalendarIcon size={14} className="text-text-secondary" />
            <span className="text-xs font-black text-text-secondary uppercase tracking-wider">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-bold text-text-secondary">Syncing updates...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Attendance Card */}
            <div className="bg-white dark:bg-app-surface-dark p-6 rounded-[32px] shadow-xl border border-black/[0.03] dark:border-white/[0.05] flex justify-between items-center group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Clock size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none mb-1">Check In</p>
                  <p className="text-lg font-black text-text-primary dark:text-text-primary-dark">
                    {checkIn ? formatTime(checkIn.created_at) : "--:--"}
                  </p>
                </div>
              </div>
              <div className="w-[1px] h-10 bg-black/5 dark:bg-white/5" />
              <div className="text-right">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none mb-1">Duration</p>
                <p className="text-lg font-black text-text-primary dark:text-text-primary-dark">
                  {checkIn ? calcDuration(checkIn.created_at, checkOut?.created_at) : "--"}
                </p>
              </div>
            </div>

            {/* Today's Mood / Summary */}
            <section className="bg-white dark:bg-app-surface-dark p-6 rounded-[32px] shadow-xl border border-black/[0.03] dark:border-white/[0.05] space-y-4">
              <div className="flex items-center space-x-3">
                <Smile className="text-orange-500" size={20} />
                <h3 className="text-lg font-black text-text-primary dark:text-text-primary-dark tracking-tight">Today's Mood</h3>
              </div>
              <div className="inline-flex px-4 py-2 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-400/20">
                {activities.filter(a => a.activity_type === 'Report').length > 0 ? 'Report Shared' : 'Happy & Energetic'}
              </div>
              <p className="text-sm text-text-secondary font-medium leading-relaxed">
                {activities.filter(a => a.activity_type === 'Report').pop()?.notes || 
                 `${(child?.name || 'Child').split(' ')[0]} is having a wonderful day! Check back soon for the final daily summary.`}
              </p>
            </section>

            {/* Daily Photos */}
            <section className="space-y-4">
              <div className="flex items-center space-x-3 px-2">
                <Camera className="text-blue-500" size={20} />
                <h3 className="text-lg font-black text-text-primary dark:text-text-primary-dark tracking-tight">Daily Photos</h3>
              </div>
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                {photos.length === 0 ? (
                  <p className="text-sm text-text-secondary font-medium px-2">No photos shared today yet.</p>
                ) : (
                  photos.map(photo => (
                    <div key={photo.id} className="min-w-[160px] h-[160px] bg-black/5 dark:bg-white/5 rounded-[24px] overflow-hidden shadow-sm border border-black/5 dark:border-white/5 flex-shrink-0">
                      <img 
                        src={`http://localhost:8000${photo.url}`} 
                        alt="Daily Update" 
                        className="w-full h-full object-contain bg-black/5 dark:bg-white/10"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/160?text=Photo'; }}
                      />
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Meals & Nutrition */}
            <section className="bg-white dark:bg-app-surface-dark rounded-[32px] shadow-xl border border-black/[0.03] dark:border-white/[0.05] overflow-hidden">
              <div className="p-6 pb-2 flex items-center space-x-3">
                <Utensils className="text-green-500" size={20} />
                <h3 className="text-lg font-black text-text-primary dark:text-text-primary-dark tracking-tight">Meals & Nutrition</h3>
              </div>
              
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(mealType => {
                  const meal = meals.find(m => m.meal_type === mealType);
                  return (
                    <div key={mealType} className="p-6 flex justify-between items-center group hover:bg-black/[0.01] transition-colors">
                      <div>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">{mealType}</p>
                        <p className="font-black text-text-primary dark:text-text-primary-dark">
                          {meal ? meal.food_item : "Not served yet"}
                        </p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        meal ? 'bg-green-500/10 text-green-600' : 'bg-black/5 text-text-secondary/40'
                      }`}>
                        {meal ? meal.amount_eaten : "--"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent Activities */}
            <section className="space-y-4 pb-12">
              <div className="flex items-center space-x-3 px-2">
                <Star className="text-purple-500" size={20} />
                <h3 className="text-lg font-black text-text-primary dark:text-text-primary-dark tracking-tight">Recent Activities</h3>
              </div>
              <div className="space-y-4 px-2">
                {activities.filter(a => a.activity_type !== 'Attendance').map(activity => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-app-surface-dark p-5 rounded-[24px] border border-black/[0.03] dark:border-white/[0.05] shadow-sm flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      {activity.activity_type === 'Nap' ? <Moon size={18} /> : 
                       activity.activity_type === 'Play' ? <Play size={18} /> : 
                       <Book size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-text-primary dark:text-text-primary-dark">{activity.activity_type}</h4>
                        <span className="text-[10px] font-black text-text-secondary opacity-40">{formatTime(activity.created_at)}</span>
                      </div>
                      <p className="text-sm font-medium text-text-secondary leading-relaxed line-clamp-2">
                        {activity.notes || "Recorded successfully."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default DailyTimelineView;
