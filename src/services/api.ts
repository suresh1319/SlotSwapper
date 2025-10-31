import axios from 'axios';
import { Event, SwapRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Events API
export const eventsAPI = {
  getMyEvents: () => api.get<Event[]>('/events'),
  createEvent: (data: { title: string; startTime: string; endTime: string }) =>
    api.post<Event>('/events', data),
  updateEventStatus: (id: string, status: string) =>
    api.patch<Event>(`/events/${id}/status`, { status }),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),
};

// Swaps API
export const swapsAPI = {
  getSwappableSlots: () => api.get<Event[]>('/swaps/swappable-slots'),
  createSwapRequest: (data: { mySlotId: string; theirSlotId: string }) =>
    api.post<SwapRequest>('/swaps/swap-request', data),
  respondToSwap: (requestId: string, accept: boolean) =>
    api.post<SwapRequest>(`/swaps/swap-response/${requestId}`, { accept }),
  getIncomingRequests: () => api.get<SwapRequest[]>('/swaps/incoming'),
  getOutgoingRequests: () => api.get<SwapRequest[]>('/swaps/outgoing'),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) =>
    api.put('/profile', data),
};