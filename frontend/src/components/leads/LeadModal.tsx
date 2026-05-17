import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../common/Modal';
import type { Lead } from '../../types';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  assignedTo: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Lead | null;
  isLoading?: boolean;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
      assignedTo: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        status: initialData.status,
        source: initialData.source,
        assignedTo: initialData.assignedTo?._id || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
        assignedTo: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (values: LeadFormValues) => {
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Lead' : 'Create New Lead'}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Status & Source Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Lead Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>}
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Lead Source <span className="text-red-500">*</span>
            </label>
            <select
              {...register('source')}
              className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            {errors.source && <p className="text-xs text-red-500 mt-1">{errors.source.message}</p>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-dark-200 dark:border-dark-800 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm shadow-brand-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{initialData ? 'Update Lead' : 'Create Lead'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
