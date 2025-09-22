import axios, { AxiosResponse, AxiosError } from 'axios';
import { toastService } from './toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  } catch (e) {
    console.error('Error setting auth token in request:', e);
  }
  return config;
});

// Response interceptor for automatic toast notifications
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses
    const { data } = response;
    
    // Only show success toast for certain operations (not for GET requests)
    if (response.config.method !== 'get' && data?.message) {
      toastService.success(data.message);
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Handle error responses
    toastService.handleApiError(error);
    return Promise.reject(error);
  }
);

export default api;
