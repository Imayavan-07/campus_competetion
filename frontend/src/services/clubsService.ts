import { api } from './apiClient';

export interface Club {
  id: number;
  name: string;
  dept: string;
  president: string;
  coordinator: string;
  email: string;
  phone?: string;
  description?: string;
  category?: string;
  logo_url?: string | null;
  constitution_pdf_url?: string | null;
  members: number;
  events: number;
  members_count?: number;
  events_count?: number;
  created_at?: string;
  updated_at?: string;
}

export const clubsService = {
  getClubs: async (params?: {
    search?: string;
    dept?: string;
    sortBy?: string;
    minMembers?: number | string;
    minEvents?: number | string;
  }): Promise<any> => {
    const res = await api.get('/clubs', params);
    const list: any = Array.isArray(res) ? [...res] : (res?.data ? [...res.data] : []);
    list.data = list;
    list.success = true;
    list.total = res?.total !== undefined ? res.total : list.length;
    return list;
  },

  getClubById: async (id: number | string): Promise<{ success: boolean; data: Club }> => {
    const res = await api.get(`/clubs/${id}`);
    const item = res?.data || res;
    return { success: true, data: item };
  },

  createClub: async (data: Partial<Club>): Promise<{ success: boolean; data: Club; message: string }> => {
    return api.post('/clubs', data);
  },

  updateClub: async (id: number | string, data: Partial<Club>): Promise<{ success: boolean; data: Club; message: string }> => {
    return api.put(`/clubs/${id}`, data);
  },

  deleteClub: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/clubs/${id}`);
  },
};
