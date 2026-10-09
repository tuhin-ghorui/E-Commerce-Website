import axios from 'axios';

// Dynamically use environment variable or fallback to local backend port 5000
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Normalize: strip trailing slashes, ensure it ends with /api
const cleanUrl = rawUrl.replace(/\/+$/, '');
const API_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically add JWT token to requests if it exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
