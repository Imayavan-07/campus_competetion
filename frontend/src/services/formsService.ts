import { api } from './apiClient';

export interface FormQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  options?: string[];
  required: boolean;
}

export interface RegFormConfig {
  formTitle: string;
  instructions: string;
  collectTeamInfo: boolean;
  collectDietary: boolean;
  collectTshirt: boolean;
  customQuestions: FormQuestion[];
}

export const formsService = {
  getConfig: async (eventId: number | string): Promise<{ success: boolean; data: { hasRegForm: boolean; config: RegFormConfig } }> => {
    return api.get(`/events/${eventId}/form`);
  },

  updateConfig: async (
    eventId: number | string,
    hasRegForm: boolean,
    config: RegFormConfig
  ): Promise<{ success: boolean; message: string; data: any }> => {
    return api.put(`/events/${eventId}/form`, { hasRegForm, config });
  },
};
