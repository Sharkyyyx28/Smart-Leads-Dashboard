import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { LeadsFilterBar } from '../components/leads/LeadsFilterBar';
import { LeadsTable } from '../components/leads/LeadsTable';
import { Pagination } from '../components/common/Pagination';
import { LeadModal } from '../components/leads/LeadModal';
import { LeadDetailModal } from '../components/leads/LeadDetailModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Skeleton } from '../components/common/Skeleton';
import type { Lead, LeadsFilterParams, LeadStatus, LeadSource } from '../types';
import { Plus, AlertCircle } from 'lucide-react';

export const Leads: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL search params
  const filters: LeadsFilterParams = {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    status: (searchParams.get('status') as LeadStatus) || '',
    source: (searchParams.get('source') as LeadSource) || '',
    search: searchParams.get('search') || '',
    sort: (searchParams.get('sort') as 'Latest' | 'Oldest') || 'Latest',
  };

  const { data, isLoading, isError } = useLeads(filters);
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Sync filters to URL query params
  const handleFilterChange = (newFilters: Partial<LeadsFilterParams>) => {
    const updated = { ...filters, ...newFilters };
    const params = new URLSearchParams();

    if (updated.page && updated.page > 1) params.set('page', updated.page.toString());
    if (updated.limit && updated.limit !== 10) params.set('limit', updated.limit.toString());
    if (updated.status) params.set('status', updated.status);
    if (updated.source) params.set('source', updated.source);
    if (updated.search) params.set('search', updated.search);
    if (updated.sort && updated.sort !== 'Latest') params.set('sort', updated.sort);

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleCreateSubmit = async (values: Partial<Lead>) => {
    await createLeadMutation.mutateAsync(values);
    setIsCreateModalOpen(false);
  };

  const handleUpdateSubmit = async (values: Partial<Lead>) => {
    if (!selectedLead) return;
    await updateLeadMutation.mutateAsync({ id: selectedLead._id, data: values });
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead) return;
    await deleteLeadMutation.mutateAsync(selectedLead._id);
    setIsConfirmModalOpen(false);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConfirmModalOpen(true);
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Title & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Leads Management</h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Search, filter, and manage your sales pipeline leads
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition-all shadow-sm shadow-brand-500/20 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter Bar */}
      <LeadsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Main Content / Table */}
      {isLoading ? (
        <Skeleton type="table" />
      ) : isError ? (
        <div className="p-12 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Failed to load leads</h3>
          <p className="text-sm text-red-600 dark:text-red-400">Please check your network connection or try refreshing the page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <LeadsTable
            leads={data?.leads || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />

          {data?.meta && (
            <Pagination
              meta={data.meta}
              onPageChange={(page) => handleFilterChange({ page })}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <LeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createLeadMutation.isPending}
      />

      <LeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        initialData={selectedLead}
        isLoading={updateLeadMutation.isPending}
      />

      <LeadDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lead={selectedLead}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLeadMutation.isPending}
      />
    </div>
  );
};
