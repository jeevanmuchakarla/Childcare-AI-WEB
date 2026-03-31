import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Book, Building2, FileText, ArrowRight, Lightbulb, Leaf, Moon, Footprints, Users, Heart, Star, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import childService from '../../services/childService';
import activityService from '../../services/activityService';
import mealService from '../../services/mealService';
import AIRecommendationBanner from '../../components/dashboard/AIRecommendationBanner';
import CategoryCard from '../../components/dashboard/CategoryCard';
import InsightRow from '../../components/dashboard/InsightRow';
import discoveryService from '../../services/discoveryService';

const ParentDashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ Preschool: 0, Daycare: 0 });
  const [children, setChildren] = useState([]);
  const [latestActivity, setLatestActivity] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;
      try {
        const [childData, countData] = await Promise.all([
          childService.fetchChildren(user.id),
          discoveryService.fetchCounts()
        ]);
        setChildren(childData);
        setCounts(countData);

        if (childData.length > 0) {
          const allActivitiesPromises = childData.map(child => 
            activityService.fetchChildActivities(child.id)
          );
          const allActivitiesResults = await Promise.all(allActivitiesPromises);
          
          const now = new Date();
          let globalLatest = null;
          
          allActivitiesResults.forEach((activities, index) => {
            if (Array.isArray(activities)) {
              // Lenient "Today" filter: last 24 hours
              const recentActivities = activities.filter(a => {
                const activityDate = new Date(a.created_at);
                return (now - activityDate) < 24 * 60 * 60 * 1000;
              });

              if (recentActivities.length > 0) {
                // Priority: Report > Mood > newest activity
                const report = recentActivities.find(a => a.activity_type === 'Report');
                const mood = recentActivities.find(a => a.activity_type === 'Mood');
                const latest = report || mood || recentActivities[0];
                
                if (!globalLatest || new Date(latest.created_at) > new Date(globalLatest.created_at)) {
                  globalLatest = { ...latest, childName: childData[index].name };
                }
              }
            }
          });
          
          setLatestActivity(globalLatest);
        }
      } catch (error) {
        console.error("Dashboard data load failed:", error);
      }
    };
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 10000); // Poll every 10s for near-realtime
    return () => clearInterval(interval);
  }, [user]);

  // Mock data for insights as per iOS app
  const insights = [
    { title: "Early Learning", sub: "App features & growth paths.", content: "Explore the different paths and features available to track your child's early development metrics within the app.", icon: Lightbulb, color: "#FF9F0A" },
    { title: "Healthy Habits", sub: "Top 5 nutritious snacks.", content: "Establishing healthy eating habits early sets the foundation for a lifetime of wellness. Focus on colorful vegetables, balanced proteins, and minimizing processed sugars. Involving children in meal prep can increase their willingness to try new nutritious foods.", icon: Leaf, color: "#34C759" },
    { title: "Sleep Routines", sub: "Better rest for kids.", content: "A consistent bedtime routine helps children wind down and improves sleep quality. Try reading a book, a warm bath, or gentle music at the same time every night to signal to their body that it's time to rest.", icon: Moon, color: "#5856D6" },
    { title: "Potty Training", sub: "Stress-free transition.", content: "Patience and positive reinforcement are key to successful potty training. Look for signs of readiness, such as staying dry for longer periods and showing interest in the bathroom, and celebrate every small success along the way.", icon: Footprints, color: "#007AFF" },
    { title: "Social Skills", sub: "Helping kids make friends.", content: "Encourage sharing and empathy through playdates and group activities. Helping children identify and express their feelings is a crucial step in developing strong social connections and navigating world with kindness.", icon: Users, color: "#FF375F" },
    { title: "Nutrition Tips", sub: "Balanced diet guide.", content: "Kids need a balance of proteins, healthy fats, and complex carbohydrates. Try to include a variety of colors on their plate and introduce new foods multiple times as it can take up to 10-15 exposures for a child to accept a new taste.", icon: Heart, color: "#FF2D55" },
    { title: "Development", sub: "Milestone tracking 101.", content: "Track your child's physical, cognitive, and social milestones. Every child develops at their own pace, but early identification of developmental needs can lead to better outcomes through timely support and enrichment.", icon: Star, color: "#FFD60A" },
    { title: "Safety First", sub: "Securing your home.", content: "Protect your little ones by securing heavy furniture, covering electrical outlets, and keeping small objects out of reach. Regularly review safety guidelines for toys and outdoor equipment to ensure a secure environment for play.", icon: ShieldCheck, color: "#30B0C7" },
  ];

  return (
    <div className="py-6 min-h-screen bg-app-bg dark:bg-app-bg-dark relative">
      <div className="fixed top-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
      <div className="fixed top-[150px] left-[-50px] w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-[50px] pointer-events-none" />

      <header className="flex items-center justify-between py-10 px-5 relative z-10 sticky top-0 bg-app-bg/80 dark:bg-app-bg-dark/80 backdrop-blur-xl">
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-text-secondary dark:text-text-secondary-dark uppercase tracking-[0.1em] opacity-60">
            Good morning,
          </span>
          <h1 className="text-[28px] font-black text-text-primary dark:text-text-primary-dark tracking-tighter leading-none mt-1">
            {user?.full_name?.split(' ')[0] || 'Parent'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/notifications')}
            className="w-12 h-12 rounded-full bg-white dark:bg-app-surface-dark shadow-premium flex items-center justify-center text-primary border border-black/5 dark:border-white/5 transition-all active:scale-90 relative"
          >
            <Bell size={22} className="text-primary" strokeWidth={2.5} />
            <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-app-bg-dark shadow-sm" />
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full bg-white dark:bg-app-surface-dark shadow-premium p-0.5 border border-black/10 dark:border-white/10 transition-all active:scale-90"
          >
            {user?.profile_image ? (
              <img 
                src={`http://localhost:8000${user.profile_image}`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                <User size={24} strokeWidth={2.5} />
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="px-4 space-y-8 pb-24 relative z-10">
        <AIRecommendationBanner onClick={() => navigate('/onboarding')} />

        <section className="flex space-x-4">
          <CategoryCard 
            title="Preschools" 
            count={counts.Preschool} 
            subtitle={`${counts.Preschool} Verified`} 
            icon={Book} 
            color="#FF9500" 
            onClick={() => navigate('/discovery/Preschools')} 
          />
          <CategoryCard 
            title="Daycares" 
            count={counts.Daycare} 
            subtitle={`${counts.Daycare} Verified`} 
            icon={Building2} 
            color="#34C759" 
            onClick={() => navigate('/discovery/Daycares')} 
          />
        </section>

        {children.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(`/child/${children[0].id}/daily-report`)}
            className="w-full p-7 rounded-[32px] shadow-md text-white overflow-hidden text-left relative"
            style={{
              background: 'linear-gradient(135deg, var(--gradient-to), var(--primary))'
            }}
          >
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <FileText size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[20px] font-black tracking-tight mb-1">Children's Daily Update</h3>
                <p className="text-sm opacity-90 font-semibold line-clamp-2">
                  {latestActivity 
                    ? (latestActivity.activity_type === 'Report' 
                        ? latestActivity.notes 
                        : `Update for ${latestActivity.childName}: ${latestActivity.activity_type}`)
                    : `Check today's activities & meals for ${children[0]?.name || 'your children'}`
                  }
                </p>
              </div>
              <div className="text-white shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/>
                </svg>
              </div>
            </div>
          </motion.button>
        )}

        <section className="space-y-4">
           <h2 className="text-[22px] font-black tracking-tight text-text-primary dark:text-text-primary-dark">
             Parenting Insights
           </h2>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <InsightRow key={idx} {...insight} onClick={() => setSelectedInsight(insight)} />
            ))}
          </div>
        </section>
      </main>

      {/* Insight Modal Overlay */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-bg/80 dark:bg-app-bg-dark/80 backdrop-blur-md"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-app-surface-dark rounded-[32px] overflow-hidden shadow-xl border border-black/5 dark:border-white/5 p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${selectedInsight.color}15`, color: selectedInsight.color }}
                >
                  {(() => {
                    const Icon = selectedInsight.icon;
                    return <Icon size={32} />;
                  })()}
                </div>
                <button 
                  onClick={() => setSelectedInsight(null)}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-secondary transition-colors hover:bg-black/10"
                >
                  <X size={16} />
                </button>
              </div>
              
              <h3 className="text-2xl font-black text-text-primary dark:text-text-primary-dark tracking-tight mb-2">
                {selectedInsight.title}
              </h3>
              
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4" style={{ color: selectedInsight.color }}>
                {selectedInsight.sub}
              </p>
              
              <p className="text-base text-text-secondary font-medium leading-relaxed">
                {selectedInsight.content}
              </p>

              <button 
                onClick={() => setSelectedInsight(null)}
                className="w-full mt-8 py-4 rounded-2xl bg-black/5 dark:bg-white/5 text-text-primary dark:text-text-primary-dark font-bold text-sm hover:bg-black/10 transition-colors"
               >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParentDashboard;
