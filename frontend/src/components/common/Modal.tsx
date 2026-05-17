import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-2xl p-6 z-10 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-dark-200 dark:border-dark-800">
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
