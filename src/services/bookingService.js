import api from './api';

const bookingService = {
  fetchBookings: async (parentId) => {
    const response = await api.get(`/bookings/parent/${parentId}`);
    return response.data;
  },

  fetchProviderBookings: async (providerId) => {
    const response = await api.get(`/bookings/provider/${providerId}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data.booking;
  }
};

export default bookingService;
