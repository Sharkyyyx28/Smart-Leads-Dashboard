import React from 'react';
import type { PaginationMeta } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { page, pages, hasNextPage, hasPrevPage, total } = meta;

  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-800 transition-colors duration-200">
      <div className="text-sm text-dark-500 dark:text-dark-400">
        Showing page <span className="font-semibold text-dark-900 dark:text-white">{page}</span> of{' '}
        <span className="font-semibold text-dark-900 dark:text-white">{pages}</span> ({total} total leads)
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={clsx(
            'flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border border-dark-200 dark:border-dark-800 transition-colors',
            hasPrevPage
              ? 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
              : 'text-dark-300 dark:text-dark-700 cursor-not-allowed bg-dark-50/50 dark:bg-dark-900'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={clsx(
                'w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150 flex items-center justify-center',
                p === page
                  ? 'bg-brand-500 text-white font-semibold shadow-sm shadow-brand-500/20'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800'
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={clsx(
            'flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border border-dark-200 dark:border-dark-800 transition-colors',
            hasNextPage
              ? 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
              : 'text-dark-300 dark:text-dark-700 cursor-not-allowed bg-dark-50/50 dark:bg-dark-900'
          )}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
