import { z } from 'zod';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).default('New'),
    source: z.enum(['Website', 'Instagram', 'Referral']),
    assignedTo: z.string().optional(),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Lead ID'),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
    assignedTo: z.string().optional(),
  }),
});

export const getLeadSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Lead ID'),
  }),
});

export const queryLeadsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
    search: z.string().optional(),
    sort: z.enum(['Latest', 'Oldest']).optional(),
    export: z.enum(['true', 'false']).optional(),
  }),
});
