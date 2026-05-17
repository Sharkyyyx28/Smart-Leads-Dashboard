import React from 'react';
import type { Lead } from '../../types';
import { Edit2, Trash2, Eye, Calendar, UserCheck } from 'lucide-react';
import clsx from 'clsx';

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onEdit, onDelete, onView }) => {
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

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-12 text-center space-y-3 transition-colors duration-200">
        <div className="w-12 h-12 rounded-full bg-dark-50 dark:bg-dark-800 text-dark-400 mx-auto flex items-center justify-center">
          <UserCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-dark-900 dark:text-white">No Leads Found</h3>
        <p className="text-sm text-dark-500 dark:text-dark-400 max-w-sm mx-auto">
          We couldn't find any leads matching your active filters. Try resetting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-200 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-200 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-950/50 text-dark-500 dark:text-dark-400 text-xs font-semibold uppercase tracking-wider">
            <th className="py-4 px-6">Lead Info</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Source</th>
            <th className="py-4 px-6">Assigned To</th>
            <th className="py-4 px-6">Created</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-100 dark:divide-dark-800 text-sm tracking-normal">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="group hover:bg-dark-50/50 dark:hover:bg-dark-800/30 transition-colors duration-150"
            >
              {/* Lead Info */}
              <td className="py-4 px-6">
                <div className="font-medium text-dark-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {lead.name}
                </div>
                <div className="text-xs text-dark-500 dark:text-dark-400">{lead.email}</div>
              </td>

              {/* Status */}
              <td className="py-4 px-6">
                <span className={clsx('px-2.5 py-1 rounded-full text-xs font-medium border', getStatusBadge(lead.status))}>
                  {lead.status}
                </span>
              </td>

              {/* Source */}
              <td className="py-4 px-6">
                <span className={clsx('px-2.5 py-1 rounded-full text-xs font-medium border', getSourceBadge(lead.source))}>
                  {lead.source}
                </span>
              </td>

              {/* Assigned To */}
              <td className="py-4 px-6">
                <div className="text-dark-700 dark:text-dark-300 font-medium text-xs flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 flex items-center justify-center font-bold text-[10px]">
                    {lead.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span>{lead.assignedTo?.name || 'Unassigned'}</span>
                </div>
              </td>

              {/* Created */}
              <td className="py-4 px-6 text-dark-500 dark:text-dark-400 text-xs">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-dark-400" />
                  <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </td>

              {/* Actions */}
              <td className="py-4 px-6 text-right space-x-1">
                <button
                  onClick={() => onView(lead)}
                  className="p-2 rounded-xl text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(lead)}
                  className="p-2 rounded-xl text-dark-500 hover:text-brand-600 dark:text-dark-400 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                  title="Edit Lead"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(lead)}
                  className="p-2 rounded-xl text-dark-500 hover:text-red-600 dark:text-dark-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                  title="Delete Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
