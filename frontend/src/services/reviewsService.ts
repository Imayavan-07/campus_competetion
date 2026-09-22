import { api } from './apiClient';

export interface EventReviewFeedback {
  id: number;
  name: string;
  collegeName: string;
  mailId: string;
  rating: number;
  date: string;
  feedback: string;
}

export interface EventReviewGroup {
  id: number;
  eventId: number;
  title: string;
  club: string;
  date: string;
  venue: string;
  overallRating: number;
  turnoutRate: string;
  totalReviews: number;
  adminEventFeedback?: {
    feedback: string;
    adminName: string;
    date: string;
  } | null;
  organizerReply?: {
    reply: string;
    organizerName: string;
    date: string;
  } | null;
  reviews: EventReviewFeedback[];
}

export type ReviewGroup = EventReviewGroup;

export const reviewsService = {
  getReviews: async (params?: { eventId?: number | string; club?: string }): Promise<EventReviewGroup[]> => {
    const res = await api.get('/reviews', params);
    return Array.isArray(res) ? res : (res?.data || []);
  },

  submitStudentFeedback: async (
    id: number | string,
    data: { name: string; collegeName: string; mailId: string; rating: number; feedback: string }
  ): Promise<{ success: boolean; data: any; message: string }> => {
    return api.post(`/reviews/${id}/feedback`, data);
  },

  submitAdminFeedback: async (
    id: number | string,
    feedback: string,
    adminName?: string
  ): Promise<{ success: boolean; data: any; message: string }> => {
    return api.post(`/reviews/${id}/admin-feedback`, { feedback, adminName });
  },

  submitOrganizerReply: async (
    id: number | string,
    reply: string,
    organizerName?: string
  ): Promise<{ success: boolean; data: any; message: string }> => {
    return api.post(`/reviews/${id}/organizer-reply`, { reply, organizerName });
  },
};
