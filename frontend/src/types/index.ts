export type UserRole = 'Admin' | 'Sales User';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface DashboardStats {
  total: number;
  byStatus: {
    New: number;
    Contacted: number;
    Qualified: number;
    Lost: number;
  };
  bySource: {
    Website: number;
    Instagram: number;
    Referral: number;
  };
  recentLeads: Lead[];
}

export interface LeadsFilterParams {
  page?: number;
  limit?: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: 'Latest' | 'Oldest';
  export?: boolean;
}
