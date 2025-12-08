import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Función para normalizar user (agregar ambos _id e id)
const normalizeUser = (user: any) => {
  if (!user) return user;
  
  return {
    ...user,
    _id: user._id || user.id,  // Asegurar _id
    id: user.id || user._id    // Asegurar id
  };
};

export const authService = {
  // Login
  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Login attempt:', email);
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      // Normalizar user antes de guardar
      const normalizedUser = normalizeUser(user);
      console.log('✅ Login success - User normalized:', {
        originalId: user._id || user.id,
        normalized: normalizedUser
      });
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(normalizedUser));
      
      return { success: true, user: normalizedUser, token };
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Registro
  register: async (userData: any) => {
    try {
      console.log('📝 Register attempt:', userData.email);
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;
      
      // Normalizar user antes de guardar
      const normalizedUser = normalizeUser(user);
      console.log('✅ Register success - User normalized:', normalizedUser);
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(normalizedUser));
      
      return { success: true, user: normalizedUser, token };
    } catch (error: any) {
      console.error('❌ Register error:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión' 
      };
    }
  },

  // Logout
  logout: async () => {
    console.log('🚪 Logout');
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  },

  // Verificar si hay sesión activa
  checkAuth: async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      // Normalizar user al cargar desde storage
      const normalizedUser = normalizeUser(user);
      console.log('🔍 checkAuth - User loaded:', normalizedUser);
      
      return { 
        success: true, 
        user: normalizedUser, 
        token 
      };
    }
    console.log('🔍 checkAuth - No session found');
    return { success: false };
  }
};