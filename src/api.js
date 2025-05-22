// src/api.js
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; 

const api = axios.create({
  baseURL: 'http://localhost:5130/api',
  headers: {
    'Accept': 'text/plain', 
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token y validar si está expirado
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    // Decodificar el token para verificar su fecha de expiración
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; 
      const currentTime = Date.now();
      
      if (currentTime >= expirationTime) {
        // Si el token ha expirado, eliminarlo y redirigir al login
        localStorage.removeItem('token');
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        config.headers.Authorization = `Bearer ${token}`; // Agregar token a la cabecera
      }
    } catch (error) {
      // Si ocurre algún error al decodificar el token (token mal formado, etc.)
      console.error("Error al decodificar el token:", error);
      localStorage.removeItem('token');
      alert('Token inválido. Por favor, inicia sesión nuevamente.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500); 
    }
  }
  return config;
});

// Interceptor para manejar errores 401 y 403
api.interceptors.response.use(
  response => response,
  error => {
    // Si la respuesta es 401 o 403, eliminamos el token y redirigimos al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500); 
    }

    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      alert('Permisos inválidos. No tienes acceso a esta sección.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500); 
    }

    return Promise.reject(error);
  }
);

export default api;
