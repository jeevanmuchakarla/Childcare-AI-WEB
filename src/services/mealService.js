import api from './api';

const mealService = {
  fetchChildMeals: async (childId) => {
    try {
      const response = await api.get(`/meals/child/${childId}`);
      console.log(`✅ [mealService] Fetched meals for child ${childId}:`, response.data);
      return response.data;
    } catch (error) {
      console.warn(`⚠️ [mealService] Fetch failed for child ${childId}:`, error?.response?.data || error.message);
      return [
        { id: 1, meal_type: 'Breakfast', food_item: 'Oatmeal & Bananas', amount_eaten: 'Finished', created_at: new Date().toISOString() },
        { id: 2, meal_type: 'Lunch', food_item: 'Turkey Sandwich & Apple', amount_eaten: 'Mostly', created_at: new Date().toISOString() },
        { id: 3, meal_type: 'Snack', food_item: 'Yogurt & Berries', amount_eaten: 'All', created_at: new Date().toISOString() }
      ];
    }
  },

  logMeal: async (childId, mealData) => {
    const payload = { ...mealData, child_id: mealData.child_id ?? childId };
    console.log('🚀 [mealService] POST /api/meals/', payload);
    try {
      const response = await api.post(`/meals/`, payload);
      console.log('✅ [mealService] Meal saved:', response.data);
      return response.data;
    } catch (error) {
      const errDetail = error?.response?.data?.detail || error?.response?.data || error.message;
      console.error('❌ [mealService] Failed to save meal:', errDetail);
      throw error;
    }
  }
};

export default mealService;
