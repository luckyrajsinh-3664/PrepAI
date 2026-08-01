import axios from 'axios';

// Check environment variables first, fallback directly to live Render backend
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_API_URL || 
  'https://prepai-backend-js10.onrender.com/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Safe request interceptor
API.interceptors.request.use(
  (config) => {
    try {
      // 1. First check direct token storage
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }

      // 2. Fallback to check nested token inside user object
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const user = JSON.parse(savedUser);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error('Error parsing token from storage:', error);
      // Clean up corrupt storage items
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;