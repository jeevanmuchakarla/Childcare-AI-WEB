import api from './api';

// Fetch platform stats (active capacity, live bookings, pending, match success)
export const fetchAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

// Fetch live bookings for today
export const fetchLiveBookings = async () => {
  const res = await api.get('/admin/metrics/live-bookings');
  return res.data;
};

// Fetch active capacity metrics
export const fetchCapacityMetrics = async () => {
  const res = await api.get('/admin/metrics/capacity');
  return res.data;
};

// Fetch pending provider approvals
export const fetchPendingProviders = async () => {
  const res = await api.get('/admin/providers/pending');
  return res.data;
};

// Fetch all users (for management)
export const fetchAllUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

// Approve a provider
export const approveProvider = async (providerId) => {
  const res = await api.post(`/admin/users/${providerId}/approve`);
  return res.data;
};

// Reject a provider
export const rejectProvider = async (providerId) => {
  const res = await api.put(`/admin/providers/${providerId}/reject`);
  return res.data;
};

export const fetchAllBookings = async () => {
  const res = await api.get('/admin/bookings');
  return res.data;
};
