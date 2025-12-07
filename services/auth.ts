import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const authService = {
  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Registro
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Logout
  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  },

  // Verificar si hay sesión activa
  checkAuth: async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    
    if (token && userData) {
      return { 
        success: true, 
        user: JSON.parse(userData), 
        token 
      };
    }
    return { success: false };
  }
};