import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Determine API base depending on environment and platform to support local testing
const PROD_API = 'https://uni-2-api.onrender.com/api';

// NOTE: For testing against the hosted API we always use PROD_API here.
// If you need local testing you can uncomment the DEV_API block below
// and set the desired host (or use an environment variable).
const API_URL = PROD_API;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Minimal debug: method + url + whether Authorization header is present
    try {
      const hasAuth = !!config.headers?.Authorization;
      console.debug(`[api] ${config.method?.toUpperCase() || 'GET'} ${config.baseURL}${config.url} - auth:${hasAuth}`);
    } catch (err) {
      // ignore logging errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default api;