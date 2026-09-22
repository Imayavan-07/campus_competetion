import { api } from './apiClient';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    fullUrl: string;
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
  };
}

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    return api.upload<UploadResponse>('/upload/image', file, 'file');
  },

  uploadPdf: async (file: File): Promise<UploadResponse> => {
    return api.upload<UploadResponse>('/upload/pdf', file, 'file');
  },
};
