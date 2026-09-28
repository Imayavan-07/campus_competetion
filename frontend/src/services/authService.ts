import { api, setAuthToken, removeAuthToken } from './apiClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'club' | 'student';
  phone?: string;
  dept?: string;
  assigned_club?: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    if (res.token) {
      setAuthToken(res.token);
      localStorage.setItem('unisync_user', JSON.stringify(res.user));
    }
    return res;
  },

  register: async (name: string, email: string, password: string, phone?: string, dept?: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password, phone, dept });
    if (res.token) {
      setAuthToken(res.token);
      localStorage.setItem('unisync_user', JSON.stringify(res.user));
    }
    return res;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    return api.get('/auth/me');
  },

  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user: User; message: string }> => {
    const res = await api.put<{ success: boolean; user: User; message: string }>('/auth/profile', data);
    if (res.user) {
      localStorage.setItem('unisync_user', JSON.stringify(res.user));
    }
    return res;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Ignore network failures on logout; local session must still be killed immediately
    } finally {
      removeAuthToken();
      localStorage.removeItem('unisync_user');
      sessionStorage.clear();
    }
  },

  getCurrentUser: (): User | null => {
    const raw = localStorage.getItem('unisync_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};

