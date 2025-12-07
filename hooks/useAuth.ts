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
      const result = await userRepository.checkAuth();
      if (result.success) {
        setUser(result.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userRepository.login({ email, password });
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        setError(result.message || 'Error en login');
        return { success: false, message: result.message };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
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
    
    if (result.success) {
      setUser(result.user);
      return { success: true, user: result.user };
    } else {
      setError(result.message || 'Error en registro');
      return { success: false, message: result.message };
    }
  } catch (err: any) {
    setError(err.message);
    return { success: false, message: err.message };
  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    await userRepository.logout();
    setUser(null);
  };

  const isAdmin = async (): Promise<boolean> => {
    return await userRepository.isAdmin();
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