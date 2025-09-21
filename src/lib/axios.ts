import axios from 'axios';

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
      config.headers = {
        ...(config.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  } catch (e) {
    console.error('Error setting auth token in request:', e);
  }
  return config;
});

export default api;
