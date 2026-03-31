import api from './api';

const photoService = {
  fetchChildPhotos: async (childId) => {
    try {
      const response = await api.get(`/upload/child/${childId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching child photos:', error);
      return [];
    }
  },
  uploadChildPhoto: async (childId, file, description = "") => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }
    const response = await api.post(`/upload/child/${childId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default photoService;
