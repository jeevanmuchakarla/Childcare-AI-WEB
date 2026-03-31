import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      localStorage.removeItem('user');
      return null;
    }
  },

  checkConnection: async () => {
    try {
      const response = await api.get('/health');
      return response.data.status === 'Healthy';
    } catch (error) {
      return false;
    }
  }
};

export default authService;
