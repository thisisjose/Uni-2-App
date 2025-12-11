import api from '../../services/api';
import { authService } from '../../services/auth';
import { LoginCredentials, RegisterData, User, UserRole } from '../models/User';

export class UserRepository {
  // Login
  async login(credentials: LoginCredentials) {
    return await authService.login(credentials.email, credentials.password);
  }

  // Registro - Map frontend roles to backend enum, but preserve actual role returned
  async register(userData: RegisterData) {
    // Map frontend role to backend-accepted value for register
    // Backend expects 'user' for normal volunteers; 'organizer' and 'admin' remain as-is
    let backendRole = 'user';
    if (userData.role === 'organizer') backendRole = 'organizer';
    if (userData.role === 'admin') backendRole = 'admin';

    const dataToSend = { ...userData, role: backendRole };
    console.log(`📤 Registering user ${userData.email} as backend role=${backendRole}`);
    return await authService.register(dataToSend);
  }  // Logout
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

  // Obtener todos los usuarios (solo admin)
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching users:', error.response?.data || error.message);
      return [];
    }
  }

  // Actualizar rol de usuario (solo admin)
  async updateUserRole(userId: string, role: UserRole): Promise<User | null> {
    try {
      // Send role as-is to backend (backend supports 'organizer')
      console.log(`📤 Sending role update: userId=${userId}, role=${role}`);
      const response = await api.patch(`/users/${userId}/role`, { role });
      console.log(`✅ Role update response:`, response.data.data);
      return response.data.data || null;
    } catch (error: any) {
      console.error('❌ Error updating user role:', error.response?.data || error.message);
      return null;
    }
  }

  // Activar / desactivar usuario (solo admin)
  async updateUserActive(userId: string, active: boolean): Promise<User | null> {
    try {
      const response = await api.patch(`/users/${userId}/active`, { active });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Error updating user active state:', error.response?.data || error.message);
      return null;
    }
  }
}