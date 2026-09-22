import { api } from './apiClient';

export interface Delegate {
  id: number;
  eventId: number;
  name: string;
  reg: string;
  email: string;
  track: string;
  teamName?: string;
  status: string;
  checkedIn: boolean;
  ticketId: string;
  formResponses?: any;
  resumeOrDocUrl?: string;
  createdAt?: string;
}

export const registrationsService = {
  getRegistrations: async (eventId?: number | string): Promise<any> => {
    const res = await api.get('/registrations', { eventId });
    const list: any = Array.isArray(res) ? [...res] : (res?.data ? [...res.data] : []);
    list.data = list;
    list.success = true;
    list.total = res?.total !== undefined ? res.total : list.length;
    return list;
  },

  register: async (data: {
    eventId: number;
    studentName: string;
    studentRegNo: string;
    email: string;
    track?: string;
    teamName?: string;
    formResponses?: any;
    resumeOrDocUrl?: string;
  }): Promise<{ success: boolean; data: any; message: string }> => {
    return api.post('/registrations', data);
  },

  updateStatus: async (
    id: number | string,
    checkedIn?: boolean,
    status?: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.patch(`/registrations/${id}/status`, { checkedIn, status });
  },
};
