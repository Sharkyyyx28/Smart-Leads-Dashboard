import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { ApiResponse, DashboardStats, Lead, LeadsFilterParams } from '../types';
import toast from 'react-hot-toast';

export const useLeads = (params?: LeadsFilterParams) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Lead[]>>('/leads', { params });
      return { leads: data.data || [], meta: data.meta };
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useLeadById = (id: string) => {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['leads-stats'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DashboardStats>>('/leads/stats');
      return data.data;
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLead: Partial<Lead>) => {
      const { data } = await api.post<ApiResponse<Lead>>('/leads', newLead);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Lead created successfully');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lead> }) => {
      const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
      return response.data.data;
    },
    // Optimistic Update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      const previousLeads = queryClient.getQueryData(['leads']);

      queryClient.setQueriesData({ queryKey: ['leads'] }, (old: any) => {
        if (!old || !old.leads) return old;
        return {
          ...old,
          leads: old.leads.map((lead: Lead) => (lead._id === id ? { ...lead, ...data } : lead)),
        };
      });

      return { previousLeads };
    },
    onError: (_err, _newLead, context) => {
      if (context?.previousLeads) {
        queryClient.setQueriesData({ queryKey: ['leads'] }, context.previousLeads);
      }
      toast.error('Failed to update lead');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const previousLeads = queryClient.getQueryData(['leads']);

      queryClient.setQueriesData({ queryKey: ['leads'] }, (old: any) => {
        if (!old || !old.leads) return old;
        return {
          ...old,
          leads: old.leads.filter((lead: Lead) => lead._id !== id),
        };
      });

      return { previousLeads };
    },
    onError: (_err, _id, context) => {
      if (context?.previousLeads) {
        queryClient.setQueriesData({ queryKey: ['leads'] }, context.previousLeads);
      }
      toast.error('Failed to delete lead');
    },
    onSuccess: () => {
      toast.success('Lead deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });
};

export const exportLeadsCsv = async (params?: LeadsFilterParams) => {
  try {
    const response = await api.get('/leads', {
      params: { ...params, export: true },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    toast.success('CSV Export downloaded successfully');
  } catch (error) {
    toast.error('Failed to export leads');
  }
};
