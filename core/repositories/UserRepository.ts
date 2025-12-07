import { authService } from '../../services/auth';
import { LoginCredentials, RegisterData, User, UserRole } from '../models/User';

export class UserRepository {
  // Login
  async login(credentials: LoginCredentials) {
    return await authService.login(credentials.email, credentials.password);
  }

  // Registro - FIX: Asegurar que role sea UserRole
  async register(userData: RegisterData) {
    // Validar que role sea válido
    const validRole: UserRole = (userData.role === 'admin' ? 'admin' : 'user');
    
    const dataToSend = {
      ...userData,
      role: validRole
    };
    
    return await authService.register(dataToSend);
  }

  // Logout
  async logout() {
    await authService.logout();
  }

  // Verificar autenticación
  async checkAuth() {
    return await authService.checkAuth();
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    const result = await authService.checkAuth();
    return result.success ? result.user : null;
  }

  // Verificar si es admin
  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  }
}