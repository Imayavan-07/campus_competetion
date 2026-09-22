import { Request } from 'express';

export type UserRole = 'admin' | 'club' | 'student';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  dept?: string;
  assigned_club?: string;
  status: 'Active' | 'Inactive';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

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
  members_count: number;
  events_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  building: string;
  facilities: string;
}

export interface EventItem {
  id: number;
  title: string;
  club: string;
  category?: string;
  description: string;
  justification?: string;
  date: string;
  time_slot: string;
  month?: string;
  day?: string;
  venue: string;
  budget: string;
  attendees: number;
  status: string;
  approval_status: string;
  timeframe: string;
  lead_coordinator?: string;
  coordinator_email?: string;
  faculty_advisor?: string;
  student_host?: string;
  hosts_json?: any;
  agenda_json?: any;
  budget_breakdown_json?: any;
  ai_summary_json?: any;
  has_reg_form?: boolean;
  reg_form_config_json?: any;
  registration_json?: any;
  poster_url?: string | null;
  guidelines_pdf_url?: string | null;
  sampleDelegates?: any[];
  created_at?: string;
  updated_at?: string;
}
