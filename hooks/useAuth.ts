import { useEffect, useState } from 'react';
import { User } from '../core/models/User';
import { UserRepository } from '../core/repositories/UserRepository';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userRepository = new UserRepository();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userRepository.checkAuth();
      if (result.success && result.user) {
        setUser(result.user);
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
      setUser(normalizedUser);
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
    
    // Convertir a UserRole válido
    const validRole: 'user' | 'admin' = (role === 'admin' ? 'admin' : 'user');
    
    const result = await userRepository.register({ 
      name, 
      email, 
      password, 
      role: validRole  // Ahora sí es UserRole
    });
    
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true, user: result.user };
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
    checkAuth
  };
};