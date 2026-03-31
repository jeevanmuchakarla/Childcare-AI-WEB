import api from './api';

const activityService = {
  fetchChildActivities: async (childId) => {
    try {
      const response = await api.get(`/activities/child/${childId}`);
      console.log(`✅ [activityService] Fetched activities for child ${childId}:`, response.data);
      return response.data;
    } catch (error) {
      console.warn(`⚠️ [activityService] Fetch failed for child ${childId}:`, error?.response?.data || error.message);
      return [
        { id: 1, activity_type: 'Attendance', notes: 'Checked In', created_at: new Date().toISOString() },
        { id: 2, activity_type: 'Nap', notes: 'Slept well for 1 hour.', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, activity_type: 'Play', notes: 'Enjoyed building blocks with friends.', created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: 4, activity_type: 'Reading', notes: 'Listened to "The Very Hungry Caterpillar".', created_at: new Date(Date.now() - 10800000).toISOString() }
      ];
    }
  },

  logActivity: async (childId, activityData) => {
    const payload = { ...activityData, child_id: activityData.child_id ?? childId };
    console.log('🚀 [activityService] POST /api/activities/', payload);
    try {
      const response = await api.post(`/activities/`, payload);
      console.log('✅ [activityService] Activity saved:', response.data);
      return response.data;
    } catch (error) {
      const errDetail = error?.response?.data?.detail || error?.response?.data || error.message;
      console.error('❌ [activityService] Failed to save activity:', errDetail);
      throw error;
    }
  }
};

export default activityService;
