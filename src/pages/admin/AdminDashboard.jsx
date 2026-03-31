import React, { useEffect, useState } from 'react';
import { Bell, User, Users, CheckCircle2, Clock, Sparkles, FileText, ChevronRight, Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { fetchAdminStats } from '../../services/adminService';

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = [
    {
      value: loading ? '—' : String(stats?.users?.total ?? 0),
      title: 'Active Users',
      subtitle: 'Registered Accounts',
      icon: Users,
      color: '#007AFF',
      path: '/admin/management',
    },
    {
      value: loading ? '—' : String(stats?.bookings?.live_today ?? 0),
      title: 'Live Bookings',
      subtitle: 'Today',
      icon: CheckCircle2,
      color: '#34C759',
      path: '/admin/live-bookings',
    },
    {
      value: loading ? '—' : String(stats?.metrics?.pending_verification ?? 0),
      title: 'Pending Users',
      subtitle: 'Action Required',
      icon: Clock,
      color: '#FF9500',
      path: '/admin/pending-approvals',
    },
    {
      value: loading ? '—' : (stats?.metrics?.match_success ?? '0.0%'),
      title: 'Match Success',
      subtitle: 'AI Efficiency',
      icon: Sparkles,
      color: '#AF52DE',
      path: '/admin/ai-efficiency',
    },
  ];

  const pendingCount = stats?.metrics?.pending_verification ?? 0;

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-28">
      {/* Header */}
      <header className="flex items-center justify-between pt-12 pb-6 px-6 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-xl z-20 border-b border-black/[0.03] dark:border-white/[0.03]">
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest opacity-80">
            Welcome back,
          </span>
          <h1 className="text-[32px] font-black text-black dark:text-white leading-tight -mt-0.5 tracking-tighter">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/pending-approvals')}
            className="w-12 h-12 rounded-full bg-white dark:bg-[#1C1C1E] shadow-premium flex items-center justify-center relative active:scale-95 transition-all"
          >
            <Bell size={24} className="text-primary" strokeWidth={2.5} />
            {pendingCount > 0 && (
              <div className="absolute top-[10px] right-[10px] w-3 h-3 bg-[#FF3B30] rounded-full border-2 border-white dark:border-[#1C1C1E] shadow-sm" />
            )}
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-[#1C1C1E] shadow-premium active:scale-95 transition-all"
          >
            {user?.profile_image ? (
              <img src={`http://localhost:8000${user.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={24} strokeWidth={2.5} />
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="px-6 space-y-10 pt-6">
        {/* Overview Metrics */}
        <section className="space-y-5">
          <h2 className="text-[20px] font-black text-black dark:text-white tracking-tight px-1">Overview Metrics</h2>
          <div className="grid grid-cols-2 gap-6">
            {metrics.map((metric, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => metric.path && navigate(metric.path)}
                className="bg-white dark:bg-[#1C1C1E] p-6 py-7 rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] flex flex-col justify-between min-h-[160px] text-left active:bg-gray-50 dark:active:bg-gray-800 transition-all hover:shadow-xl group"
              >
                <div
                  className="w-12 h-12 rounded-[18px] flex items-center justify-center mb-4 shrink-0 shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${metric.color}15`, color: metric.color }}
                >
                  <metric.icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  {loading ? (
                    <div className="h-7 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse mb-2" />
                  ) : (
                    <h3 className="text-[28px] font-black text-black dark:text-white leading-tight tracking-tighter">{metric.value}</h3>
                  )}
                  <p className="text-[13px] font-black text-gray-500 mt-1 leading-tight uppercase tracking-wider">{metric.title}</p>
                  <p className="text-[11px] font-bold text-gray-400 mt-1 opacity-70">{metric.subtitle}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Platform Capacity Metrics */}
        <section className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[20px] font-black text-black dark:text-white tracking-tight">Platform Capacity</h2>
          </div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/management')}
            className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between cursor-pointer hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-[22px] bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
                <Users size={32} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5 opacity-80">Total Users</span>
                <span className="text-[36px] font-black text-black dark:text-white leading-none tracking-tighter">
                  {loading ? '—' : (stats?.users?.total ?? '0')}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-black text-[#34C759] leading-none mb-1.5">Active Capacity</span>
              <span className="text-[20px] font-black text-black dark:text-white leading-none tracking-tight">
                {loading ? '—' : `${Math.min(100, Math.round(((stats?.users?.total ?? 0) / 100) * 100))}%`}
              </span>
            </div>
          </motion.div>
        </section>

        {/* Platform Reports Banner */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/reports')}
          className="w-full flex items-center p-6 bg-white dark:bg-[#1C1C1E] rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] active:bg-gray-50 dark:active:bg-gray-800 transition-all hover:shadow-xl group"
        >
          <div className="w-[64px] h-[64px] rounded-[22px] bg-[#FF2D55]/10 flex items-center justify-center shrink-0 mr-5 transition-transform group-hover:rotate-12">
            <FileText size={28} className="text-[#FF2D55]" strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-[20px] font-black text-black dark:text-white leading-tight mb-1">Platform Reports</h3>
            <p className="text-[14px] font-medium text-gray-500 leading-tight pr-4">
              View detailed analytics for parents, preschools, and day...
            </p>
          </div>
          <ChevronRight size={22} className="text-gray-300 shrink-0" strokeWidth={3} />
        </motion.button>

        {/* AI Performance Insights */}
        <section className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[20px] font-black text-black dark:text-white tracking-tight">AI Performance Insights</h2>
            <button
              onClick={() => navigate('/admin/ai-efficiency')}
              className="text-[14px] font-black text-primary active:opacity-50 transition-all hover:underline"
            >
              Full Report
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/ai-efficiency')}
              className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#AF52DE]/10 flex items-center justify-center text-[#AF52DE] shrink-0 shadow-inner">
                <Cpu size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Match Accuracy</span>
                <span className="text-[20px] font-black text-black dark:text-white leading-none">94%</span>
              </div>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/ai-efficiency')}
              className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[32px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759] shrink-0 shadow-inner">
                <Zap size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Efficiency</span>
                <span className="text-[20px] font-black text-[#34C759] leading-none">+12%</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
