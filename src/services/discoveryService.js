import api from './api';

const discoveryService = {
  fetchProviders: async (role = null) => {
    const params = role ? { role } : {};
    const response = await api.get('/providers/', { params });
    return response.data.providers || [];
  },

  fetchCounts: async () => {
    const response = await api.get('/providers/counts');
    return response.data;
  },

  getProviderDetails: async (providerId) => {
    const response = await api.get(`/providers/${providerId}`);
    return response.data;
  }
};

export default discoveryService;
