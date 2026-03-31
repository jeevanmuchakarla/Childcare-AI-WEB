import api from './api';

const messageService = {
  getInbox: async () => {
    const response = await api.get('/messages/inbox');
    return response.data;
  },
  
  getConversation: async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },
  
  sendMessage: async (receiverId, content, imageUrl = null) => {
    const response = await api.post('/messages/', {
      receiver_id: receiverId,
      content,
      image_url: imageUrl
    });
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread_count');
    return response.data;
  },
  
  markRead: async (senderId) => {
    const response = await api.post(`/messages/mark_read/${senderId}`);
    return response.data;
  },
  
  deleteConversation: async (userId) => {
    const response = await api.delete(`/messages/conversation/${userId}`);
    return response.data;
  }
};

export default messageService;
