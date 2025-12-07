import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// URL de tu API hosteada
const API_URL = 'https://uni-2-api.onrender.com/api';

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