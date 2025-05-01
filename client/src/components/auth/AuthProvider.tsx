import { useState, useEffect } from 'react';
import { AuthContext, loginUser, logoutUser, isAuthenticated as checkAuth } from '@/lib/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
  }, []);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    const success = await loginUser(username, password);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };
  
  const logout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;