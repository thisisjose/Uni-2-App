export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: UserRole;
}