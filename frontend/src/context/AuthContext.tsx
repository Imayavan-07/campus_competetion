import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  switchPersona: (role: 'admin' | 'club' | 'student') => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifyUser() {
      try {
        if (localStorage.getItem('unisync_token')) {
          const res = await authService.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('unisync_user', JSON.stringify(res.user));
          }
        }
      } catch (e) {
        console.warn('Session verification error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    verifyUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await authService.login(email, password);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchPersona = async (role: 'admin' | 'club' | 'student'): Promise<User> => {
    let email = 'student@university.edu';
    let password = 'Student@123456';

    if (role === 'admin') {
      email = 'admin@university.edu';
      password = 'Admin@123456';
    } else if (role === 'club') {
      email = 'club.lead@university.edu';
      password = 'Club@123456';
    }

    try {
      return await login(email, password);
    } catch {
      // Offline fallback mock user
      const fallbackUser: User = {
        id: role === 'admin' ? 1 : role === 'club' ? 2 : 3,
        name: role === 'admin' ? 'Chief Administrator' : role === 'club' ? 'Bob Smith' : 'Alex Vance',
        email,
        role,
        status: 'Active',
      };
      setUser(fallbackUser);
      localStorage.setItem('unisync_user', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
