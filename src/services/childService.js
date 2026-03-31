import api from './api';

const childService = {
  fetchChildren: async (parentId) => {
    const response = await api.get(`/profile/${parentId}/children`);
    return response.data;
  },

  addChild: async (parentId, childData) => {
    const response = await api.post(`/profile/${parentId}/children`, childData);
    return response.data;
  },

  getChildDetails: async (childId) => {
    const response = await api.get(`/children/${childId}`);
    return response.data;
  },
  
  fetchProviderChildren: async (providerId) => {
    const response = await api.get(`/bookings/provider/${providerId}/children`);
    return response.data;
  }
};

export default childService;
