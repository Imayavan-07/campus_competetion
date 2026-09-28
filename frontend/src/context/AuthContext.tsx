import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService, User } from '../services/authService';
import {
  SESSION_DURATION_MS,
  getSessionStartTime,
  setSessionStartTime,
  checkIsSessionExpired,
  getAuthToken,
} from '../services/apiClient';

import { appCache } from '../utils/lruCache';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiredOpen: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
  handleConfirmSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(() => {
    // If session is already expired on initial load, do not load stored user
    if (checkIsSessionExpired()) {
      authService.logout();
      appCache.clear();
      return null;
    }
    return authService.getCurrentUser();
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState<boolean>(false);

  // Trigger automated logout and prompt with 50-minute expiration modal
  const triggerSessionExpired = useCallback(() => {
    authService.logout();
    appCache.clear();
    setUser(null);
    setSessionExpiredOpen(true);
  }, []);

  const handleConfirmSessionExpired = useCallback(() => {
    setSessionExpiredOpen(false);
    // Force navigate to login
    window.location.href = '/login';
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('unisync_user', JSON.stringify(updatedUser));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getMe();
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('unisync_user', JSON.stringify(res.user));
      }
    } catch (e) {
      console.warn('Could not refresh user details:', e);
    }
  }, []);

  // 1. Initial verification & session age check
  useEffect(() => {
    async function verifyUser() {
      try {
        const token = getAuthToken();
        if (token) {
          if (checkIsSessionExpired()) {
            triggerSessionExpired();
            return;
          }

          const res = await authService.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('unisync_user', JSON.stringify(res.user));
          } else {
            authService.logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.warn('Session verification notice:', e);
        // If /me returned 401 or network failed while having token, clear credentials
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    verifyUser();
  }, [triggerSessionExpired]);

  // 2. 50-Minute Session Expiration Timer
  useEffect(() => {
    if (!user) return;

    const startTime = getSessionStartTime() || Date.now();
    const elapsed = Date.now() - startTime;
    const remainingMs = Math.max(SESSION_DURATION_MS - elapsed, 0);

    if (remainingMs <= 0) {
      triggerSessionExpired();
      return;
    }

    const timer = setTimeout(() => {
      triggerSessionExpired();
    }, remainingMs);

    return () => clearTimeout(timer);
  }, [user, triggerSessionExpired]);

  // 3. Listen for global 401 / session expiration events dispatched by apiClient
  useEffect(() => {
    const handleExpiredEvent = () => {
      triggerSessionExpired();
    };

    window.addEventListener('unisync:session-expired', handleExpiredEvent);
    return () => {
      window.removeEventListener('unisync:session-expired', handleExpiredEvent);
    };
  }, [triggerSessionExpired]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await authService.login(email, password);
    setSessionStartTime(Date.now());
    setUser(res.user);
    setSessionExpiredOpen(false);
    return res.user;
  };

  const logout = async () => {
    await authService.logout();
    appCache.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !checkIsSessionExpired(),
        isLoading,
        sessionExpiredOpen,
        login,
        logout,
        updateUser,
        refreshUser,
        handleConfirmSessionExpired,
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
