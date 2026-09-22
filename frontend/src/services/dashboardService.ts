import { api } from './apiClient';

export interface DashboardData {
  metrics: {
    totalClubs: number;
    totalEvents: number;
    totalStudents: number;
    pendingApprovals: number;
    activeTournaments: number;
  };
  upcomingEvents: any[];
  pendingProposals: any[];
  recentActivity: Array<{
    id: number;
    title: string;
    time: string;
    type: string;
  }>;
}

export const dashboardService = {
  getStats: async (): Promise<{ success: boolean; data: DashboardData }> => {
    try {
      const res = await api.get('/dashboard/stats');
      const data = res?.data || res || {};
      return {
        success: true,
        data: {
          metrics: data.metrics || {
            totalClubs: 6,
            totalEvents: 17,
            totalStudents: 3450,
            pendingApprovals: 3,
            activeTournaments: 2,
          },
          upcomingEvents: Array.isArray(data.upcomingEvents) ? data.upcomingEvents : [],
          pendingProposals: Array.isArray(data.pendingProposals) ? data.pendingProposals : [],
          recentActivity: Array.isArray(data.recentActivity) ? data.recentActivity : [],
        },
      };
    } catch (e) {
      return {
        success: false,
        data: {
          metrics: {
            totalClubs: 6,
            totalEvents: 17,
            totalStudents: 3450,
            pendingApprovals: 3,
            activeTournaments: 2,
          },
          upcomingEvents: [],
          pendingProposals: [],
          recentActivity: [],
        },
      };
    }
  },
};
