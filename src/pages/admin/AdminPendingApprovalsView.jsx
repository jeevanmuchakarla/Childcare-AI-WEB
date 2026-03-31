import React, { useState, useEffect } from 'react';
import { ChevronLeft, UserCheck, CheckCircle, XCircle, Building2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchPendingProviders, approveProvider, rejectProvider } from '../../services/adminService';

const AdminPendingApprovalsView = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState({}); // { [id]: 'approving' | 'rejecting' }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPendingProviders();
      setProviders(data);
    } catch (err) {
      console.error('Failed to load pending providers:', err);
      setError('Could not load pending approvals.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing((p) => ({ ...p, [id]: 'approving' }));
    try {
      await approveProvider(id);
      setProviders((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setProcessing((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  const handleReject = async (id) => {
    setProcessing((p) => ({ ...p, [id]: 'rejecting' }));
    try {
      await rejectProvider(id);
      setProviders((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setProcessing((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-28">
      {/* Header */}
      <header className="pt-12 pb-4 flex items-center px-4 sticky top-0 bg-[#F2F2F7]/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-black/[0.03] dark:border-white/[0.03]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E] rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} className="text-[#FF3B30] -ml-1" strokeWidth={2.5} />
        </button>
        <h1 className="text-[20px] font-black text-black dark:text-white tracking-tight ml-4 flex-1">
          Pending Approvals
        </h1>
        {!loading && providers.length > 0 && (
          <span className="px-3 py-1 bg-[#FF9500]/15 text-[#FF9500] text-[13px] font-black rounded-full">
            {providers.length}
          </span>
        )}
      </header>

      <main className="px-5 pt-6 space-y-4">
        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[24px] animate-pulse space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/3" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/3" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 flex-1 bg-gray-100 dark:bg-gray-800 rounded-[14px]" />
                  <div className="h-10 flex-1 bg-gray-100 dark:bg-gray-800 rounded-[14px]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center pt-20 space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <XCircle size={36} className="text-[#FF3B30]" strokeWidth={1.5} />
            </div>
            <p className="text-[15px] font-bold text-gray-400">{error}</p>
            <button onClick={loadData} className="px-5 py-2.5 bg-[#007AFF] text-white rounded-full font-bold text-[14px]">
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && providers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center pt-24 space-y-4"
          >
            <div className="w-[100px] h-[100px] bg-white dark:bg-[#1C1C1E] rounded-full flex items-center justify-center shadow-sm border border-black/[0.02] dark:border-white/[0.02]">
              <UserCheck size={48} className="text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-bold text-gray-400">All Caught Up!</h2>
            <p className="text-[14px] font-medium text-gray-400">No pending approvals right now.</p>
          </motion.div>
        )}

        {/* Provider list */}
        <AnimatePresence>
          {!loading && !error && providers.map((provider, idx) => {
            const isProcessing = !!processing[provider.id];
            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[24px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] space-y-4"
              >
                {/* Info row */}
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 ${provider.type === 'Parent' ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'bg-[#FF9500]/10 text-[#FF9500]'}`}>
                    {provider.type === 'Parent' ? <User size={22} strokeWidth={2.5} /> : <Building2 size={22} strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] font-bold text-black dark:text-white leading-tight truncate">{provider.name}</p>
                    <p className="text-[13px] font-medium text-gray-400">{provider.type} · #{provider.id}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#FF9500]/10 text-[#FF9500] text-[11px] font-black uppercase tracking-wider rounded-full shrink-0">
                    Pending
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleApprove(provider.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#34C759]/10 text-[#34C759] rounded-[14px] font-black text-[14px] active:scale-95 transition-all disabled:opacity-50"
                  >
                    <CheckCircle size={16} strokeWidth={2.5} />
                    {processing[provider.id] === 'approving' ? 'Approving…' : 'Approve'}
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleReject(provider.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF3B30]/10 text-[#FF3B30] rounded-[14px] font-black text-[14px] active:scale-95 transition-all disabled:opacity-50"
                  >
                    <XCircle size={16} strokeWidth={2.5} />
                    {processing[provider.id] === 'rejecting' ? 'Rejecting…' : 'Reject'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPendingApprovalsView;
