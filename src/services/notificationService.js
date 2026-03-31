import api from './api';

const notificationService = {
  getNotifications: async (userId) => {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  },

  createNotification: async (notificationData) => {
    // notificationData: { user_id, title, message, type, child_id }
    const response = await api.post('/notifications/', notificationData);
    return response.data;
  },

  markAsRead: async (userId) => {
    const response = await api.patch(`/notifications/read-all/${userId}`);
    return response.data;
  },

  clearNotifications: async (userId) => {
    const response = await api.delete(`/notifications/${userId}`);
    return response.data;
  }
};

export default notificationService;
