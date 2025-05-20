// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5130/api',
  headers: {
    'Accept': 'text/plain', // Header específico que tu backend necesita
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para errores 401 (se mantiene igual)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;