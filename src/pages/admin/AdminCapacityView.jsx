import React, { useEffect, useState } from 'react';
import { ChevronLeft, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCapacityMetrics } from '../../services/adminService';

const AdminCapacityView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const radius = 60;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchCapacityMetrics();
        setData(result);
      } catch (err) {
        console.error('Failed to load capacity:', err);
        setError('Could not load capacity data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Parse "67.3%" → 67.3
  const pctValue = data
    ? parseFloat((data.availability_percentage || '0').replace('%', '')) || 0
    : 0;

  const strokeDashoffset = circumference - (pctValue / 100) * circumference;

  // Progress bar percentage for a row
  const rowPct = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);

  const occupied = data?.occupied_seats ?? 0;
  const total = data?.total_capacity ?? 0;
  const available = total - occupied;

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-28">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center justify-between px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-black/[0.03] dark:border-white/[0.03]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E] rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} className="text-[#FF3B30] -ml-1" strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] font-black text-black dark:text-white tracking-tight">Active Capacity</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <BarChart2 size={22} className="text-[#007AFF]" strokeWidth={2.5} />
        </div>
      </header>

      <main className="px-5 space-y-6 pt-6">
        {/* Loading state */}
        {loading && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[32px] flex flex-col items-center animate-pulse">
              <div className="w-[120px] h-[120px] rounded-full bg-gray-100 dark:bg-gray-800 mb-6" />
              <div className="h-5 w-32 bg-gray-100 dark:bg-gray-800 rounded-lg" />
            </div>
            <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[32px] space-y-4 animate-pulse">
              <div className="h-4 w-40 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center pt-20 space-y-4">
            <p className="text-[15px] font-bold text-gray-400">{error}</p>
          </div>
        )}

        {/* Ring Card */}
        {!loading && !error && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[32px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] flex flex-col items-center"
            >
              <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg
                  height={radius * 2}
                  width={radius * 2}
                  className="absolute transform -rotate-90"
                >
                  {/* Track */}
                  <circle
                    stroke="#F2F2F7"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="dark:stroke-[#2C2C2E]"
                  />
                  {/* Progress */}
                  <motion.circle
                    stroke="#007AFF"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                </svg>
                <div className="flex flex-col items-center justify-center z-10">
                  <span className="text-[32px] font-black text-black dark:text-white tracking-tight leading-none">
                    {data?.availability_percentage ?? '0%'}
                  </span>
                  <span className="text-[13px] font-medium text-gray-500 mt-1">Utilized</span>
                </div>
              </div>

              {/* Trend pill */}
              <div className="px-4 py-1.5 bg-[#34C759]/10 rounded-full">
                <span className="text-[13px] font-bold text-[#34C759] tracking-tight">
                  {data?.trend ?? '+0.0% from last week'}
                </span>
              </div>
            </motion.div>

            {/* Breakdown Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[32px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] space-y-6"
            >
              <h3 className="text-[17px] font-bold text-black dark:text-white tracking-tight">Current Breakdown</h3>

              {/* Total capacity */}
              <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
                <span className="text-[15px] font-bold text-black dark:text-white">Total Capacity</span>
                <span className="text-[15px] font-medium text-gray-400">{total} seats</span>
              </div>

              {/* Occupied seats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-black dark:text-white">Occupied Seats</span>
                  <span className="text-[15px] font-medium text-gray-400">{occupied} ({rowPct(occupied, total)}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-[#2C2C2E] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rowPct(occupied, total)}%` }}
                    transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-[#007AFF] rounded-full"
                  />
                </div>
              </div>

              {/* Available spots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-black dark:text-white">Available Spots</span>
                  <span className="text-[15px] font-medium text-gray-400">{available} ({rowPct(available, total)}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-[#2C2C2E] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rowPct(available, total)}%` }}
                    transition={{ duration: 1.0, ease: 'easeOut', delay: 0.35 }}
                    className="h-full bg-[#34C759] rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminCapacityView;
