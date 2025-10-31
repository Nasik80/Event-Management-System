import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

interface User {
  id: number;
  username: string;
  full_name: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, fullName: string, email?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/token/', { username, password });
    const { access, refresh } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    // Fetch user details
    const userResponse = await api.get('/auth/user/');
    const userData = userResponse.data;
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (username: string, password: string, fullName: string, email?: string) => {
    await api.post('/auth/register/', {
      username,
      password,
      full_name: fullName,
      email,
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
