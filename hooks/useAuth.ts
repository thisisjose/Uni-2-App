import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { User } from '../core/models/User';
import { UserRepository } from '../core/repositories/UserRepository';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userRepository = new UserRepository();
  const ORGANIZERS_KEY = 'organizersList';

  const applyOrganizerOverride = async (user: any) => {
    if (!user) return user;
    try {
      const raw = await AsyncStorage.getItem(ORGANIZERS_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const userId = user.id || user._id;
      if (userId && list.includes(userId)) {
        return { ...user, role: 'organizer' as any };
      }
    } catch (e) {
      console.warn('Could not apply organizer override', e);
    }
    return user;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userRepository.checkAuth();
      if (result.success && result.user) {
        // Normalize user from storage
        const normalizedUser = {
          ...result.user,
          _id: result.user._id || result.user.id,
          id: result.user.id || result.user._id
        };
        const finalUser = await applyOrganizerOverride(normalizedUser);
        console.log('🔍 checkAuth - Normalized user (with overrides):', finalUser);
        setUser(finalUser);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      console.error('🔴 useAuth checkAuth error:', err);
      setError(err.message || 'Error en autenticación');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

const login = async (email: string, password: string) => {
  try {
    const result = await userRepository.login({ email, password });
    if (result.success && result.user) {
      const normalizedUser = {
        ...result.user,
        _id: result.user._id || result.user.id,
        id: result.user.id || result.user._id
      };
      const finalUser = await applyOrganizerOverride(normalizedUser);
      console.log('✅ Login success (with overrides):', finalUser);
      setUser(finalUser);
    }
    return result;
  } catch (err: any) {
    console.error('🔴 Login error:', err);
    return { success: false, message: err.message || 'Error de login' };
  }
};

  const register = async (name: string, email: string, password: string, role: string = 'user') => {
  try {
    setLoading(true);
    setError(null);
    
    // Convertir a UserRole válido (user | organizer | admin)
    let validRole: 'user' | 'organizer' | 'admin' = 'user';
    if (role === 'organizer') validRole = 'organizer';
    if (role === 'admin') validRole = 'admin';
    
    const result = await userRepository.register({ 
      name, 
      email, 
      password, 
      role: validRole  // Ahora sí es UserRole
    });
    
    if (result.success && result.user) {
      const normalizedUser = {
        ...result.user,
        _id: result.user._id || result.user.id,
        id: result.user.id || result.user._id
      };
      const finalUser = await applyOrganizerOverride(normalizedUser);
      console.log('✅ Register success (with overrides):', finalUser);
      setUser(finalUser);
      return { success: true, user: normalizedUser };
    } else {
      setError(result.message || 'Error en registro');
      return { success: false, message: result.message };
    }
  } catch (err: any) {
    console.error('🔴 Register error:', err);
    setError(err.message || 'Error en registro');
    return { success: false, message: err.message || 'Error en registro' };
  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    try {
      await userRepository.logout();
      setUser(null);
      setError(null);
    } catch (err: any) {
      console.error('🔴 Logout error:', err);
      setError(err.message);
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      if (profile.success && profile.user) {
        const normalizedUser = {
          ...profile.user,
          _id: profile.user._id || profile.user.id,
          id: profile.user.id || profile.user._id
        };
        const finalUser = await applyOrganizerOverride(normalizedUser);
        console.log('🔄 refreshProfile success (with overrides):', finalUser);
        setUser(finalUser);
        return { success: true, user: finalUser };
      }
      return { success: false };
    } catch (err: any) {
      console.error('🔴 refreshProfile error:', err);
      return { success: false, message: err.message };
    }
  };

  const isAdmin = async (): Promise<boolean> => {
    try {
      return await userRepository.isAdmin();
    } catch (err) {
      console.error('🔴 isAdmin error:', err);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    checkAuth,
    refreshProfile
  };
};