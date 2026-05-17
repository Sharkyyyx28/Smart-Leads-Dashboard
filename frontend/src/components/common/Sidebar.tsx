import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads Table', path: '/leads', icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 transition-colors duration-200">
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150',
                    isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 font-semibold shadow-sm border border-brand-100 dark:border-brand-900/50'
                      : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800/50 hover:text-dark-900 dark:hover:text-white'
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="p-6 border-t border-dark-200 dark:border-dark-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-500 dark:text-dark-400 text-sm hover:bg-dark-50 dark:hover:bg-dark-800/50 cursor-pointer transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span>Documentation</span>
        </div>
      </div>
    </aside>
  );
};
