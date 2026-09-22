import { api } from './apiClient';

export interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  dept: string;
  assignedClub: string;
  status: 'Active' | 'Inactive';
}

export const membersService = {
  getMembers: async (params?: {
    search?: string;
    role?: string;
    dept?: string;
    status?: string;
    sortBy?: string;
  }): Promise<any> => {
    const res = await api.get('/members', params);
    const list: any = Array.isArray(res) ? [...res] : (res?.data ? [...res.data] : []);
    list.data = list;
    list.success = true;
    list.total = res?.total !== undefined ? res.total : list.length;
    return list;
  },

  createMember: async (data: Partial<Member>): Promise<{ success: boolean; data: Member; message: string }> => {
    return api.post('/members', data);
  },

  updateMember: async (id: number | string, data: Partial<Member>): Promise<{ success: boolean; data: Member; message: string }> => {
    return api.put(`/members/${id}`, data);
  },

  toggleStatus: async (id: number | string): Promise<{ success: boolean; data: { id: number; status: 'Active' | 'Inactive' }; message: string }> => {
    return api.patch(`/members/${id}/status`);
  },

  deleteMember: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/members/${id}`);
  },
};
