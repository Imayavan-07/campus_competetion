import { api } from './apiClient';

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  building: string;
  facilities: string;
}

export const venuesService = {
  getVenues: async (): Promise<any> => {
    const res = await api.get('/venues');
    const list: any = Array.isArray(res) ? [...res] : (res?.data ? [...res.data] : []);
    list.data = list;
    list.success = true;
    list.total = res?.total !== undefined ? res.total : list.length;
    return list;
  },
};
