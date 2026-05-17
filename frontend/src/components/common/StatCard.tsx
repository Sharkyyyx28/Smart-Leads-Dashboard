import React from 'react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBg = 'bg-brand-50 dark:bg-brand-950/50',
  iconColor = 'text-brand-600 dark:text-brand-400',
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm flex items-center justify-between transition-colors duration-200">
      <div className="space-y-1">
        <p className="text-sm font-medium text-dark-500 dark:text-dark-400">{title}</p>
        <p className="text-2xl font-bold text-dark-900 dark:text-white">{value}</p>
      </div>

      <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center border border-dark-100 dark:border-dark-800', iconBg, iconColor)}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
