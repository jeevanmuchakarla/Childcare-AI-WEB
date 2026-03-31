import api from './api';

const profileService = {
  fetchProfile: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/profile/', profileData);
    return response.data;
  },

  fetchUsersByRole: async (role) => {
    // Backend expects 'Parent', 'Preschool', 'Daycare', 'Admin'
    const response = await api.get(`/profile/users-by-role/${role}`);
    return response.data;
  }
};

export default profileService;
