import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  type?: 'card' | 'table' | 'text';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, type = 'text', count = 1 }) => {
  const elements = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <>
        {elements.map((i) => (
          <div
            key={i}
            className={clsx(
              'p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 animate-pulse space-y-4',
              className
            )}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-dark-200 dark:bg-dark-800 rounded-md" />
              <div className="h-10 w-10 bg-dark-200 dark:bg-dark-800 rounded-xl" />
            </div>
            <div className="h-8 w-32 bg-dark-200 dark:bg-dark-800 rounded-md" />
            <div className="h-3 w-48 bg-dark-200 dark:bg-dark-800 rounded-md" />
          </div>
        ))}
      </>
    );
  }

  if (type === 'table') {
    return (
      <div className={clsx('w-full bg-white dark:bg-dark-900 rounded-2xl border border-dark-200 dark:border-dark-800 overflow-hidden animate-pulse', className)}>
        <div className="h-14 bg-dark-100 dark:bg-dark-800 border-b border-dark-200 dark:border-dark-800 px-6 flex items-center justify-between">
          <div className="h-4 w-24 bg-dark-200 dark:bg-dark-700 rounded-md" />
          <div className="h-4 w-32 bg-dark-200 dark:bg-dark-700 rounded-md" />
          <div className="h-4 w-20 bg-dark-200 dark:bg-dark-700 rounded-md" />
          <div className="h-4 w-28 bg-dark-200 dark:bg-dark-700 rounded-md" />
          <div className="h-4 w-16 bg-dark-200 dark:bg-dark-700 rounded-md" />
        </div>
        {elements.map((i) => (
          <div key={i} className="h-16 border-b border-dark-100 dark:border-dark-800 px-6 flex items-center justify-between">
            <div className="h-4 w-28 bg-dark-200 dark:bg-dark-800 rounded-md" />
            <div className="h-4 w-40 bg-dark-200 dark:bg-dark-800 rounded-md" />
            <div className="h-6 w-20 bg-dark-200 dark:bg-dark-800 rounded-full" />
            <div className="h-6 w-24 bg-dark-200 dark:bg-dark-800 rounded-full" />
            <div className="h-8 w-8 bg-dark-200 dark:bg-dark-800 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {elements.map((i) => (
        <div
          key={i}
          className={clsx('h-4 bg-dark-200 dark:bg-dark-800 rounded-md animate-pulse', className)}
        />
      ))}
    </>
  );
};
