import React from 'react';
import { Modal } from '../common/Modal';
import type { Lead } from '../../types';
import { Mail, User, Calendar, Tag, Globe, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ isOpen, onClose, lead }) => {
  if (!lead) return null;

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
      case 'Qualified':
        return 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border-brand-200 dark:border-brand-800/50';
      case 'Lost':
        return 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800/50';
    }
  };

  const getSourceBadge = (source: Lead['source']) => {
    switch (source) {
      case 'Website':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/50';
      case 'Instagram':
        return 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border-pink-200 dark:border-pink-800/50';
      case 'Referral':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details">
      <div className="space-y-6 py-2">
        {/* Header Profile Section */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-brand-500/20">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-dark-900 dark:text-white">{lead.name}</h4>
            <p className="text-sm text-dark-500 dark:text-dark-400 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{lead.email}</span>
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div className="p-4 rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 space-y-1.5">
            <div className="text-xs font-medium text-dark-500 dark:text-dark-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Current Status</span>
            </div>
            <div>
              <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold border', getStatusBadge(lead.status))}>
                {lead.status}
              </span>
            </div>
          </div>

          {/* Source */}
          <div className="p-4 rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 space-y-1.5">
            <div className="text-xs font-medium text-dark-500 dark:text-dark-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Lead Source</span>
            </div>
            <div>
              <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold border', getSourceBadge(lead.source))}>
                {lead.source}
              </span>
            </div>
          </div>

          {/* Assigned To */}
          <div className="p-4 rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 space-y-1.5">
            <div className="text-xs font-medium text-dark-500 dark:text-dark-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Assigned Sales Rep</span>
            </div>
            <div className="text-sm font-semibold text-dark-900 dark:text-white">
              {lead.assignedTo?.name || 'Unassigned'}
            </div>
          </div>

          {/* Created By */}
          <div className="p-4 rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 space-y-1.5">
            <div className="text-xs font-medium text-dark-500 dark:text-dark-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Created By</span>
            </div>
            <div className="text-sm font-semibold text-dark-900 dark:text-white">
              {lead.createdBy?.name || 'Admin'}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="p-4 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-dark-500 dark:text-dark-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created: {new Date(lead.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last Updated: {new Date(lead.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
