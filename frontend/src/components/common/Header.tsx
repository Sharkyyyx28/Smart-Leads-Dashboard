import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Sun, Moon, LogOut, User as UserIcon, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <header className="h-16 border-b border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-dark-900 dark:text-white">Smart Leads</h2>
        {user?.role === 'Admin' && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            <Shield className="w-3.5 h-3.5" />
            Admin Mode
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-6 w-px bg-dark-200 dark:bg-dark-800" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-dark-900 dark:text-white leading-none mb-1">
              {user?.name}
            </p>
            <p className="text-xs text-dark-500 dark:text-dark-400 leading-none">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
