import { Types } from 'mongoose';

export type UserRole = 'Admin' | 'Sales User';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJwtPayload {
  id: string;
  role: UserRole;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: Types.ObjectId; // Optional: To support Sales User managing only permitted leads
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}
