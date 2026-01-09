export enum UserRole {
  COACH = 'coach',
  PLAYER = 'player',
  PARENT = 'parent',
  FAN = 'fan',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
