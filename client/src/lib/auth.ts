// auth.ts - Using a different approach without JSX in this file
import { createContext, useContext } from 'react';
import { apiRequest } from './queryClient';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
};

// Create the context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Export the context for use in a separate component file
export { AuthContext };

// Export auth utility functions
export async function loginUser(username: string, password: string): Promise<boolean> {
  try {
    const response = await apiRequest('POST', '/api/auth/admin/login', { username, password });
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('auth', 'true');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export function logoutUser(): void {
  localStorage.removeItem('auth');
}

export function isAuthenticated(): boolean {
  return localStorage.getItem('auth') === 'true';
}
