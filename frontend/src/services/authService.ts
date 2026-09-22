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

  logout: (): void => {
    removeAuthToken();
    localStorage.removeItem('unisync_user');
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
