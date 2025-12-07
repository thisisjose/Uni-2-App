import { LoginCredentials, RegisterData, User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

export class AuthViewModel {
  private userRepository: UserRepository;
  
  constructor() {
    this.userRepository = new UserRepository();
  }

  // Estado
  user: User | null = null;
  isLoading = false;
  error: string | null = null;

  // Métodos
  async login(credentials: LoginCredentials) {
    this.isLoading = true;
    this.error = null;
    
    try {
      const result = await this.userRepository.login(credentials);
      
      if (result.success) {
        this.user = result.user;
        return { success: true, user: result.user };
      } else {
        this.error = result.message || 'Credenciales inválidas';
        return { success: false, message: this.error };
      }
    } catch (error: any) {
      this.error = error.message;
      return { success: false, message: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async register(userData: RegisterData) {
    this.isLoading = true;
    this.error = null;
    
    try {
      const result = await this.userRepository.register(userData);
      
      if (result.success) {
        this.user = result.user;
        return { success: true, user: result.user };
      } else {
        this.error = result.message || 'Error en el registro';
        return { success: false, message: this.error };
      }
    } catch (error: any) {
      this.error = error.message;
      return { success: false, message: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    await this.userRepository.logout();
    this.user = null;
  }

  async checkAuth() {
    const result = await this.userRepository.checkAuth();
    if (result.success) {
      this.user = result.user;
    }
    return result;
  }

  async isAdmin(): Promise<boolean> {
    return await this.userRepository.isAdmin();
  }
}