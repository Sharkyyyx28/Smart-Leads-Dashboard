import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this lead? This action cannot be undone.',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900/50">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm text-dark-600 dark:text-dark-300 px-4">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-dark-200 dark:border-dark-800 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Deleting...</span>
            </>
          ) : (
            <span>Delete Lead</span>
          )}
        </button>
      </div>
    </Modal>
  );
};
