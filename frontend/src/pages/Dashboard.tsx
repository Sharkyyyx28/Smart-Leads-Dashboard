import React, { useState } from 'react';
import { useDashboardStats, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { StatCard } from '../components/common/StatCard';
import { DashboardCharts } from '../components/leads/DashboardCharts';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadModal } from '../components/leads/LeadModal';
import { LeadDetailModal } from '../components/leads/LeadDetailModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Skeleton } from '../components/common/Skeleton';
import type { Lead } from '../types';
import { Users, UserCheck, AlertCircle, PhoneCall, TrendingDown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading, isError } = useDashboardStats();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton type="card" count={4} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton type="card" count={2} />
        </div>
        <Skeleton type="table" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-12 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl text-center space-y-3">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Failed to load dashboard data</h3>
        <p className="text-sm text-red-600 dark:text-red-400">Please check your network connection or try refreshing the page.</p>
      </div>
    );
  }

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

  const handleUpdateSubmit = async (data: Partial<Lead>) => {
    if (!selectedLead) return;
    await updateLeadMutation.mutateAsync({ id: selectedLead._id, data });
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead) return;
    await deleteLeadMutation.mutateAsync(selectedLead._id);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Monitor your lead generation metrics and recent pipeline activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={Users}
          iconBg="bg-blue-50 dark:bg-blue-950/50"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="New Leads"
          value={stats.byStatus.New}
          icon={UserCheck}
          iconBg="bg-brand-50 dark:bg-brand-950/50"
          iconColor="text-brand-600 dark:text-brand-400"
        />
        <StatCard
          title="Contacted"
          value={stats.byStatus.Contacted}
          icon={PhoneCall}
          iconBg="bg-amber-50 dark:bg-amber-950/50"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Lost Leads"
          value={stats.byStatus.Lost}
          icon={TrendingDown}
          iconBg="bg-red-50 dark:bg-red-950/50"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>

      {/* Recharts Dashboard Charts */}
      <DashboardCharts stats={stats} />

      {/* Recent Leads Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white">Recent Pipeline Activity</h2>
        <LeadsTable
          leads={stats.recentLeads}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* Modals */}
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
