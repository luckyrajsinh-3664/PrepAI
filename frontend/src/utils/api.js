import axios from 'axios';

// Directly point to your Render backend to eliminate localhost fallbacks
const API = axios.create({
  baseURL: 'https://prepai-backend-js10.onrender.com/api',
});

API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }

      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const user = JSON.parse(savedUser);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error('Error parsing token:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;