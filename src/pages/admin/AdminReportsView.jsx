import React, { useState, useEffect } from 'react';
import { ChevronLeft, Users, Building2, Calendar, Sparkles, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminReportsView = () => {
  const navigate = useNavigate();

  const metrics = [
    { value: "1", title: "Active Parents", icon: Users, color: "#007AFF" },
    { value: "2", title: "Active Providers", icon: Building2, color: "#FF2D55" },
    { value: "4", title: "Total Bookings", icon: Calendar, color: "#AF52DE" },
    { value: "50.0%", title: "Match Success", icon: Sparkles, color: "#FF9500" },
  ];

  const recentReports = [
    { title: "Daily Statistics Update", date: "Today, 08:00 AM" },
    { title: "Monthly Revenue Report", date: "Jan 1, 2026" },
  ];

  // Dummy data for the bar chart
  const chartData = [40, 60, 45, 80, 50, 70, 90, 65, 85, 55, 75, 100, 80, 95];

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black ios-container pb-28">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E] rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} className="text-[#FF3B30] -ml-1" strokeWidth={2.5} />
        </button>
        <h1 className="text-[20px] font-bold text-black dark:text-white tracking-tight ml-4 flex-1">
          Reports & Analytics
        </h1>
      </header>

      <main className="px-5 space-y-8 pt-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1C1C1E] p-4 py-5 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex flex-col justify-between min-h-[130px]">
              <div 
                className="w-[42px] h-[42px] rounded-[16px] flex items-center justify-center mb-3"
                style={{ backgroundColor: `${metric.color}15`, color: metric.color }}
              >
                <metric.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="mt-1">
                <h3 className="text-[22px] font-bold text-black dark:text-white leading-tight">{metric.value}</h3>
                <p className="text-[12px] font-bold text-gray-500 mt-1 leading-none">{metric.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Growth */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[17px] font-bold text-black dark:text-white tracking-tight">Platform Growth</h2>
            <div className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-full">
              <span className="text-[11px] font-bold text-black dark:text-white">Last 30 Days</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02]">
            <div className="flex items-end justify-between h-[120px] space-x-1.5">
              {chartData.map((val, i) => (
                <div key={i} className="flex-1 w-full bg-[#FF3B30]/20 rounded-t-full rounded-b-full relative overflow-hidden h-full flex items-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.05, duration: 0.8, type: 'spring' }}
                    className="w-full bg-[#FF3B30] rounded-t-full rounded-b-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="space-y-4">
          <h2 className="text-[17px] font-bold text-black dark:text-white tracking-tight px-1">Recent Reports</h2>
          <div className="space-y-3">
            {recentReports.map((report, idx) => (
              <motion.button 
                key={idx}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white dark:bg-[#1C1C1E] p-5 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex items-center space-x-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-[16px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-gray-400" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[15px] font-bold text-black dark:text-white">{report.title}</span>
                  <span className="text-[13px] font-medium text-gray-500 mt-0.5">{report.date}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminReportsView;
