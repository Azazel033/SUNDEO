// src/api.js
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Configuración inicial
const api = axios.create({
  baseURL: 'http://localhost:5130/api',
  headers: {
    'Accept': 'text/plain',
    'Content-Type': 'application/json',
  },
});

// Variables para control de redirección y cancelación
let isRedirecting = false;
const cancelTokenSource = axios.CancelToken.source();

// Función para mostrar notificaciones (reemplaza alert)
const showNotification = (message) => {
  // Usa tu sistema de notificaciones preferido (Toast, Snackbar, etc)
  console.warn(message);
};

// Interceptor de request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      
      if (Date.now() >= expirationTime) {
        if (!isRedirecting) {
          isRedirecting = true;
          localStorage.removeItem('token');
          showNotification('Sesión expirada. Redirigiendo...');
          
          // Cancela todas las peticiones pendientes
          cancelTokenSource.cancel('Token expirado, cancelando peticiones');
          
          // Redirige después de breve delay (opcional)
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
        
        // Cancela esta petición específica
        return {
          ...config,
          cancelToken: cancelTokenSource.token
        };
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error al decodificar token:", error);
      localStorage.removeItem('token');
      if (!isRedirecting) {
        isRedirecting = true;
        showNotification('Error de autenticación. Redirigiendo...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
      return Promise.reject(error);
    }
  }
  
  return config;
});

// Interceptor de response
api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isCancel(error)) {
      // No hacer nada si fue cancelación intencional
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem('token');
        showNotification(
          error.response.status === 401 
            ? 'Sesión expirada' 
            : 'Acceso no autorizado'
        );
        
        // Cancela peticiones pendientes
        cancelTokenSource.cancel('Redirección por error de autenticación');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;