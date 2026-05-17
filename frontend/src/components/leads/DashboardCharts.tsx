import React from 'react';
import type { DashboardStats } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardChartsProps {
  stats: DashboardStats;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  const statusData = [
    { name: 'New', count: stats.byStatus.New },
    { name: 'Contacted', count: stats.byStatus.Contacted },
    { name: 'Qualified', count: stats.byStatus.Qualified },
    { name: 'Lost', count: stats.byStatus.Lost },
  ];

  const sourceData = [
    { name: 'Website', count: stats.bySource.Website },
    { name: 'Instagram', count: stats.bySource.Instagram },
    { name: 'Referral', count: stats.bySource.Referral },
  ];

  const SOURCE_COLORS = ['#a855f7', '#ec4899', '#6366f1'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leads by Status Bar Chart */}
      <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-dark-200 dark:border-dark-800 shadow-sm transition-colors duration-200 space-y-4">
        <h3 className="text-base font-semibold text-dark-900 dark:text-white">Leads by Status</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
              />
              <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads by Source Pie Chart */}
      <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-dark-200 dark:border-dark-800 shadow-sm transition-colors duration-200 space-y-4">
        <h3 className="text-base font-semibold text-dark-900 dark:text-white">Leads by Source</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="count"
              >
                {sourceData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend
                formatter={(value) => <span className="text-xs text-dark-700 dark:text-dark-300 font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
