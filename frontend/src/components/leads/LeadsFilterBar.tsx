import React, { useState, useEffect } from 'react';
import type { LeadsFilterParams, LeadStatus, LeadSource } from '../../types';
import { Search, Filter, RefreshCw, Download } from 'lucide-react';
import { exportLeadsCsv } from '../../hooks/useLeads';

interface LeadsFilterBarProps {
  filters: LeadsFilterParams;
  onFilterChange: (newFilters: Partial<LeadsFilterParams>) => void;
  onReset: () => void;
}

export const LeadsFilterBar: React.FC<LeadsFilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange({ search: searchTerm, page: 1 });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, filters.search, onFilterChange]);

  const handleExport = () => {
    exportLeadsCsv(filters);
  };

  return (
    <div className="bg-white dark:bg-dark-900 p-4 rounded-2xl border border-dark-200 dark:border-dark-800 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4 transition-colors duration-200">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 dark:text-dark-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search leads by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-dark-400 dark:text-dark-500 hidden sm:block" />
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: (e.target.value as LeadStatus) || '', page: 1 })}
            className="py-2.5 px-3.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Source Filter */}
        <select
          value={filters.source || ''}
          onChange={(e) => onFilterChange({ source: (e.target.value as LeadSource) || '', page: 1 })}
          className="py-2.5 px-3.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        {/* Sort Order */}
        <select
          value={filters.sort || 'Latest'}
          onChange={(e) => onFilterChange({ sort: e.target.value as 'Latest' | 'Oldest', page: 1 })}
          className="py-2.5 px-3.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
        >
          <option value="Latest">Latest First</option>
          <option value="Oldest">Oldest First</option>
        </select>

        {/* Reset Filters */}
        <button
          onClick={() => {
            setSearchTerm('');
            onReset();
          }}
          className="p-2.5 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors flex items-center gap-1.5 text-sm font-medium"
          title="Reset Filters"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* CSV Export Button */}
        <button
          onClick={handleExport}
          className="py-2.5 px-4 rounded-xl bg-brand-500 text-white font-medium text-sm hover:bg-brand-600 transition-all shadow-sm shadow-brand-500/20 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};
