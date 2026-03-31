import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const aiService = {
  fetchRecommendations: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/ai/recommendations`, {
        params: {
          provider_type: params.type,
          budget: params.budget,
          location: params.location === 'Anywhere in Chennai' ? null : params.location,
          age: params.age,
          timing: params.timing
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      throw error;
    }
  }
};

export default aiService;
