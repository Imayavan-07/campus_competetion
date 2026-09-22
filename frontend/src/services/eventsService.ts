import { api } from './apiClient';

export interface EventItem {
  id: number;
  title: string;
  club: string;
  category?: string;
  description: string;
  justification?: string;
  date: string;
  timeSlot: string;
  time_slot?: string;
  month?: string;
  day?: string;
  venue: string;
  budget: string;
  attendees: number;
  status: string;
  approvalStatus: string;
  approval_status?: string;
  timeframe: string;
  leadCoordinator?: string;
  lead_coordinator?: string;
  coordinatorEmail?: string;
  coordinator_email?: string;
  facultyAdvisor?: string;
  studentHost?: string;
  agenda: Array<{ time: string; title: string }>;
  budgetBreakdown: {
    prizeMoney: number;
    refreshments: number;
    decors: number;
    miscPurchases: number;
    customItems: Array<{ id: string; name: string; amount: number }>;
  };
  aiSummary: {
    feasibilityScore: string;
    riskAssessment: string;
    executiveSummary: string;
    recommendation: string;
    highlights?: string[];
    tags: string[];
  };
  hasRegForm: boolean;
  regFormConfig?: any;
  registration?: {
    totalRegistered: number;
    maxCapacity: number;
    deadline: string;
    status: string;
    targetAudience: string;
  };
  sampleDelegates?: any[];
  poster_url?: string | null;
  guidelines_pdf_url?: string | null;
}

export const eventsService = {
  getEvents: async (params?: {
    status?: string;
    approvalStatus?: string;
    timeframe?: string;
    club?: string;
    search?: string;
  }): Promise<any> => {
    const res = await api.get('/events', params);
    const list: any = Array.isArray(res) ? [...res] : (res?.data ? [...res.data] : []);
    list.data = list;
    list.success = true;
    list.total = res?.total !== undefined ? res.total : list.length;
    return list;
  },

  getEventById: async (id: number | string): Promise<{ success: boolean; data: EventItem }> => {
    const res = await api.get(`/events/${id}`);
    const item = res?.data || res;
    return { success: true, data: item };
  },

  createEvent: async (data: any): Promise<{ success: boolean; data: EventItem; message: string }> => {
    return api.post('/events', data);
  },

  updateEvent: async (id: number | string, data: any): Promise<{ success: boolean; data: EventItem; message: string }> => {
    return api.put(`/events/${id}`, data);
  },

  updateStatus: async (
    id: number | string,
    status: string,
    approvalStatus?: string
  ): Promise<{ success: boolean; message: string }> => {
    return api.patch(`/events/${id}/status`, { status, approvalStatus });
  },

  updateBudget: async (
    id: number | string,
    budgetBreakdown: any,
    budget?: number | string
  ): Promise<{ success: boolean; message: string }> => {
    return api.patch(`/events/${id}/budget`, { budgetBreakdown, budget });
  },

  updateVenue: async (id: number | string, venue: string): Promise<{ success: boolean; message: string }> => {
    return api.patch(`/events/${id}/venue`, { venue });
  },

  deleteEvent: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/events/${id}`);
  },
};
